'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('landing');

  const sections = {
    landing: [
      { href: "/admin/Landing/hero", title: "Hero Section" },
      { href: "/admin/Landing/aboutme", title: "About Me Section" },
      { href: "/admin/Landing/testimonials", title: "Testimonials Slider" }
    ],
    storyaudit: [
      { href: "/admin/StoryAudit/hero", title: "Hero Section" },
      { href: "/admin/StoryAudit/problem-statement", title: "Problem Statement" },
      { href: "/admin/StoryAudit/outcomes", title: "Outcomes" },
      { href: "/admin/StoryAudit/what-is-reviewed", title: "What Is Reviewed" },
      { href: "/admin/StoryAudit/timeline", title: "Timeline" },
      { href: "/admin/StoryAudit/cta", title: "CTA Section" },
      { href: "/admin/StoryAudit/faq", title: "FAQ Section" },
      { href: "/admin/StoryAudit/consider-this-if", title: "Consider This If" },
      { href: "/admin/StoryAudit/testimonials", title: "Testimonials" }
    ],
    storyfoundation: [
      { href: "/admin/StoryFoundation/hero", title: "Hero Section" },
      { href: "/admin/StoryFoundation/bridge-statement", title: "Bridge Statement" },
      { href: "/admin/StoryFoundation/consider-this-if", title: "Consider This If" },
      { href: "/admin/StoryFoundation/cta", title: "CTA Section" },
      { href: "/admin/StoryFoundation/faq", title: "FAQ Section" },
      { href: "/admin/StoryFoundation/how-it-runs", title: "How It Runs" },
      { href: "/admin/StoryFoundation/how-this-works", title: "How This Works" },
      { href: "/admin/StoryFoundation/what-you-get", title: "What You Get" },
      { href: "/admin/StoryFoundation/what-you-walk-away-with", title: "What You Walk Away With" }
    ],
    commsadvisory: [
      { href: "/admin/CommunicationsAdvisory/hero", title: "Hero Section" },
      { href: "/admin/CommunicationsAdvisory/bridge-statement", title: "Bridge Statement" },
      { href: "/admin/CommunicationsAdvisory/consider-this-if", title: "Consider This If" },
      { href: "/admin/CommunicationsAdvisory/cta", title: "CTA Section" },
      { href: "/admin/CommunicationsAdvisory/faq", title: "FAQ Section" },
      { href: "/admin/CommunicationsAdvisory/how-engagement-runs", title: "How Engagement Runs" },
      { href: "/admin/CommunicationsAdvisory/what-advisory-includes", title: "What Advisory Includes" }
    ],
    fractionalcomms: [
      { href: "/admin/FractionalCommunication/hero", title: "Hero Section" },
      { href: "/admin/FractionalCommunication/bridge-statement", title: "Bridge Statement" },
      { href: "/admin/FractionalCommunication/case-studies", title: "Case Studies" },
      { href: "/admin/FractionalCommunication/consider-this-if", title: "Consider This If" },
      { href: "/admin/FractionalCommunication/cta", title: "CTA Section" },
      { href: "/admin/FractionalCommunication/faq", title: "FAQ Section" },
      { href: "/admin/FractionalCommunication/how-engagement-runs", title: "How Engagement Runs" },
      { href: "/admin/FractionalCommunication/how-this-works", title: "How This Works" },
      { href: "/admin/FractionalCommunication/what-i-run", title: "What I Run" },
      { href: "/admin/FractionalCommunication/what-you-get", title: "What You Get" }
    ]
  };

  const tabs = [
    { id: 'landing', label: 'Landing', color: 'purple', count: sections.landing.length },
    { id: 'storyaudit', label: 'Story Audit', color: 'blue', count: sections.storyaudit.length },
    { id: 'storyfoundation', label: 'Story Foundation', color: 'green', count: sections.storyfoundation.length },
    { id: 'commsadvisory', label: 'Comms Advisory', color: 'orange', count: sections.commsadvisory.length },
    { id: 'fractionalcomms', label: 'Fractional Comms', color: 'pink', count: sections.fractionalcomms.length }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { active: string, hover: string, bg: string, text: string, border: string }> = {
      purple: { 
        active: 'border-purple-600 text-purple-600', 
        hover: 'hover:border-purple-300', 
        bg: 'bg-purple-50', 
        text: 'text-purple-600',
        border: 'border-purple-600'
      },
      blue: { 
        active: 'border-blue-600 text-blue-600', 
        hover: 'hover:border-blue-300', 
        bg: 'bg-blue-50', 
        text: 'text-blue-600',
        border: 'border-blue-600'
      },
      green: { 
        active: 'border-green-600 text-green-600', 
        hover: 'hover:border-green-300', 
        bg: 'bg-green-50', 
        text: 'text-green-600',
        border: 'border-green-600'
      },
      orange: { 
        active: 'border-orange-600 text-orange-600', 
        hover: 'hover:border-orange-300', 
        bg: 'bg-orange-50', 
        text: 'text-orange-600',
        border: 'border-orange-600'
      },
      pink: { 
        active: 'border-pink-600 text-pink-600', 
        hover: 'hover:border-pink-300', 
        bg: 'bg-pink-50', 
        text: 'text-pink-600',
        border: 'border-pink-600'
      }
    };
    return colors[color];
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const currentColor = getColorClasses(currentTab?.color || 'purple');

  // Helper function to get color for hover arrow
  const getArrowColorClass = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'group-hover:text-purple-600',
      blue: 'group-hover:text-blue-600',
      green: 'group-hover:text-green-600',
      orange: 'group-hover:text-orange-600',
      pink: 'group-hover:text-pink-600'
    };
    return colors[color] || 'group-hover:text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Content Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage all sections across your website</p>
            </div>
            <div className="text-xs text-gray-400">
              Total: {tabs.reduce((acc, tab) => acc + (sections[tab.id as keyof typeof sections]?.length || 0), 0)} sections
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2.5 font-medium text-sm transition-all rounded-t-lg whitespace-nowrap
                  ${activeTab === tab.id 
                    ? `${currentTab?.id === tab.id ? currentColor.active : getColorClasses(tab.color).active} bg-white border-t border-x border-gray-200`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id 
                      ? getColorClasses(tab.color).bg
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${currentColor.text}`}>
              {currentTab?.label}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {sections[activeTab as keyof typeof sections].length} available sections
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Click any section to edit
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections[activeTab as keyof typeof sections].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-mono ${currentColor.text} opacity-60`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${currentColor.bg} ${currentColor.text} opacity-50`} />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-700 transition">
                      {item.title}
                    </h3>
                  </div>
                  <div className={`${currentColor.text} opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 truncate">
                    {item.href}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sections[activeTab as keyof typeof sections].length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No sections available for {currentTab?.label}</p>
            <p className="text-sm text-gray-400 mt-1">Sections will appear here as they are added</p>
          </div>
        )}
      </div>
    </div>
  );
}