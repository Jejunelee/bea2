'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { CTASectionSettings } from '@/app/types/StoryAudit/CTASection';

export default function AdminCTASectionPage() {
  const [settings, setSettings] = useState<Partial<CTASectionSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audit_cta_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_cta_settings')
      .update({
        headline: settings.headline,
        italic_word: settings.italic_word,
        subheadline: settings.subheadline,
        button_text: settings.button_text,
        booking_url: settings.booking_url,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">CTA Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Section Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Headline</label>
              <input
                type="text"
                value={settings.headline || 'Start the audit'}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">Use the italic word field to specify which word gets italic styling</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word in Headline</label>
              <input
                type="text"
                value={settings.italic_word || 'audit'}
                onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                placeholder="audit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Subheadline</label>
              <textarea
                value={settings.subheadline || ''}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Text</label>
              <input
                type="text"
                value={settings.button_text || 'Book your audit'}
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Glow Intensity
                <span className="text-xs text-gray-500 ml-2">0-100%</span>
              </label>
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

            {/* Preview Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-3 text-gray-800">Preview</h3>
              <div 
                className="rounded-lg p-6 text-center"
                style={{ backgroundColor: settings.background_color || '#000000' }}
              >
                <h4 style={{ color: settings.text_color || '#ffffff' }}>
                  {(settings.headline || 'Start the audit').split(settings.italic_word || 'audit')[0]}
                  <span className="font-editorial italic" style={{ color: settings.text_color || '#ffffff' }}>
                    {settings.italic_word || 'audit'}
                  </span>
                  {(settings.headline || 'Start the audit').split(settings.italic_word || 'audit')[1]}
                </h4>
                <p className="mt-2 text-sm" style={{ color: settings.muted_text_color || '#ffffff99' }}>
                  {settings.subheadline || 'Preview of your subheadline...'}
                </p>
                <button
                  className="mt-4 px-6 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: settings.button_background_color || '#ffffff',
                    color: settings.button_text_color || '#000000'
                  }}
                >
                  {settings.button_text || 'Book your audit'} →
                </button>
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
      </div>
    </div>
  );
}