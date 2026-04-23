// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import Header from './Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
      
      // Redirect to login if no session
      if (!session) {
        router.push('/admin/login');
      }
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isLoginPage) {
        setUser(session?.user || null);
        if (!session) {
          router.push('/admin/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  // For login page, just render children without Header
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        userEmail={user.email}
        userName={userName}
        onLogout={async () => {
          await supabase.auth.signOut();
          router.push('/admin/login');
          router.refresh();
        }}
      />
      <main>
        {children}
      </main>
    </div>
  );
}