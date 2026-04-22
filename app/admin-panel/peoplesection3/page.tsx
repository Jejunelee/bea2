'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { Section3Settings } from '@/app/types/peoplesection3';

export default function AdminSection3Page() {
  const [settings, setSettings] = useState<Partial<Section3Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [bulletsText, setBulletsText] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('section3_settings')
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
      .from('section3_settings')
      .update({
        background_color: settings.background_color,
        text_color: settings.text_color,
        badge_text: settings.badge_text,
        badge_text_color: settings.badge_text_color,
        title_prefix: settings.title_prefix,
        title_suffix: settings.title_suffix,
        title_color: settings.title_color,
        description: settings.description,
        description_color: settings.description_color,
        bullets: bulletsArray,
        bullet_color: settings.bullet_color,
        button_text: settings.button_text,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
        button_hover_color: settings.button_hover_color,
        phone_wallpaper_url: settings.phone_wallpaper_url,
        phone_notification1_name: settings.phone_notification1_name,
        phone_notification1_message: settings.phone_notification1_message,
        phone_notification1_time: settings.phone_notification1_time,
        phone_notification1_icon: settings.phone_notification1_icon,
        phone_notification2_name: settings.phone_notification2_name,
        phone_notification2_message: settings.phone_notification2_message,
        phone_notification2_time: settings.phone_notification2_time,
        phone_notification2_icon: settings.phone_notification2_icon,
        phone_notification2_badge: settings.phone_notification2_badge,
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

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Section 3 - AI For Marketing Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Main Content Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Content Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color || '#E9E7E2'}
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

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Prefix</label>
              <textarea
                value={settings.title_prefix || ''}
                onChange={(e) => setSettings({ ...settings, title_prefix: e.target.value })}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Suffix</label>
              <input
                type="text"
                value={settings.title_suffix || ''}
                onChange={(e) => setSettings({ ...settings, title_suffix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.title_color || '#6B7F1A'}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={6}
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

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Bullet Points (one per line)</label>
              <textarea
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono text-sm"
              />
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
                  value={settings.button_background_color || '#A6C437'}
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

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Hover Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_hover_color || '#8BA82E'}
                  onChange={(e) => setSettings({ ...settings, button_hover_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_hover_color || ''}
                  onChange={(e) => setSettings({ ...settings, button_hover_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Phone Mockup Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Phone Mockup Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Wallpaper Image URL</label>
              <input
                type="text"
                value={settings.phone_wallpaper_url || ''}
                onChange={(e) => setSettings({ ...settings, phone_wallpaper_url: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3 text-gray-800">Notification 1</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                  <input
                    type="text"
                    value={settings.phone_notification1_name || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification1_name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Time</label>
                  <input
                    type="text"
                    value={settings.phone_notification1_time || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification1_time: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Message</label>
                  <textarea
                    value={settings.phone_notification1_message || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification1_message: e.target.value })}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3 text-gray-800">Notification 2</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                  <input
                    type="text"
                    value={settings.phone_notification2_name || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification2_name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Time</label>
                  <input
                    type="text"
                    value={settings.phone_notification2_time || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification2_time: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Message</label>
                  <textarea
                    value={settings.phone_notification2_message || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification2_message: e.target.value })}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Badge Text</label>
                  <input
                    type="text"
                    value={settings.phone_notification2_badge || ''}
                    onChange={(e) => setSettings({ ...settings, phone_notification2_badge: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
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