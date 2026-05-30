'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { Section1Settings } from '@/app/types/peoplesection1';

export default function AdminSection1Page() {
  const [settings, setSettings] = useState<Partial<Section1Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bulletsText, setBulletsText] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('section1_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) {
      setSettings(data);
      setBulletsText(data.bullets?.join('\n') || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const bulletsArray = bulletsText.split('\n').filter(b => b.trim());
    
    const { error } = await supabase
      .from('section1_settings')
      .update({
        background_color: settings.background_color,
        badge_text: settings.badge_text,
        badge_text_color: settings.badge_text_color,
        title: settings.title,
        title_color: settings.title_color,
        description: settings.description,
        description_color: settings.description_color,
        bullets: bulletsArray,
        bullet_color: settings.bullet_color,
        button_text: settings.button_text,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
        image_url: settings.image_url,
        image_alt: settings.image_alt,
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

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `section1-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('section1-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading image');
      setUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('section1-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, image_url: publicUrl });
    setMessage('Image uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploadingImage(false);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Section 1 - Messaging Audit Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Background Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Background Settings</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.background_color || '#FFFBE7'}
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
        </div>

        {/* Badge Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Badge Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Badge Text</label>
              <input
                type="text"
                value={settings.badge_text || ''}
                onChange={(e) => setSettings({ ...settings, badge_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Badge Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.badge_text_color || '#000000'}
                  onChange={(e) => setSettings({ ...settings, badge_text_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.badge_text_color || ''}
                  onChange={(e) => setSettings({ ...settings, badge_text_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Title Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Title Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <textarea
                value={settings.title || ''}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.title_color || '#FF7A95'}
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
          </div>
        </div>

        {/* Description Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Description Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.description_color || '#000000'}
                  onChange={(e) => setSettings({ ...settings, description_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.description_color || ''}
                  onChange={(e) => setSettings({ ...settings, description_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bullet Points Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Bullet Points</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Bullet Points (one per line)</label>
              <textarea
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono text-sm"
                placeholder="Pre-Session Brand And Content Review&#10;Live 90-Minute Strategy Session&#10;Written Brief And Next-Step Roadmap"
              />
              <p className="text-xs text-gray-500 mt-1">Each line will become a bullet point</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Bullet Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.bullet_color || '#000000'}
                  onChange={(e) => setSettings({ ...settings, bullet_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.bullet_color || ''}
                  onChange={(e) => setSettings({ ...settings, bullet_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Button Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Text</label>
              <input
                type="text"
                value={settings.button_text || ''}
                onChange={(e) => setSettings({ ...settings, button_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_background_color || '#FF7A95'}
                  onChange={(e) => setSettings({ ...settings, button_background_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_background_color || ''}
                  onChange={(e) => setSettings({ ...settings, button_background_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Image Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Image Alt Text</label>
              <input
                type="text"
                value={settings.image_alt || ''}
                onChange={(e) => setSettings({ ...settings, image_alt: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Image URL</label>
              {settings.image_url && (
                <div className="mb-2">
                  <img src={settings.image_url} alt="Preview" className="w-48 h-auto border border-gray-200 rounded" />
                </div>
              )}
              <input
                type="text"
                value={settings.image_url || ''}
                onChange={(e) => setSettings({ ...settings, image_url: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                placeholder="/people/computer.png"
              />
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Or upload new image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingImage && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
          
          <div 
            className="p-6 rounded-lg border border-gray-200"
            style={{ backgroundColor: settings.background_color || '#FFFBE7' }}
          >
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm tracking-widest uppercase mb-3" style={{ color: settings.badge_text_color || '#000000' }}>
                  {settings.badge_text || 'Most Popular | Messaging Audit'}
                </p>
                <h2 className="text-2xl font-medium mb-3 leading-tight" style={{ color: settings.title_color || '#FF7A95' }}>
                  {settings.title || 'One Session. One Direction. Real Clarity.'}
                </h2>
                <p className="text-sm mb-4" style={{ color: settings.description_color || '#000000' }}>
                  {settings.description || 'A Focused 90-Minute Deep Dive Into Your Brand...'}
                </p>
                <ul className="space-y-1 mb-4">
                  {(bulletsText.split('\n').filter(b => b.trim())).map((bullet, idx) => (
                    <li key={idx} className="text-sm" style={{ color: settings.bullet_color || '#000000' }}>
                      • {bullet}
                    </li>
                  ))}
                </ul>
                <button 
                  className="text-sm font-medium px-4 py-1 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: settings.button_background_color || '#FF7A95',
                    color: settings.button_text_color || '#000000'
                  }}
                >
                  {settings.button_text || '£500 / one-off, flat fee'}
                </button>
              </div>
              <div>
                {settings.image_url && (
                  <img 
                    src={settings.image_url} 
                    alt={settings.image_alt || 'Preview'} 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
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