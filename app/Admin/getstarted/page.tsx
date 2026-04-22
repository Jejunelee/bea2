'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { GetStartedSettings } from '@/app/types/getstarted';

export default function AdminGetStartedPage() {
  const [settings, setSettings] = useState<Partial<GetStartedSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    
    const { data } = await supabase
      .from('get_started_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('get_started_settings')
      .update({
        background_color_start: settings.background_color_start,
        background_color_mid: settings.background_color_mid,
        background_color_end: settings.background_color_end,
        title_prefix: settings.title_prefix,
        title_italic: settings.title_italic,
        title_suffix: settings.title_suffix,
        button_text: settings.button_text,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
        button_hover_color_start: settings.button_hover_color_start,
        button_hover_color_end: settings.button_hover_color_end,
        calendar_event_title: settings.calendar_event_title,
        calendar_event_details: settings.calendar_event_details,
        calendar_event_location: settings.calendar_event_location,
        calendar_event_email: settings.calendar_event_email,
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Get Started Section Admin</h1>
        
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color Start</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color_start || '#f5f3ef'}
                  onChange={(e) => setSettings({ ...settings, background_color_start: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_color_start || ''}
                  onChange={(e) => setSettings({ ...settings, background_color_start: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color Mid</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color_mid || '#f5f3ef'}
                  onChange={(e) => setSettings({ ...settings, background_color_mid: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_color_mid || ''}
                  onChange={(e) => setSettings({ ...settings, background_color_mid: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color End</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color_end || '#f5f3ef'}
                  onChange={(e) => setSettings({ ...settings, background_color_end: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_color_end || ''}
                  onChange={(e) => setSettings({ ...settings, background_color_end: e.target.value })}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Prefix</label>
              <input
                type="text"
                value={settings.title_prefix || ''}
                onChange={(e) => setSettings({ ...settings, title_prefix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Ready to get"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Italic Word</label>
              <input
                type="text"
                value={settings.title_italic || ''}
                onChange={(e) => setSettings({ ...settings, title_italic: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="started?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Suffix</label>
              <input
                type="text"
                value={settings.title_suffix || ''}
                onChange={(e) => setSettings({ ...settings, title_suffix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder=""
              />
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
                placeholder="Book a call"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_background_color || '#000000'}
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
                  value={settings.button_text_color || '#FFFFFF'}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Hover Color Start</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_hover_color_start || '#d97706'}
                  onChange={(e) => setSettings({ ...settings, button_hover_color_start: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_hover_color_start || ''}
                  onChange={(e) => setSettings({ ...settings, button_hover_color_start: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Hover Color End</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_hover_color_end || '#92400e'}
                  onChange={(e) => setSettings({ ...settings, button_hover_color_end: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_hover_color_end || ''}
                  onChange={(e) => setSettings({ ...settings, button_hover_color_end: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Event Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Calendar Event Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Event Title</label>
              <input
                type="text"
                value={settings.calendar_event_title || ''}
                onChange={(e) => setSettings({ ...settings, calendar_event_title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Exploratory Call"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Event Details</label>
              <textarea
                value={settings.calendar_event_details || ''}
                onChange={(e) => setSettings({ ...settings, calendar_event_details: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Hi, I'm reaching you from your website and I'm interested."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Event Location</label>
              <input
                type="text"
                value={settings.calendar_event_location || ''}
                onChange={(e) => setSettings({ ...settings, calendar_event_location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Google Meet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Calendar Email</label>
              <input
                type="email"
                value={settings.calendar_event_email || ''}
                onChange={(e) => setSettings({ ...settings, calendar_event_email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="bea@gmail.com"
              />
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