// app/admin/page.tsx (or app/admin/dashboard/page.tsx)
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('landing');

  const sections = {
    landing: [
      { href: "/admin/hero", title: "Hero Section" },
      { href: "/admin/ticker", title: "Ticker Bar Section" },
      { href: "/admin/familiar", title: "Painpoints Section" },
      { href: "/admin/quote", title: "Statement Section" },
      { href: "/admin/aboutme", title: "About Me Section" },
      { href: "/admin/stats", title: "Proof (Statistics) Section" },
      { href: "/admin/latest", title: "Latest Drops Section" },
      { href: "/admin/belief", title: "Opinions Section" },
      { href: "/admin/getstarted", title: "Get Started Section" },
      { href: "/admin/packages", title: "Packages Section" }
    ],
    brands: [
      { href: "/admin/brandheader", title: "Header Section" },
      { href: "/admin/brandpackages", title: "Brand Packages Section" }
    ],
    individual: [
      { href: "/admin/peopleheader", title: "Header Section" },
      { href: "/admin/peoplesection1", title: "Messaging Audit Section" },
      { href: "/admin/peoplesection2", title: "Origin Series Section" },
      { href: "/admin/peoplesection3", title: "AI For Marketing Section" }
    ],
    work: [
      { href: "/admin/workheader", title: "Header Section" },
      { href: "/admin/worksection1", title: "Social Feed Section" },
      { href: "/admin/workedwith", title: "Brands/People Worked With Section" }
    ]
  };

  const tabs = [
    { id: 'landing', label: 'Landing', color: 'purple' },
    { id: 'brands', label: 'For Brands', color: 'blue' },
    { id: 'individual', label: 'For Individual', color: 'green' },
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

  return (
    <div className="px-6 py-8">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 rounded-t-lg">
        <div className="px-6">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-3 px-1 font-medium text-sm transition-all relative
                  ${activeTab === tab.id 
                    ? `${getColorClasses(tab.color).text} border-b-2 ${getColorClasses(tab.color).active.split(' ')[0]}` 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600 rounded-full`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content - Condensed List View */}
      <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 overflow-hidden">
        {/* Section Header */}
        <div className={`${currentColor.bg} px-5 py-3 border-b border-gray-200`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-base font-semibold ${currentColor.active}`}>
              {currentTab?.label}
            </h2>
            <p className="text-xs text-gray-500">
              {sections[activeTab as keyof typeof sections].length} sections
            </p>
          </div>
        </div>

        {/* List Items - Compact */}
        <div className="divide-y divide-gray-100">
          {sections[activeTab as keyof typeof sections].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono w-6">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                  {item.title}
                </span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 group-hover:${currentColor.text} transition transform group-hover:translate-x-0.5`} 
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
  );
}