'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { ProblemStatementSettings } from '@/app/types/StoryAudit/ProblemStatement';
import Image from 'next/image';

export default function AdminProblemStatementPage() {
  const [settings, setSettings] = useState<Partial<ProblemStatementSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [uploading, setUploading] = useState(false);
  const [fragmentedInput, setFragmentedInput] = useState('');
  const [consequenceEmphasisInput, setConsequenceEmphasisInput] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audit_problem_statement')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_problem_statement')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        card_background_color: settings.card_background_color,
        opening_statement: settings.opening_statement,
        opening_emphasis_phrase: settings.opening_emphasis_phrase,
        fragmented_items: settings.fragmented_items,
        consequence_statement: settings.consequence_statement,
        consequence_emphasis_words: settings.consequence_emphasis_words,
        resolution_statement: settings.resolution_statement,
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

  const addFragmentedItem = () => {
    if (fragmentedInput.trim()) {
      setSettings({
        ...settings,
        fragmented_items: [...(settings.fragmented_items || []), fragmentedInput.trim()]
      });
      setFragmentedInput('');
    }
  };

  const removeFragmentedItem = (index: number) => {
    const newItems = [...(settings.fragmented_items || [])];
    newItems.splice(index, 1);
    setSettings({ ...settings, fragmented_items: newItems });
  };

  const updateFragmentedItem = (index: number, value: string) => {
    const newItems = [...(settings.fragmented_items || [])];
    newItems[index] = value;
    setSettings({ ...settings, fragmented_items: newItems });
  };

  const addConsequenceEmphasisWord = () => {
    if (consequenceEmphasisInput.trim() && !settings.consequence_emphasis_words?.includes(consequenceEmphasisInput.trim())) {
      setSettings({
        ...settings,
        consequence_emphasis_words: [...(settings.consequence_emphasis_words || []), consequenceEmphasisInput.trim()]
      });
      setConsequenceEmphasisInput('');
    }
  };

  const removeConsequenceEmphasisWord = (wordToRemove: string) => {
    setSettings({
      ...settings,
      consequence_emphasis_words: (settings.consequence_emphasis_words || []).filter(w => w !== wordToRemove)
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `problem-statement-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('audit-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading image');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('audit-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, image_url: publicUrl });
    setMessage('Image uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploading(false);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';

  // Helper to render preview with emphasis
  const renderPreviewWithEmphasis = (text: string, emphasisWords: string[]) => {
    if (!emphasisWords.length) return text;

    const result = [];
    let lastIndex = 0;
    let textLower = text.toLowerCase();
    const sortedWords = [...emphasisWords].sort((a, b) => b.length - a.length);
    
    for (const word of sortedWords) {
      const wordLower = word.toLowerCase();
      const index = textLower.indexOf(wordLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }
        const foundWord = text.substring(index, index + word.length);
        result.push(
          <span key={index} className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
            {foundWord}
          </span>
        );
        lastIndex = index + word.length;
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Problem Statement Admin</h1>
        
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
                      value={settings.section_title || 'The real problem'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'real'}
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
                        value={settings.card_background_color || '#ffffff'}
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

              {/* Opening Statement */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Opening Statement</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Opening Statement Text</label>
                  <textarea
                    value={settings.opening_statement || ''}
                    onChange={(e) => setSettings({ ...settings, opening_statement: e.target.value })}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Phrase</label>
                  <input
                    type="text"
                    value={settings.opening_emphasis_phrase || ''}
                    onChange={(e) => setSettings({ ...settings, opening_emphasis_phrase: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    placeholder="e.g., no underlying story holding it together"
                  />
                  <p className="text-xs text-gray-500 mt-1">This phrase will be italicized in the opening statement</p>
                </div>
              </div>

              {/* Fragmented Items */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Fragmented Items</h3>
                <div className="space-y-2 mb-3">
                  {(settings.fragmented_items || []).map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateFragmentedItem(idx, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                      <button
                        onClick={() => removeFragmentedItem(idx)}
                        className="px-2 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fragmentedInput}
                    onChange={(e) => setFragmentedInput(e.target.value)}
                    placeholder="Add fragmented item (e.g., A website written two years ago.)"
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    onKeyPress={(e) => e.key === 'Enter' && addFragmentedItem()}
                  />
                  <button
                    onClick={addFragmentedItem}
                    className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Consequence Statement */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Consequence Statement</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Consequence Statement Text</label>
                  <textarea
                    value={settings.consequence_statement || ''}
                    onChange={(e) => setSettings({ ...settings, consequence_statement: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Words</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(settings.consequence_emphasis_words || []).map((word, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {word}
                        <button
                          onClick={() => removeConsequenceEmphasisWord(word)}
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
                      value={consequenceEmphasisInput}
                      onChange={(e) => setConsequenceEmphasisInput(e.target.value)}
                      placeholder="Add word to emphasize (e.g., expensive)"
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      onKeyPress={(e) => e.key === 'Enter' && addConsequenceEmphasisWord()}
                    />
                    <button
                      onClick={addConsequenceEmphasisWord}
                      className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Resolution Statement */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Resolution Statement</h3>
                <div>
                  <textarea
                    value={settings.resolution_statement || ''}
                    onChange={(e) => setSettings({ ...settings, resolution_statement: e.target.value })}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
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
                        alt="Problem statement illustration"
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
                {saving ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[600px]"
              style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
            >
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '40px'
                }} />
              </div>

              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 right-[10%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 left-[5%] w-[350px] h-[350px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'The real problem').split(settings.italic_word || 'real')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'real'}
                    </span>
                    {(settings.section_title || 'The real problem').split(settings.italic_word || 'real')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Opening Statement */}
                <div className="relative">
                  <span 
                    className="absolute -top-10 -left-8 text-8xl font-editorial select-none"
                    style={{ color: `${settings.text_color}08` }}
                  >
                    "
                  </span>
                  <p 
                    className="text-xl md:text-2xl leading-relaxed font-helvetica relative z-10"
                    style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                  >
                    {settings.opening_statement?.includes(settings.opening_emphasis_phrase || '') ? (
                      <>
                        {(settings.opening_statement || '').split(settings.opening_emphasis_phrase || '')[0]}
                        <span className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
                          {settings.opening_emphasis_phrase}
                        </span>
                        {(settings.opening_statement || '').split(settings.opening_emphasis_phrase || '')[1]}
                      </>
                    ) : (
                      settings.opening_statement
                    )}
                  </p>
                </div>

                {/* Fragmented Items */}
                <div 
                  className="my-12 space-y-3 pl-8 border-l-2"
                  style={{ borderColor: `${settings.text_color}15` }}
                >
                  {(settings.fragmented_items || []).map((item, idx) => (
                    <p 
                      key={idx}
                      className="text-base md:text-lg font-helvetica"
                      style={{ color: settings.muted_text_color?.replace('B3', '35') || 'rgba(0, 0, 0, 0.35)' }}
                    >
                      {item}
                    </p>
                  ))}
                </div>

                {/* Consequence Statement */}
                <div 
                  className="rounded-2xl p-8 my-10 border shadow-sm"
                  style={{ 
                    backgroundColor: `${settings.card_background_color || '#ffffff'}50`,
                    borderColor: `${settings.text_color}05`,
                  }}
                >
                  <p 
                    className="text-xl md:text-2xl leading-relaxed font-helvetica"
                    style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                  >
                    {renderPreviewWithEmphasis(
                      settings.consequence_statement || '', 
                      settings.consequence_emphasis_words || []
                    )}
                  </p>
                </div>

                {/* Resolution Statement */}
                <div className="mt-12 pt-6 text-center">
                  <div className="inline-block">
                    <p 
                      className="text-xl md:text-2xl font-medium leading-relaxed font-helvetica"
                      style={{ color: settings.text_color || '#000000' }}
                    >
                      {settings.resolution_statement}
                    </p>
                    <div 
                      className="w-full h-px mt-5"
                      style={{ backgroundColor: `${settings.text_color}15` }}
                    />
                  </div>
                </div>

                {/* Image */}
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