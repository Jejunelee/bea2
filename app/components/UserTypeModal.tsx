// components/UserTypeModal.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (userType: "brand" | "individual") => void;
}

export default function UserTypeModal({ isOpen, onClose, onSelect }: UserTypeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleContactMe = () => {
    onClose();
    router.push("/Contact");
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200 relative">
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

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 font-helvetica">
              How can I help you?
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-helvetica">
              Select the option that best describes you
            </p>
          </div>

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
                      🏢 Brand
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors mt-1">
                      I need communications help for my business
                    </p>
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
                      👤 Individual
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors mt-1">
                      I need personal brand or career guidance
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400 font-helvetica">or</span>
              </div>
            </div>

            {/* Contact Me Button */}
            <button
              onClick={handleContactMe}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 p-[2px] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative rounded-xl bg-white px-6 py-4 transition-all duration-300 group-hover:bg-transparent">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Me
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors mt-1">
                      Just want to say hello or ask a quick question
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center text-gray-400 mt-6 font-helvetica">
            No commitment. Just a conversation to see how I can help.
          </p>
        </div>
      </div>
    </>
  );
}