'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { IndividualHeaderSettings } from '@/app/types/peopleheader';

export default function AdminIndividualHeaderPage() {
  const [settings, setSettings] = useState<Partial<IndividualHeaderSettings>>({});
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
      .from('individual_header_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('individual_header_settings')
      .update({
        background_gradient_start: settings.background_gradient_start,
        background_gradient_mid: settings.background_gradient_mid,
        background_gradient_end: settings.background_gradient_end,
        glow_color: settings.glow_color,
        glow_opacity: settings.glow_opacity,
        title_prefix: settings.title_prefix,
        title_suffix: settings.title_suffix,
        description_prefix: settings.description_prefix,
        description_italic: settings.description_italic,
        description_suffix: settings.description_suffix,
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
    const fileName = `individual-arrow-${Date.now()}.${fileExt}`;
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Individual Header Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Background Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Background Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Gradient Start Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_gradient_start || '#FFB58C'}
                  onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_gradient_start || ''}
                  onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Gradient Mid Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_gradient_mid || '#ffffff'}
                  onChange={(e) => setSettings({ ...settings, background_gradient_mid: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_gradient_mid || ''}
                  onChange={(e) => setSettings({ ...settings, background_gradient_mid: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Gradient End Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_gradient_end || '#ffffff'}
                  onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_gradient_end || ''}
                  onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Glow Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.glow_color || '#e6ee9c'}
                  onChange={(e) => setSettings({ ...settings, glow_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.glow_color || ''}
                  onChange={(e) => setSettings({ ...settings, glow_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Glow Opacity (0-100)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.glow_opacity || 30}
                onChange={(e) => setSettings({ ...settings, glow_opacity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-right text-sm text-gray-600">{settings.glow_opacity || 30}%</div>
            </div>
          </div>
        </div>

        {/* Title Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Title Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Prefix</label>
              <input
                type="text"
                value={settings.title_prefix || ''}
                onChange={(e) => setSettings({ ...settings, title_prefix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Stop Guessing."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Suffix</label>
              <input
                type="text"
                value={settings.title_suffix || ''}
                onChange={(e) => setSettings({ ...settings, title_suffix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Start Building."
              />
            </div>
          </div>
        </div>

        {/* Description Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Description Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description Prefix</label>
              <textarea
                value={settings.description_prefix || ''}
                onChange={(e) => setSettings({ ...settings, description_prefix: e.target.value })}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Structured messaging and content systems that make every pitch, post, and partnership"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description Italic Word</label>
              <input
                type="text"
                value={settings.description_italic || ''}
                onChange={(e) => setSettings({ ...settings, description_italic: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="work harder"
              />
              <p className="text-xs text-gray-500 mt-1">This word will be italicized</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description Suffix</label>
              <input
                type="text"
                value={settings.description_suffix || ''}
                onChange={(e) => setSettings({ ...settings, description_suffix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="for your brand."
              />
            </div>
          </div>
        </div>

        {/* Scroll Arrow Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Scroll Arrow Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Arrow Icon URL</label>
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
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
          
          <div 
            className="p-8 rounded-lg text-center border border-gray-200"
            style={{
              background: `radial-gradient(circle at center, ${settings.background_gradient_start || '#FFB58C'} 0%, ${settings.background_gradient_mid || '#ffffff'} 40%, ${settings.background_gradient_end || '#ffffff'} 60%)`,
            }}
          >
            <h2 className="text-2xl font-medium text-black mb-4">
              {settings.title_prefix || 'Stop Guessing.'}{" "}
              {settings.title_suffix || 'Start Building.'}
            </h2>
            
            <p className="text-black leading-relaxed">
              {settings.description_prefix || 'Structured messaging and content systems that make every pitch, post, and partnership'}{" "}
              <span className="font-editorial italic">{settings.description_italic || 'work harder'}</span>
              {" "}{settings.description_suffix || 'for your brand.'}
            </p>
            
            {settings.scroll_arrow_icon_url && (
              <div className="mt-8 flex justify-center">
                <img src={settings.scroll_arrow_icon_url} alt="Scroll" className="w-12 h-auto animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold shadow-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}