import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleGrievanceSupport } from '@/app/lib/actions/support';

interface SupportButtonProps {
  grievanceId: string;
  initialCount: number;
  initialSupported?: boolean;
}

export function SupportButton({ grievanceId, initialCount, initialSupported = false }: SupportButtonProps) {
  const [supportCount, setSupportCount] = useState(initialCount);
  const [isSupported, setIsSupported] = useState(initialSupported);
  const [isLoading, setIsLoading] = useState(false);

  const handleSupport = async () => {
    try {
      setIsLoading(true);
      const result = await toggleGrievanceSupport(grievanceId);
      
      if (result.success) {
        if (result.action === 'added') {
          setSupportCount(prev => prev + 1);
          setIsSupported(true);
        } else {
          setSupportCount(prev => prev - 1);
          setIsSupported(false);
        }
      }
    } catch (error) {
      console.error('Failed to toggle support:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSupport}
      disabled={isLoading}
      className={cn(
        'gap-2 transition-colors',
        isSupported && 'bg-pink-100 border-pink-200 hover:bg-pink-200 hover:border-pink-300'
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isSupported ? 'fill-pink-500 stroke-pink-500' : 'stroke-gray-500'
        )}
      />
      <span className="text-sm">{supportCount}</span>
    </Button>
  );
}