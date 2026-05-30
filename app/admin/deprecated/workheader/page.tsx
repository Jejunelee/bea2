'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { WorkHeaderSettings } from '@/app/types/workheader';

export default function AdminWorkHeaderPage() {
  const [settings, setSettings] = useState<Partial<WorkHeaderSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingIcon, setUploadingIcon] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('work_header_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('work_header_settings')
      .update({
        background_color: settings.background_color,
        title_text: settings.title_text,
        title_color: settings.title_color,
        subtitle_text: settings.subtitle_text,
        subtitle_color: settings.subtitle_color,
        scroll_arrow_icon_url: settings.scroll_arrow_icon_url,
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

  const handleArrowIconUpload = async (file: File) => {
    setUploadingIcon(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `work-arrow-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading arrow icon');
      setUploadingIcon(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, scroll_arrow_icon_url: publicUrl });
    setMessage('Arrow icon uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploadingIcon(false);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Work Header Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Header Settings</h2>
          
          <div className="space-y-4">
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
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Text</label>
              <input
                type="text"
                value={settings.title_text || ''}
                onChange={(e) => setSettings({ ...settings, title_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Recent Work"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.title_color || '#ADDDB1'}
                  onChange={(e) => setSettings({ ...settings, title_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.title_color || ''}
                  onChange={(e) => setSettings({ ...settings, title_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Subtitle Text</label>
              <input
                type="text"
                value={settings.subtitle_text || ''}
                onChange={(e) => setSettings({ ...settings, subtitle_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="WHAT I'VE BEEN UP TO LATELY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Subtitle Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.subtitle_color || '#FFFFFF'}
                  onChange={(e) => setSettings({ ...settings, subtitle_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.subtitle_color || ''}
                  onChange={(e) => setSettings({ ...settings, subtitle_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Scroll Arrow Icon URL</label>
              {settings.scroll_arrow_icon_url && (
                <div className="mb-2">
                  <img src={settings.scroll_arrow_icon_url} alt="Arrow" className="w-16 h-auto border border-gray-200 rounded" />
                </div>
              )}
              <input
                type="text"
                value={settings.scroll_arrow_icon_url || ''}
                onChange={(e) => setSettings({ ...settings, scroll_arrow_icon_url: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                placeholder="/Landing/Icons/Arrow-5.png"
              />
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Or upload new arrow icon</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleArrowIconUpload(e.target.files[0])}
                  disabled={uploadingIcon}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingIcon && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
          
          <div 
            className="p-8 rounded-lg text-center border border-gray-200"
            style={{ backgroundColor: settings.background_color || '#000000' }}
          >
            <h1 className="text-4xl font-medium mb-4" style={{ color: settings.title_color || '#ADDDB1' }}>
              {settings.title_text || 'Recent Work'}
            </h1>
            <p className="text-lg" style={{ color: settings.subtitle_color || '#FFFFFF' }}>
              {settings.subtitle_text || "WHAT I'VE BEEN UP TO LATELY"}
            </p>
            {settings.scroll_arrow_icon_url && (
              <div className="mt-8 flex justify-center">
                <img src={settings.scroll_arrow_icon_url} alt="Scroll" className="w-12 h-auto animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}