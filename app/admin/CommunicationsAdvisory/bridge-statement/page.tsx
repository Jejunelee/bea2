'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { AdvisoryBridgeSettings } from '@/app/types/CommunicationsAdvisory/BridgeStatement';
import Image from 'next/image';

export default function AdminAdvisoryBridgePage() {
  const [settings, setSettings] = useState<Partial<AdvisoryBridgeSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [uploading, setUploading] = useState(false);
  const [emphasisInput, setEmphasisInput] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('advisory_bridge_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('advisory_bridge_settings')
      .update({
        main_text: settings.main_text,
        main_emphasis_phrases: settings.main_emphasis_phrases,
        closing_text: settings.closing_text,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        image_url: settings.image_url,
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

  const addEmphasisPhrase = () => {
    if (emphasisInput.trim() && !settings.main_emphasis_phrases?.includes(emphasisInput.trim())) {
      setSettings({
        ...settings,
        main_emphasis_phrases: [...(settings.main_emphasis_phrases || []), emphasisInput.trim()]
      });
      setEmphasisInput('');
    }
  };

  const removeEmphasisPhrase = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      main_emphasis_phrases: (settings.main_emphasis_phrases || []).filter(p => p !== phraseToRemove)
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `advisory-bridge-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('advisory-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading image');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('advisory-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, image_url: publicUrl });
    setMessage('Image uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploading(false);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = settings.glow_intensity || 30;

  // Helper to render preview text with emphasis
  const renderPreviewText = (text: string, emphasisPhrases: string[]) => {
    if (!emphasisPhrases.length) return text;

    const result = [];
    let lastIndex = 0;
    let textLower = text.toLowerCase();
    const sortedPhrases = [...emphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = textLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }
        const foundPhrase = text.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        textLower = textLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result.length > 0 ? result : text;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Bridge Statement Admin (Advisory)</h1>
        
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
              {/* Main Text */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Main Content</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Main Text</label>
                  <textarea
                    value={settings.main_text || ''}
                    onChange={(e) => setSettings({ ...settings, main_text: e.target.value })}
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Emphasis Phrases */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Emphasis Phrases</h3>
                <p className="text-sm text-gray-600 mb-2">These phrases will be italicized in the main text</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(settings.main_emphasis_phrases || []).map((phrase, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      {phrase}
                      <button
                        onClick={() => removeEmphasisPhrase(phrase)}
                        className="hover:text-blue-900 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(!settings.main_emphasis_phrases || settings.main_emphasis_phrases.length === 0) && (
                    <span className="text-xs text-gray-400">No emphasis phrases added</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={emphasisInput}
                    onChange={(e) => setEmphasisInput(e.target.value)}
                    placeholder="Add phrase to emphasize (e.g., food and hospitality industry)"
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    onKeyPress={(e) => e.key === 'Enter' && addEmphasisPhrase()}
                  />
                  <button
                    onClick={addEmphasisPhrase}
                    className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Closing Text */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Closing Statement</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Closing Text</label>
                  <textarea
                    value={settings.closing_text || ''}
                    onChange={(e) => setSettings({ ...settings, closing_text: e.target.value })}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
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
                        value={settings.background_color || '#ffffff'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Muted Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.muted_text_color || '#000000B3'}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.muted_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
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
                    <div className="text-xs text-gray-500 text-center mt-1">{settings.glow_intensity || 30}%</div>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Illustration Image</h3>
                {settings.image_url && (
                  <div className="mb-3">
                    <div className="relative w-full aspect-[16/9] max-w-md">
                      <Image
                        src={settings.image_url}
                        alt="Bridge illustration"
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploading && (
                  <div className="mt-1 text-sm text-gray-500">Uploading...</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Recommended aspect ratio: 16:9 or 15:9</p>
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
              className="rounded-lg p-8 relative overflow-hidden min-h-[500px]"
              style={{ backgroundColor: settings.background_color || '#ffffff' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto">
                {/* Main Text Preview */}
                <p 
                  className="text-xl md:text-2xl lg:text-3xl leading-relaxed font-helvetica mb-8"
                  style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                >
                  {renderPreviewText(
                    settings.main_text || 'Preview of main text will appear here...',
                    settings.main_emphasis_phrases || []
                  )}
                </p>

                {/* Closing Text Preview */}
                <div className="mt-8 pt-6 border-t" style={{ borderColor: `${settings.text_color}10` }}>
                  <p 
                    className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {settings.closing_text || 'Preview of closing text...'}
                  </p>
                  <div 
                    className="h-px mt-6"
                    style={{ backgroundColor: `${settings.text_color}15` }}
                  />
                </div>

                {/* Image Preview */}
                {settings.image_url && (
                  <div className="mt-12 w-full relative aspect-[15/9]">
                    <Image
                      src={settings.image_url}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}