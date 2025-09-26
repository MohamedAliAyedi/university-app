'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function LogoutButton({ variant = 'outline', size = 'default', className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await api.logout();
      
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}