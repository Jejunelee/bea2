'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import Header from './Header';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          router.push('/admin/login');
          return;
        }
        
        if (!session) {
          console.log('No session found, redirecting to login');
          router.push('/admin/login');
        } else {
          console.log('User authenticated:', session.user.email);
          setUser(session.user);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const sections = {
    landing: [
      { href: "/admin/hero", title: "Hero Section" },
      { href: "/admin/ticker", title: "Ticker Section" },
      { href: "/admin/familiar", title: "Familiar Section" },
      { href: "/admin/quote", title: "Quote Section" },
      { href: "/admin/aboutme", title: "About Me Section" },
      { href: "/admin/stats", title: "Stats Section" },
      { href: "/admin/latest", title: "Latest Section" },
      { href: "/admin/belief", title: "Belief Section" },
      { href: "/admin/getstarted", title: "Get Started Section" },
      { href: "/admin/packages", title: "Packages" }
    ],
    brands: [
      { href: "/admin/brandheader", title: "Brand Header" },
      { href: "/admin/brandpackages", title: "Brand Packages" }
    ],
    individual: [
      { href: "/admin/peopleheader", title: "Individual Header" },
      { href: "/admin/peoplesection1", title: "Messaging Audit" },
      { href: "/admin/peoplesection2", title: "Origin Series" },
      { href: "/admin/peoplesection3", title: "AI For Marketing" }
    ],
    work: [
      { href: "/admin/workheader", title: "Work Header" },
      { href: "/admin/worksection1", title: "Social Feed" },
      { href: "/admin/workedwith", title: "Worked With" }
    ]
  };

  const tabs = [
    { id: 'landing', label: 'Landing', color: 'purple' },
    { id: 'brands', label: 'For Brands', color: 'blue' },
    { id: 'individual', label: 'For Individual (People)', color: 'green' },
    { id: 'work', label: 'Work', color: 'orange' }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { active: string, hover: string, bg: string, text: string }> = {
      purple: { active: 'border-purple-600 text-purple-600', hover: 'hover:border-purple-300', bg: 'bg-purple-50', text: 'text-purple-600' },
      blue: { active: 'border-blue-600 text-blue-600', hover: 'hover:border-blue-300', bg: 'bg-blue-50', text: 'text-blue-600' },
      green: { active: 'border-green-600 text-green-600', hover: 'hover:border-green-300', bg: 'bg-green-50', text: 'text-green-600' },
      orange: { active: 'border-orange-600 text-orange-600', hover: 'hover:border-orange-300', bg: 'bg-orange-50', text: 'text-orange-600' }
    };
    return colors[color];
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const currentColor = getColorClasses(currentTab?.color || 'purple');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userEmail={user.email} onLogout={handleLogout} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-2 font-medium text-base transition-all relative
                  ${activeTab === tab.id 
                    ? `${getColorClasses(tab.color).text} border-b-2 ${getColorClasses(tab.color).active.split(' ')[0]}` 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Section Header */}
          <div className={`${currentColor.bg} px-6 py-4 border-b border-gray-200`}>
            <h2 className={`text-xl font-bold ${currentColor.active}`}>
              {currentTab?.label}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {sections[activeTab as keyof typeof sections].length} sections available
            </p>
          </div>

          {/* Section Items */}
          <div className="divide-y divide-gray-100">
            {sections[activeTab as keyof typeof sections].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition group"
              >
                <span className="text-gray-800 font-medium group-hover:text-gray-900">
                  {item.title}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 group-hover:${currentColor.text} transition`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}