// components/UserTypeModal.tsx
"use client";

import React from "react";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (userType: "brand" | "individual") => void;
}

export default function UserTypeModal({ isOpen, onClose, onSelect }: UserTypeModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-in fade-in zoom-in duration-200">
          {/* Header */}

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Options */}
          <div className="space-y-3">
            <button
              onClick={() => onSelect("brand")}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-[2px] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative rounded-xl bg-white px-6 py-4 transition-all duration-300 group-hover:bg-transparent">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
                      🏢 Are you a Brand?
                    </h3>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSelect("individual")}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-teal-600 p-[2px] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative rounded-xl bg-white px-6 py-4 transition-all duration-300 group-hover:bg-transparent">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
                      👤 Are you an Individual?
                    </h3>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}