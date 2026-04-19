// MyWork.tsx
import React, { useState } from 'react';

interface MyWorkData {
  instagramLinks: string[];
  tiktokLinks: string[];
  linkedinLinks: string[];
  spotifyLinks: string[];
}

interface MyWorkProps {
  onChange?: (data: MyWorkData) => void;
  initialData?: Partial<MyWorkData>;
}

const MyWork: React.FC<MyWorkProps> = ({ onChange, initialData = {} }) => {
  const [formData, setFormData] = useState<MyWorkData>({
    instagramLinks: initialData.instagramLinks || ['', '', '', ''],
    tiktokLinks: initialData.tiktokLinks || ['', '', '', ''],
    linkedinLinks: initialData.linkedinLinks || ['', '', '', ''],
    spotifyLinks: initialData.spotifyLinks || ['', '', '', ''],
  });

  const handleLinksChange = (platform: keyof MyWorkData, index: number, value: string) => {
    const updatedLinks = [...formData[platform]];
    updatedLinks[index] = value;
    const updatedData = { ...formData, [platform]: updatedLinks };
    setFormData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  const LinkInputGroup: React.FC<{
    platform: keyof MyWorkData;
    label: string;
    icon: string;
    placeholder: string;
  }> = ({ platform, label, icon, placeholder }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{label} Showcase</h3>
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            type="url"
            value={formData[platform][index] || ''}
            onChange={(e) => handleLinksChange(platform, index, e.target.value)}
            placeholder={`${placeholder} ${index + 1} (e.g., https://www.instagram.com/p/...)`}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Enter up to 4 {label} post URLs to showcase</p>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Work Page Editor</h2>
        <p className="text-gray-600">Showcase your social media content across different platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LinkInputGroup
          platform="instagramLinks"
          label="Instagram"
          icon="📸"
          placeholder="Instagram Post URL"
        />
        
        <LinkInputGroup
          platform="tiktokLinks"
          label="TikTok"
          icon="🎵"
          placeholder="TikTok Video URL"
        />
        
        <LinkInputGroup
          platform="linkedinLinks"
          label="LinkedIn"
          icon="💼"
          placeholder="LinkedIn Post URL"
        />
        
        <LinkInputGroup
          platform="spotifyLinks"
          label="Spotify"
          icon="🎧"
          placeholder="Spotify Track/Playlist URL"
        />
      </div>

      {/* Preview Section */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">📸</div>
            <div className="text-sm text-gray-600">Instagram</div>
            <div className="text-lg font-semibold text-gray-900">
              {formData.instagramLinks.filter(link => link.trim() !== '').length}/4
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🎵</div>
            <div className="text-sm text-gray-600">TikTok</div>
            <div className="text-lg font-semibold text-gray-900">
              {formData.tiktokLinks.filter(link => link.trim() !== '').length}/4
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">💼</div>
            <div className="text-sm text-gray-600">LinkedIn</div>
            <div className="text-lg font-semibold text-gray-900">
              {formData.linkedinLinks.filter(link => link.trim() !== '').length}/4
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🎧</div>
            <div className="text-sm text-gray-600">Spotify</div>
            <div className="text-lg font-semibold text-gray-900">
              {formData.spotifyLinks.filter(link => link.trim() !== '').length}/4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWork;