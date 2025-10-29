'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/app/lib/supabase/server';

export async function toggleGrievanceSupport(grievanceId: string) {
  try {
    const cookieStore = await cookies();
    let supportToken = cookieStore.get('support-token')?.value;
    
    if (!supportToken) {
      supportToken = uuidv4();
      cookieStore.set({
        name: 'support-token',
        value: supportToken,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      });
    }

    // Check if user has already supported this grievance
    const { data: existingSupport } = await supabaseAdmin
      .from('grievance_supports')
      .select('id')
      .eq('grievance_id', grievanceId)
      .eq('supporter_ip', supportToken)
      .single();

    if (existingSupport) {
      // Remove support
      await supabaseAdmin
        .from('grievance_supports')
        .delete()
        .eq('id', existingSupport.id);
      
      return { success: true, action: 'removed' };
    } else {
      // Add support
      await supabaseAdmin
        .from('grievance_supports')
        .insert({
          grievance_id: grievanceId,
          supporter_ip: supportToken
        });
      
      return { success: true, action: 'added' };
    }
  } catch (error) {
    console.error('Error toggling support:', error);
    return { success: false, error: 'Failed to toggle support' };
  }
}

export async function getGrievanceSupports(grievanceId: string) {
  try {
    const { count, error } = await supabaseAdmin
      .from('grievance_supports')
      .select('*', { count: 'exact', head: true })
      .eq('grievance_id', grievanceId);

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error getting support count:', error);
    return { success: false, error: 'Failed to get support count' };
  }
}