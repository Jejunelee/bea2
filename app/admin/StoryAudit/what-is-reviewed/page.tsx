'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { WhatIsReviewedSettings, ReviewArea } from '@/app/types/StoryAudit/WhatIsReviewed';
import Image from 'next/image';

export default function AdminWhatIsReviewedPage() {
  const [settings, setSettings] = useState<Partial<WhatIsReviewedSettings>>({});
  const [reviewAreas, setReviewAreas] = useState<ReviewArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [uploading, setUploading] = useState(false);
  const [emphasisInput, setEmphasisInput] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('audit_review_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch review areas
    const { data: areasData } = await supabase
      .from('audit_review_areas')
      .select('*')
      .order('display_order', { ascending: true });
    if (areasData) setReviewAreas(areasData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_review_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        title_emphasis_words: settings.title_emphasis_words,
        image_url: settings.image_url,
        quote_text: settings.quote_text,
        quote_author: settings.quote_author,
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

  const addReviewArea = async () => {
    const newOrder = reviewAreas.length + 1;
    const { data, error } = await supabase
      .from('audit_review_areas')
      .insert({ 
        title: 'New Review Area',
        description: 'Description of what this review area covers...',
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding review area');
    } else {
      setReviewAreas([...reviewAreas, data]);
      setMessage('Review area added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateReviewArea = async (id: number, field: keyof ReviewArea, value: string | number) => {
    const updated = reviewAreas.map(r => r.id === id ? { ...r, [field]: value } : r);
    setReviewAreas(updated);
    
    const { error } = await supabase
      .from('audit_review_areas')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating review area');
  };

  const deleteReviewArea = async (id: number) => {
    if (!confirm('Delete this review area?')) return;
    
    const { error } = await supabase
      .from('audit_review_areas')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting review area');
    } else {
      setReviewAreas(reviewAreas.filter(r => r.id !== id));
      setMessage('Review area deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveReviewArea = async (id: number, direction: 'up' | 'down') => {
    const index = reviewAreas.findIndex(r => r.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === reviewAreas.length - 1) return;
    
    const newAreas = [...reviewAreas];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newAreas[index].display_order;
    const swapOrder = newAreas[swapIndex].display_order;
    
    newAreas[index].display_order = swapOrder;
    newAreas[swapIndex].display_order = currentOrder;
    
    newAreas.sort((a, b) => a.display_order - b.display_order);
    setReviewAreas(newAreas);
    
    await supabase
      .from('audit_review_areas')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('audit_review_areas')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newAreas[swapIndex].id);
  };

  const addEmphasisWord = () => {
    if (emphasisInput.trim() && !settings.title_emphasis_words?.includes(emphasisInput.trim())) {
      setSettings({
        ...settings,
        title_emphasis_words: [...(settings.title_emphasis_words || []), emphasisInput.trim()]
      });
      setEmphasisInput('');
    }
  };

  const removeEmphasisWord = (wordToRemove: string) => {
    setSettings({
      ...settings,
      title_emphasis_words: (settings.title_emphasis_words || []).filter(w => w !== wordToRemove)
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `review-${Date.now()}.${fileExt}`;
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

  // Helper to render preview title with emphasis
  const renderPreviewTitle = (title: string) => {
    const emphasisWords = settings.title_emphasis_words || [];
    
    if (emphasisWords.length > 0) {
      for (const word of emphasisWords) {
        if (title.toLowerCase().includes(word.toLowerCase())) {
          const parts = title.split(new RegExp(`(${word})`, 'i'));
          return (
            <>
              {parts[0]}
              <span className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
                {parts[1]}
              </span>
              {parts[2]}
            </>
          );
        }
      }
    }
    
    // Default: italicize last word
    const words = title.split(' ');
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} {words.length > 0 && ' '}
        <span className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
          {lastWord}
        </span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">What Is Reviewed - Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'review-areas', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'review-areas' ? 'Review Areas' : tab}
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
                      value={settings.section_title || 'What the audit reviews'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'reviews'}
                      onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Title Emphasis Words */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Title Emphasis Words</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(settings.title_emphasis_words || []).map((word, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      {word}
                      <button
                        onClick={() => removeEmphasisWord(word)}
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
                    value={emphasisInput}
                    onChange={(e) => setEmphasisInput(e.target.value)}
                    placeholder="Add word to emphasize in titles (e.g., clarity)"
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    onKeyPress={(e) => e.key === 'Enter' && addEmphasisWord()}
                  />
                  <button
                    onClick={addEmphasisWord}
                    className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">These words will be italicized in the review area titles</p>
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
                        value={settings.background_color || '#fefdf8'}
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
                        value={settings.muted_text_color || '#00000099'}
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

              {/* Quote Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Quote Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Quote Text</label>
                    <textarea
                      value={settings.quote_text || ''}
                      onChange={(e) => setSettings({ ...settings, quote_text: e.target.value })}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Quote Author (Optional)</label>
                    <input
                      type="text"
                      value={settings.quote_author || ''}
                      onChange={(e) => setSettings({ ...settings, quote_author: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      placeholder="e.g., Jane Doe, Founder"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Illustration Image</h3>
                {settings.image_url && (
                  <div className="mb-3">
                    <div className="relative w-full aspect-[11/12] max-w-md">
                      <Image
                        src={settings.image_url}
                        alt="Review illustration"
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
                <p className="text-xs text-gray-500 mt-1">Recommended aspect ratio: 11:12 (portrait)</p>
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

        {/* Review Areas Tab */}
        {activeTab === 'review-areas' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Review Areas</h2>
              <button onClick={addReviewArea} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Review Area
              </button>
            </div>
            
            <div className="space-y-6">
              {reviewAreas.map((area, index) => (
                <div key={area.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Review Area #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {area.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveReviewArea(area.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveReviewArea(area.id, 'down')}
                        disabled={index === reviewAreas.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteReviewArea(area.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                    <input
                      type="text"
                      value={area.title}
                      onChange={(e) => updateReviewArea(area.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Words added to "Title Emphasis Words" in settings will be italicized
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                    <textarea
                      value={area.description}
                      onChange={(e) => updateReviewArea(area.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={area.display_order}
                      onChange={(e) => updateReviewArea(area.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {reviewAreas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No review areas yet. Click "Add Review Area" to get started.
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[500px]"
              style={{ backgroundColor: settings.background_color || '#fefdf8' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'What the audit reviews').split(settings.italic_word || 'reviews')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'reviews'}
                    </span>
                    {(settings.section_title || 'What the audit reviews').split(settings.italic_word || 'reviews')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Review Areas Preview */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {reviewAreas.slice(0, 4).map((area, idx) => (
                    <div key={area.id}>
                      <div className="flex items-start gap-3">
                        <span 
                          className="text-4xl font-editorial italic"
                          style={{ color: `${settings.text_color}10` }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <h3 
                            className="text-xl md:text-2xl font-semibold mb-2 font-helvetica"
                            style={{ color: settings.text_color || '#000000' }}
                          >
                            {renderPreviewTitle(area.title)}
                          </h3>
                          <p 
                            className="text-base md:text-lg leading-relaxed font-helvetica"
                            style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)' }}
                          >
                            {area.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image + Quote Preview */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Image Preview */}
                  {settings.image_url && (
                    <div className="w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={settings.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Quote Preview */}
                  <div 
                    className="relative rounded-lg p-8 py-16"
                    style={{ backgroundColor: `${accentColor}10` }}
                  >
                    <svg 
                      className="w-8 h-8 absolute top-6 left-6"
                      style={{ color: `${accentColor}80` }}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p 
                      className="text-xl lg:text-2xl italic leading-relaxed font-editorial px-4 py-8"
                      style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)' }}
                    >
                      {settings.quote_text || 'Quote text goes here...'}
                    </p>
                    <svg 
                      className="w-8 h-8 absolute bottom-6 right-6 rotate-180"
                      style={{ color: `${accentColor}80` }}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    {settings.quote_author && (
                      <div className="mt-4 text-center">
                        <div 
                          className="w-12 h-px mx-auto"
                          style={{ backgroundColor: accentColor }}
                        />
                        <p 
                          className="text-sm mt-2 font-helvetica"
                          style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)' }}
                        >
                          — {settings.quote_author}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {reviewAreas.length === 0 && (
              <div className="text-center py-8 text-gray-500 mt-4">
                Add review areas to see preview
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}