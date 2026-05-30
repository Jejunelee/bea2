'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { FractionalCTASettings } from '@/app/types/FractionalCommunication/CTASection';

export default function AdminFractionalCTAPage() {
  const [settings, setSettings] = useState<Partial<FractionalCTASettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('fractional_cta_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('fractional_cta_settings')
      .update({
        headline: settings.headline,
        italic_word: settings.italic_word,
        subheadline: settings.subheadline,
        button_text: settings.button_text,
        booking_url: settings.booking_url,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) {
      setMessage('Error saving settings');
    } else {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = settings.glow_intensity || 30;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">CTA Section Admin (Fractional)</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Section Settings</h2>
            
            <div className="space-y-6">
              {/* Title Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Title Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Headline</label>
                    <input
                      type="text"
                      value={settings.headline || 'Start the conversation'}
                      onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the italic word field to specify which word gets italic styling</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'conversation'}
                      onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      placeholder="conversation"
                    />
                  </div>
                </div>
              </div>

              {/* Content Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Content Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Subheadline</label>
                    <textarea
                      value={settings.subheadline || ''}
                      onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Button Text</label>
                      <input
                        type="text"
                        value={settings.button_text || 'Book a call'}
                        onChange={(e) => setSettings({ ...settings, button_text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Booking URL</label>
                      <input
                        type="url"
                        value={settings.booking_url || ''}
                        onChange={(e) => setSettings({ ...settings, booking_url: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                        placeholder="https://calendar.app.google/..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Color Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.background_color || '#000000'}
                        onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.background_color || ''}
                        onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.text_color || '#ffffff'}
                        onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.text_color || ''}
                        onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Muted Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.muted_text_color || '#ffffff99'}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.muted_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                        placeholder="rgba(255,255,255,0.6)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.accent_color || '#e9c08f'}
                        onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.accent_color || ''}
                        onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Button Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.button_background_color || '#ffffff'}
                        onChange={(e) => setSettings({ ...settings, button_background_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.button_background_color || ''}
                        onChange={(e) => setSettings({ ...settings, button_background_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Button Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.button_text_color || '#000000'}
                        onChange={(e) => setSettings({ ...settings, button_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.button_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, button_text_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Glow Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={settings.glow_intensity || 30}
                      onChange={(e) => setSettings({ ...settings, glow_intensity: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtle (0%)</span>
                      <span>Current: {settings.glow_intensity || 30}%</span>
                      <span>Strong (100%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center"
              style={{ backgroundColor: settings.background_color || '#000000' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-10 right-[15%] w-[200px] h-[200px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 20).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute top-10 left-[10%] w-[200px] h-[200px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 20).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Headline Preview */}
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 font-helvetica tracking-tight"
                  style={{ color: settings.text_color || '#ffffff' }}
                >
                  {(settings.headline || 'Start the conversation').split(settings.italic_word || 'conversation')[0]}
                  <span className="font-editorial italic">
                    {settings.italic_word || 'conversation'}
                  </span>
                  {(settings.headline || 'Start the conversation').split(settings.italic_word || 'conversation')[1]}
                </h2>
                
                {/* Subheadline Preview */}
                <p 
                  className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 font-helvetica max-w-2xl mx-auto"
                  style={{ color: settings.muted_text_color || 'rgba(255, 255, 255, 0.6)' }}
                >
                  {settings.subheadline || 'Preview of your subheadline will appear here...'}
                </p>
                
                {/* Button Preview */}
                <button
                  className="rounded-full text-base md:text-lg lg:text-xl font-medium px-8 py-3 shadow-md transition-all duration-200"
                  style={{
                    backgroundColor: settings.button_background_color || '#ffffff',
                    color: settings.button_text_color || '#000000'
                  }}
                >
                  <span className="flex items-center gap-2">
                    {settings.button_text || 'Book a call'}
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}