'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { FractionalHowItWorksSettings } from '@/app/types/FractionalCommunication/HowThisWorks';

export default function AdminFractionalHowItWorksPage() {
  const [settings, setSettings] = useState<Partial<FractionalHowItWorksSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  
  // State for emphasis phrase inputs
  const [para1EmphasisInput, setPara1EmphasisInput] = useState('');
  const [para2EmphasisInput, setPara2EmphasisInput] = useState('');
  const [calloutEmphasisInput, setCalloutEmphasisInput] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('fractional_howitworks_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('fractional_howitworks_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        card_background_color: settings.card_background_color,
        card_border_color: settings.card_border_color,
        card_text_color: settings.card_text_color,
        paragraph_one: settings.paragraph_one,
        paragraph_one_emphasis: settings.paragraph_one_emphasis,
        paragraph_two: settings.paragraph_two,
        paragraph_two_emphasis: settings.paragraph_two_emphasis,
        callout_text: settings.callout_text,
        callout_emphasis: settings.callout_emphasis,
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

  // Paragraph 1 Emphasis Management
  const addPara1Emphasis = () => {
    if (para1EmphasisInput.trim() && !settings.paragraph_one_emphasis?.includes(para1EmphasisInput.trim())) {
      setSettings({
        ...settings,
        paragraph_one_emphasis: [...(settings.paragraph_one_emphasis || []), para1EmphasisInput.trim()]
      });
      setPara1EmphasisInput('');
    }
  };

  const removePara1Emphasis = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      paragraph_one_emphasis: (settings.paragraph_one_emphasis || []).filter(p => p !== phraseToRemove)
    });
  };

  // Paragraph 2 Emphasis Management
  const addPara2Emphasis = () => {
    if (para2EmphasisInput.trim() && !settings.paragraph_two_emphasis?.includes(para2EmphasisInput.trim())) {
      setSettings({
        ...settings,
        paragraph_two_emphasis: [...(settings.paragraph_two_emphasis || []), para2EmphasisInput.trim()]
      });
      setPara2EmphasisInput('');
    }
  };

  const removePara2Emphasis = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      paragraph_two_emphasis: (settings.paragraph_two_emphasis || []).filter(p => p !== phraseToRemove)
    });
  };

  // Callout Emphasis Management
  const addCalloutEmphasis = () => {
    if (calloutEmphasisInput.trim() && !settings.callout_emphasis?.includes(calloutEmphasisInput.trim())) {
      setSettings({
        ...settings,
        callout_emphasis: [...(settings.callout_emphasis || []), calloutEmphasisInput.trim()]
      });
      setCalloutEmphasisInput('');
    }
  };

  const removeCalloutEmphasis = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      callout_emphasis: (settings.callout_emphasis || []).filter(p => p !== phraseToRemove)
    });
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">How This Works - Admin (Fractional)</h1>
        
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Section Title</label>
                    <input
                      type="text"
                      value={settings.section_title || 'A bit about how this works'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'works'}
                      onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
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
                        value={settings.background_color || '#f5f3ef'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Card Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.card_background_color || '#ffffff80'}
                        onChange={(e) => setSettings({ ...settings, card_background_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.card_background_color || ''}
                        onChange={(e) => setSettings({ ...settings, card_background_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Card Border Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.card_border_color || '#ffffff33'}
                        onChange={(e) => setSettings({ ...settings, card_border_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.card_border_color || ''}
                        onChange={(e) => setSettings({ ...settings, card_border_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Card Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.card_text_color || '#000000CC'}
                        onChange={(e) => setSettings({ ...settings, card_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.card_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, card_text_color: e.target.value })}
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

              {/* Paragraph 1 */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Paragraph 1</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Text</label>
                  <textarea
                    value={settings.paragraph_one || ''}
                    onChange={(e) => setSettings({ ...settings, paragraph_one: e.target.value })}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Phrases</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(settings.paragraph_one_emphasis || []).map((phrase, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {phrase}
                        <button
                          onClick={() => removePara1Emphasis(phrase)}
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
                      value={para1EmphasisInput}
                      onChange={(e) => setPara1EmphasisInput(e.target.value)}
                      placeholder="Add phrase to emphasize (e.g., content factory)"
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      onKeyPress={(e) => e.key === 'Enter' && addPara1Emphasis()}
                    />
                    <button
                      onClick={addPara1Emphasis}
                      className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Paragraph 2 */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Paragraph 2</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Text</label>
                  <textarea
                    value={settings.paragraph_two || ''}
                    onChange={(e) => setSettings({ ...settings, paragraph_two: e.target.value })}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Phrases</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(settings.paragraph_two_emphasis || []).map((phrase, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {phrase}
                        <button
                          onClick={() => removePara2Emphasis(phrase)}
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
                      value={para2EmphasisInput}
                      onChange={(e) => setPara2EmphasisInput(e.target.value)}
                      placeholder="Add phrase to emphasize (e.g., one-size-fits-all retainer)"
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      onKeyPress={(e) => e.key === 'Enter' && addPara2Emphasis()}
                    />
                    <button
                      onClick={addPara2Emphasis}
                      className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Callout */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Callout Box</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Text</label>
                  <textarea
                    value={settings.callout_text || ''}
                    onChange={(e) => setSettings({ ...settings, callout_text: e.target.value })}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Phrases</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(settings.callout_emphasis || []).map((phrase, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {phrase}
                        <button
                          onClick={() => removeCalloutEmphasis(phrase)}
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
                      value={calloutEmphasisInput}
                      onChange={(e) => setCalloutEmphasisInput(e.target.value)}
                      placeholder="Add phrase to emphasize (e.g., Story Audit)"
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      onKeyPress={(e) => e.key === 'Enter' && addCalloutEmphasis()}
                    />
                    <button
                      onClick={addCalloutEmphasis}
                      className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Add
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
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[450px]"
              style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
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
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'A bit about how this works').split(settings.italic_word || 'works')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'works'}
                    </span>
                    {(settings.section_title || 'A bit about how this works').split(settings.italic_word || 'works')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Paragraph 1 Preview */}
                <p 
                  className="text-lg md:text-xl leading-relaxed font-helvetica mb-6"
                  style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                >
                  {renderPreviewText(
                    settings.paragraph_one || 'Preview of paragraph 1...',
                    settings.paragraph_one_emphasis || []
                  )}
                </p>

                {/* Paragraph 2 Preview */}
                <p 
                  className="text-lg md:text-xl leading-relaxed font-helvetica mb-8"
                  style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                >
                  {renderPreviewText(
                    settings.paragraph_two || 'Preview of paragraph 2...',
                    settings.paragraph_two_emphasis || []
                  )}
                </p>

                {/* Callout Preview */}
                <div 
                  className="rounded-2xl p-8 border"
                  style={{
                    backgroundColor: settings.card_background_color || '#ffffff80',
                    borderColor: settings.card_border_color || '#ffffff33'
                  }}
                >
                  <p 
                    className="text-xl md:text-2xl leading-relaxed font-helvetica"
                    style={{ color: settings.card_text_color || 'rgba(0, 0, 0, 0.8)' }}
                  >
                    {renderPreviewText(
                      settings.callout_text || 'Preview of callout text...',
                      settings.callout_emphasis || []
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}