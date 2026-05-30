'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { AuditHeroSettings } from '@/app/types/StoryAudit/Header';

export default function AdminAuditHeroPage() {
  const [settings, setSettings] = useState<Partial<AuditHeroSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [italicWordInput, setItalicWordInput] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audit_hero_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_hero_settings')
      .update({
        headline: settings.headline,
        italic_words: settings.italic_words,
        description: settings.description,
        button_text: settings.button_text,
        booking_url: settings.booking_url,
        background_color: settings.background_color,
        background_gradient_colors: settings.background_gradient_colors,
        text_color: settings.text_color,
        accent_color: settings.accent_color,
        glow_color: settings.glow_color,
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

  const addItalicWord = () => {
    if (italicWordInput.trim() && !settings.italic_words?.includes(italicWordInput.trim())) {
      setSettings({
        ...settings,
        italic_words: [...(settings.italic_words || []), italicWordInput.trim()]
      });
      setItalicWordInput('');
    }
  };

  const removeItalicWord = (wordToRemove: string) => {
    setSettings({
      ...settings,
      italic_words: (settings.italic_words || []).filter(w => w !== wordToRemove)
    });
  };

  const updateGradientColor = (index: number, value: string) => {
    const newColors = [...(settings.background_gradient_colors || [])];
    newColors[index] = value;
    setSettings({ ...settings, background_gradient_colors: newColors });
  };

  // Helper to render preview headline with italic words
  const renderPreviewHeadline = () => {
    const headline = settings.headline || "A clear-eyed look at how your brand is communicating, and a focused plan for what to fix first.";
    const italicWords = settings.italic_words || ['clear-eyed', 'focused'];
    
    if (!italicWords.length) return headline;
    
    const pattern = italicWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    const parts = headline.split(regex);
    
    return parts.map((part, index) => {
      if (!part) return null;
      
      const isItalicWord = italicWords.some(
        word => word.toLowerCase() === part.toLowerCase()
      );
      
      if (isItalicWord) {
        return (
          <span key={index} className="font-editorial italic font-normal" style={{ color: settings.text_color || '#000000' }}>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Audit Hero Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Hero Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Headline</label>
              <textarea
                value={settings.headline || ''}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Italic Words</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(settings.italic_words || []).map((word, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                  >
                    {word}
                    <button
                      onClick={() => removeItalicWord(word)}
                      className="hover:text-blue-900 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={italicWordInput}
                  onChange={(e) => setItalicWordInput(e.target.value)}
                  placeholder="Add word to italicize (e.g., clear-eyed)"
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                  onKeyPress={(e) => e.key === 'Enter' && addItalicWord()}
                />
                <button
                  onClick={addItalicWord}
                  className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.text_color || '#000000'}
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
                <label className="block text-sm font-medium mb-1 text-gray-700">Glow Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.glow_color || '#f0c090'}
                    onChange={(e) => setSettings({ ...settings, glow_color: e.target.value })}
                    className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.glow_color || ''}
                    onChange={(e) => setSettings({ ...settings, glow_color: e.target.value })}
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
                <div className="text-xs text-gray-500 text-center">{settings.glow_intensity || 30}%</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Button Background</label>
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
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Button Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.button_text_color || '#ffffff'}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Gradient Colors</label>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500 w-8">Stop {index + 1}</span>
                    <input
                      type="color"
                      value={settings.background_gradient_colors?.[index] || '#ffffff'}
                      onChange={(e) => updateGradientColor(index, e.target.value)}
                      className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.background_gradient_colors?.[index] || ''}
                      onChange={(e) => updateGradientColor(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Section - FIXED with description */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-3 text-gray-800">Live Preview</h3>
              <div 
                className="rounded-lg p-8 text-center relative overflow-hidden min-h-[400px] flex items-center justify-center"
                style={{ 
                  background: `radial-gradient(circle at center, ${(settings.background_gradient_colors || ['#ffffff', '#ffffff', '#fdf4e3', '#f0e0c4', '#e8c8a0']).join(', ')})`,
                }}
              >
                {/* Glow effects in preview */}
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
                    style={{ 
                      backgroundColor: settings.glow_color || '#f0c090',
                      opacity: (settings.glow_intensity || 30) / 100
                    }}
                  />
                </div>

                <div className="relative z-10 max-w-2xl">
                  {/* Headline Preview */}
                  <h2 
                    className="text-2xl md:text-3xl font-medium leading-tight mb-4"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {renderPreviewHeadline()}
                  </h2>
                  
                  {/* Description Preview - FIXED: Now showing */}
                  <p 
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {settings.description || 'Preview of your description will appear here...'}
                  </p>
                  
                  {/* Button Preview */}
                  <button
                    className="rounded-full text-base md:text-lg font-medium px-6 py-2.5 shadow-md transition-all duration-200"
                    style={{
                      backgroundColor: settings.button_background_color || '#000000',
                      color: settings.button_text_color || '#ffffff'
                    }}
                  >
                    {settings.button_text || 'Book your audit'} →
                  </button>
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
      </div>
    </div>
  );
}