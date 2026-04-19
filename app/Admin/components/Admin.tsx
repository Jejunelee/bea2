// Admin.tsx
"use client";
import React, { useState } from 'react';
import Landing from './Landing';
import ForBrands from './ForBrands';
import ForIndividuals from './ForIndividuals';
import MyWork from './MyWork';

// Data interfaces for each section
interface LandingDataType {
  // This will be populated by the Landing component
  [key: string]: any;
}

interface ForBrandsDataType {
  [key: string]: any;
}

interface ForIndividualsDataType {
  [key: string]: any;
}

interface MyWorkDataType {
  [key: string]: any;
}

type SectionId = 'landing' | 'brands' | 'individuals' | 'work';

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('landing');
  const [landingData, setLandingData] = useState<LandingDataType>({});
  const [forBrandsData, setForBrandsData] = useState<ForBrandsDataType>({});
  const [forIndividualsData, setForIndividualsData] = useState<ForIndividualsDataType>({});
  const [myWorkData, setMyWorkData] = useState<MyWorkDataType>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Handle data changes for each section
  const handleLandingChange = (data: LandingDataType) => {
    setLandingData(data);
    triggerSave();
  };

  const handleForBrandsChange = (data: ForBrandsDataType) => {
    setForBrandsData(data);
    triggerSave();
  };

  const handleForIndividualsChange = (data: ForIndividualsDataType) => {
    setForIndividualsData(data);
    triggerSave();
  };

  const handleMyWorkChange = (data: MyWorkDataType) => {
    setMyWorkData(data);
    triggerSave();
  };

  const triggerSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleManualSave = () => {
    triggerSave();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes in this section?')) {
      switch (activeSection) {
        case 'landing':
          setLandingData({});
          break;
        case 'brands':
          setForBrandsData({});
          break;
        case 'individuals':
          setForIndividualsData({});
          break;
        case 'work':
          setMyWorkData({});
          break;
      }
      // You would also need to reset the form component itself
      // This would require passing a reset prop to each component or using keys
    }
  };

  const sections = [
    { id: 'landing' as const, label: 'Landing', icon: '🏠', component: Landing, handler: handleLandingChange, data: landingData },
    { id: 'brands' as const, label: 'For Brands', icon: '🏢', component: ForBrands, handler: handleForBrandsChange, data: forBrandsData },
    { id: 'individuals' as const, label: 'For Individuals', icon: '👤', component: ForIndividuals, handler: handleForIndividualsChange, data: forIndividualsData },
    { id: 'work' as const, label: 'Work', icon: '💼', component: MyWork, handler: handleMyWorkChange, data: myWorkData },
  ];

  const currentSection = sections.find(s => s.id === activeSection);
  const ActiveComponent = currentSection?.component || Landing;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Content Management System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your website content - {currentSection?.label}
              </p>
            </div>
            
            {saveStatus !== 'idle' && (
              <div className="flex items-center space-x-2">
                {saveStatus === 'saving' && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-700">Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-700">Saved!</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap
                      ${isActive
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="mr-2 text-lg">{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <ActiveComponent 
              onChange={currentSection?.handler}
              initialData={currentSection?.data}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Reset Changes
          </button>
          <button
            onClick={handleManualSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;