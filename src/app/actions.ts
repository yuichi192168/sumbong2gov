
'use server';

import 'dotenv/config';
import type { z } from 'zod';
import { grievanceActionSchema } from '@/app/lib/schemas';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { supabase } from '@/app/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';

// Environment variable validation
function validateEnvironment() {
  const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Call this at startup
validateEnvironment();

export type GrievanceRecord = z.infer<typeof grievanceActionSchema> & {
  id?: string;
  created_at?: string;
  priority?: string;
  severity?: string;
  impact_description?: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  agency_id?: string;
  image_url?: string;
};

// --- AUTH ACTIONS ---
const SESSION_COOKIE_NAME = 'admin-session';

export async function login(prevState: { message: string }, formData: FormData) {
  let success = false;
  try {
    const password = formData.get('password') as string;
    
    // Fetch the hashed password from the database
    const { data: hashData, error: hashError } = await supabaseAdmin
      .from('admin_password_hash')
      .select('hash')
      .limit(1)
      .single();

    if (hashError || !hashData) {
      console.error('Error fetching password hash from Supabase:', hashError);
      return { message: 'Configuration error: Could not retrieve admin credentials.' };
    }

    const hashedPassword = hashData.hash;

    // Compare the provided password with the stored hash
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordsMatch) {
      const sessionData = JSON.stringify({ isAuthenticated: true, loggedInAt: Date.now() });
      cookies().set(SESSION_COOKIE_NAME, sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      });
      success = true;
    } else {
      return { message: 'Invalid password.' };
    }
  } catch (error) {
    console.error('Login failed:', error);
    return { message: 'An unexpected server error occurred. Please check the server logs.' };
  }

  if (success) {
    redirect('/admin');
  }
  // This part should not be reached if redirect happens, but is needed for type safety
  return { message: '' };
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}

// --- GRIEVANCE ACTIONS ---

// Helper to transform imgur links
function transformImgurUrl(url: string): string {
    if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/');
        const imageId = pathParts.pop(); // get the last part of the path
        return `https://i.imgur.com/${imageId}.png`; // assume .png, as it's most common
    }
    return url;
}

export async function submitGrievance(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());

    // Manually convert isAnonymous to boolean
    const isAnonymousValue = rawData.isAnonymous === 'true';

    const validatedFields = grievanceActionSchema.safeParse({
      ...rawData,
      isAnonymous: isAnonymousValue,
      imageUrl: rawData.imageUrl || undefined,
    });

    if (!validatedFields.success) {
      return { 
        success: false, 
        message: 'Invalid data provided. Please check the form for errors.',
        errors: validatedFields.error.flatten() 
      };
    }
    
    let finalImageUrl: string | null = validatedFields.data.imageUrl || null;
    const imageFile = formData.get('image') as File | null;

    // Handle image upload, which takes precedence over URL
    if (imageFile && imageFile.size > 0) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('grievance-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Supabase storage error:', uploadError);
        return { 
          success: false, 
          message: 'Failed to upload image. ' + uploadError.message 
        };
      }
      
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('grievance-images')
        .getPublicUrl(uploadData.path);
        
      finalImageUrl = publicUrlData.publicUrl;
    } else if (finalImageUrl) {
      // If no file, but there is a URL, transform it if it's an Imgur link
      finalImageUrl = transformImgurUrl(finalImageUrl);
    }

    const { agencyId, submitterName, submitterEmail, isAnonymous, imageUrl, ...restOfData } = validatedFields.data;

    const submissionData = {
      ...restOfData,
      submitter_name: isAnonymous ? null : submitterName,
      submitter_email: isAnonymous ? null : submitterEmail,
      agency_id: agencyId,
      image_url: finalImageUrl,
      status: 'pending' as const,
      location: validatedFields.data.location,
    };
    
    // Insert grievance into Supabase
    const { data: grievance, error } = await supabaseAdmin
      .from('grievances')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return { 
        success: false, 
        message: 'Failed to submit sumbong. The database returned an error: ' + error.message
      };
    }
    
    return { 
      success: true, 
      message: 'Your sumbong has been submitted successfully.',
      grievanceId: grievance.id
    };

  } catch (error) {
    console.error('Grievance submission failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { 
      success: false, 
      message: `An unexpected error occurred: ${message}` 
    };
  }
}

// Additional server actions for grievance management

export async function getGrievances(status?: string, limit = 50) {
  try {
    let query = supabase
      .from('grievance_with_support_count')
      .select('*, agencies(name)')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return { success: false, error: 'Failed to fetch grievances: ' + error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Get grievances failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `An unexpected error occurred: ${message}` };
  }
}

export async function getGrievanceById(id: string) {
  try {
    const cookieStore = await cookies();
    const supportTokenCookie = cookieStore.get('support-token');
    const supportToken = supportTokenCookie?.value;

    // Get grievance data with support count
    const { data: grievance, error: grievanceError } = await supabase
      .from('grievance_with_support_count')
      .select('*, agencies(name)')
      .eq('id', id)
      .single();

    if (grievanceError) {
      console.error('Supabase query error:', grievanceError);
      return { success: false, error: 'Grievance not found: ' + grievanceError.message };
    }

    // If we have a support token, check if user has supported this grievance
    let isSupported = false;
    if (supportToken) {
      const { data: supportData } = await supabase
        .from('grievance_supports')
        .select('id')
        .eq('grievance_id', id)
        .eq('supporter_ip', supportToken)
        .single();

      isSupported = !!supportData;
    }

    return { 
      success: true, 
      data: { 
        ...grievance, 
        isSupported 
      } 
    };
  } catch (error) {
    console.error('Get grievance failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `An unexpected error occurred: ${message}` };
  }
}

export async function updateGrievanceStatus(id: string, status: string, adminNotes?: string) {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid grievance ID' };
    }

    const validStatuses = ['pending', 'in_review', 'resolved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Invalid status value' };
    }
    
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (adminNotes !== undefined && adminNotes !== null) {
      updateData.admin_notes = adminNotes;
    }

    const { data, error } = await supabaseAdmin
      .from('grievances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Grievance not found or has been deleted.' };
      }
      return { success: false, error: `Database error during update: ${error.message}` };
    }

    if (!data) {
        return { success: false, error: 'Grievance not found after update attempt.' };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Update grievance failed unexpectedly:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `An unexpected server error occurred: ${message}` };
  }
}


export async function deleteGrievance(id: string) {
    try {
      const { error } = await supabaseAdmin
        .from('grievances')
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error('Supabase delete error:', error);
        return { success: false, error: 'Failed to delete grievance: ' + error.message };
      }
  
      return { success: true };
    } catch (error) {
      console.error('Delete grievance failed:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      return { success: false, error: `An unexpected error occurred: ${message}` };
    }
}

export async function getGrievanceStats() {
  try {
    const { data, error } = await supabase
      .from('grievances')
      .select('status, priority');

    if (error) {
      console.error('Supabase query error:', error);
      return { success: false, error: 'Failed to fetch statistics: ' + error.message };
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(g => g.status === 'pending').length || 0,
      in_review: data?.filter(g => g.status === 'in_review').length || 0,
      resolved: data?.filter(g => g.status === 'resolved').length || 0,
      rejected: data?.filter(g => g.status === 'rejected').length || 0,
      byPriority: {
        critical: data?.filter(g => g.priority === 'critical').length || 0,
        high: data?.filter(g => g.priority === 'high').length || 0,
        medium: data?.filter(g => g.priority === 'medium').length || 0,
        low: data?.filter(g => g.priority === 'low').length || 0,
      }
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Get stats failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `An unexpected error occurred: ${message}` };
  }
}

export async function getAgencies() {
  try {
    const { data, error } = await supabase.from('agencies').select('id, name');
    if (error) {
      console.error('Supabase getAgencies error:', error);
      return { success: false, error: 'Failed to fetch agencies: ' + error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Get agencies failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `An unexpected error occurred: ${message}` };
  }
}
