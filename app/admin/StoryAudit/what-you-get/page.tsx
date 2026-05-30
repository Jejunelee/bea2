'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { WhatYouGetSettings, Deliverable } from '@/app/types/StoryAudit/WhatYouGet';

export default function AdminWhatYouGetPage() {
  const [settings, setSettings] = useState<Partial<WhatYouGetSettings>>({});
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [descriptionEmphasisInput, setDescriptionEmphasisInput] = useState('');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [titleEmphasisWord, setTitleEmphasisWord] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('audit_deliverables_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch deliverables
    const { data: deliverablesData } = await supabase
      .from('audit_deliverables')
      .select('*')
      .order('display_order', { ascending: true });
    if (deliverablesData) setDeliverables(deliverablesData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_deliverables_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        checkmark_background_color: settings.checkmark_background_color,
        checkmark_icon_color: settings.checkmark_icon_color,
        title_emphasis_words: settings.title_emphasis_words,
        description_emphasis_phrases: settings.description_emphasis_phrases,
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

  const addDeliverable = async () => {
    const newOrder = deliverables.length + 1;
    const { data, error } = await supabase
      .from('audit_deliverables')
      .insert({ 
        title: 'New Deliverable',
        description: 'Description of what this deliverable includes...',
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding deliverable');
    } else {
      setDeliverables([...deliverables, data]);
      setMessage('Deliverable added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateDeliverable = async (id: number, field: keyof Deliverable, value: string | number) => {
    const updated = deliverables.map(d => d.id === id ? { ...d, [field]: value } : d);
    setDeliverables(updated);
    
    const { error } = await supabase
      .from('audit_deliverables')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating deliverable');
  };

  const deleteDeliverable = async (id: number) => {
    if (!confirm('Delete this deliverable?')) return;
    
    const { error } = await supabase
      .from('audit_deliverables')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting deliverable');
    } else {
      setDeliverables(deliverables.filter(d => d.id !== id));
      setMessage('Deliverable deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveDeliverable = async (id: number, direction: 'up' | 'down') => {
    const index = deliverables.findIndex(d => d.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === deliverables.length - 1) return;
    
    const newDeliverables = [...deliverables];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newDeliverables[index].display_order;
    const swapOrder = newDeliverables[swapIndex].display_order;
    
    newDeliverables[index].display_order = swapOrder;
    newDeliverables[swapIndex].display_order = currentOrder;
    
    newDeliverables.sort((a, b) => a.display_order - b.display_order);
    setDeliverables(newDeliverables);
    
    await supabase
      .from('audit_deliverables')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('audit_deliverables')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newDeliverables[swapIndex].id);
  };

  const addDescriptionEmphasisPhrase = () => {
    if (descriptionEmphasisInput.trim() && !settings.description_emphasis_phrases?.includes(descriptionEmphasisInput.trim())) {
      setSettings({
        ...settings,
        description_emphasis_phrases: [...(settings.description_emphasis_phrases || []), descriptionEmphasisInput.trim()]
      });
      setDescriptionEmphasisInput('');
    }
  };

  const removeDescriptionEmphasisPhrase = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      description_emphasis_phrases: (settings.description_emphasis_phrases || []).filter(p => p !== phraseToRemove)
    });
  };

  const updateTitleEmphasisWord = (deliverableId: number, title: string, emphasisWord: string) => {
    const currentWords = settings.title_emphasis_words || {};
    const newWords = { ...currentWords };
    
    if (emphasisWord.trim()) {
      newWords[title] = emphasisWord.trim();
    } else {
      delete newWords[title];
    }
    
    setSettings({ ...settings, title_emphasis_words: newWords });
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';

  // Helper to render preview title with emphasis
  const renderPreviewTitle = (title: string) => {
    const emphasisWords = settings.title_emphasis_words || {};
    const customEmphasis = emphasisWords[title];
    
    if (customEmphasis && title.includes(customEmphasis)) {
      const parts = title.split(customEmphasis);
      return (
        <>
          {parts[0]}
          <span className="font-editorial italic" style={{ color: settings.text_color || '#ffffff' }}>
            {customEmphasis}
          </span>
          {parts[1]}
        </>
      );
    }
    
    // Default: italicize last word
    const words = title.split(' ');
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} {words.length > 0 && ' '}
        <span className="font-editorial italic" style={{ color: settings.text_color || '#ffffff' }}>
          {lastWord}
        </span>
      </>
    );
  };

  // Helper to render preview description with emphasis
  const renderPreviewDescription = (description: string) => {
    const emphasisPhrases = settings.description_emphasis_phrases || [];
    if (!emphasisPhrases.length) return description;

    const result = [];
    let lastIndex = 0;
    let descLower = description.toLowerCase();
    const sortedPhrases = [...emphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = descLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(description.substring(lastIndex, index));
        }
        const foundPhrase = description.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={{ color: settings.muted_text_color || 'rgba(255, 255, 255, 0.6)' }}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        descLower = descLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < description.length) {
      result.push(description.substring(lastIndex));
    }
    
    return result.length > 0 ? result : description;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">What You Get - Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'deliverables', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'deliverables' ? 'Deliverables' : tab}
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
                      value={settings.section_title || 'What you get'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'get'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Checkmark Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.checkmark_background_color || '#ffffff1A'}
                        onChange={(e) => setSettings({ ...settings, checkmark_background_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.checkmark_background_color || ''}
                        onChange={(e) => setSettings({ ...settings, checkmark_background_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Checkmark Icon Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.checkmark_icon_color || '#ffffff66'}
                        onChange={(e) => setSettings({ ...settings, checkmark_icon_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.checkmark_icon_color || ''}
                        onChange={(e) => setSettings({ ...settings, checkmark_icon_color: e.target.value })}
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

              {/* Description Emphasis Phrases */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Description Emphasis Phrases</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(settings.description_emphasis_phrases || []).map((phrase, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      {phrase}
                      <button
                        onClick={() => removeDescriptionEmphasisPhrase(phrase)}
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
                    value={descriptionEmphasisInput}
                    onChange={(e) => setDescriptionEmphasisInput(e.target.value)}
                    placeholder="Add phrase to emphasize (e.g., walk through the business)"
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    onKeyPress={(e) => e.key === 'Enter' && addDescriptionEmphasisPhrase()}
                  />
                  <button
                    onClick={addDescriptionEmphasisPhrase}
                    className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">These phrases will be italicized in deliverable descriptions</p>
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

        {/* Deliverables Tab */}
        {activeTab === 'deliverables' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Deliverables</h2>
              <button onClick={addDeliverable} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Deliverable
              </button>
            </div>
            
            <div className="space-y-6">
              {deliverables.map((deliverable, index) => (
                <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Deliverable #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {deliverable.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveDeliverable(deliverable.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveDeliverable(deliverable.id, 'down')}
                        disabled={index === deliverables.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteDeliverable(deliverable.id)}
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
                      value={deliverable.title}
                      onChange={(e) => updateDeliverable(deliverable.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Title Emphasis Word */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Word for This Title</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={(settings.title_emphasis_words || {})[deliverable.title] || ''}
                        onChange={(e) => {
                          const newWords = { ...(settings.title_emphasis_words || {}) };
                          if (e.target.value.trim()) {
                            newWords[deliverable.title] = e.target.value.trim();
                          } else {
                            delete newWords[deliverable.title];
                          }
                          setSettings({ ...settings, title_emphasis_words: newWords });
                        }}
                        placeholder="e.g., call, document, plan"
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector(`#emphasis-${deliverable.id}`) as HTMLInputElement;
                          const newWords = { ...(settings.title_emphasis_words || {}) };
                          if (input.value.trim()) {
                            newWords[deliverable.title] = input.value.trim();
                          } else {
                            delete newWords[deliverable.title];
                          }
                          setSettings({ ...settings, title_emphasis_words: newWords });
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This word will be italicized in the title. Leave empty to italicize the last word.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                    <textarea
                      value={deliverable.description}
                      onChange={(e) => updateDeliverable(deliverable.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Phrases added to "Description Emphasis Phrases" in settings will be italicized
                    </p>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={deliverable.display_order}
                      onChange={(e) => updateDeliverable(deliverable.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {deliverables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No deliverables yet. Click "Add Deliverable" to get started.
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
              style={{ backgroundColor: settings.background_color || '#000000' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 left-[5%] w-[200px] h-[200px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#ffffff' }}
                  >
                    {(settings.section_title || 'What you get').split(settings.italic_word || 'get')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'get'}
                    </span>
                    {(settings.section_title || 'What you get').split(settings.italic_word || 'get')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Deliverables Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                  {deliverables.slice(0, 4).map((deliverable) => (
                    <div key={deliverable.id} className="flex items-start gap-3">
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                        style={{ backgroundColor: settings.checkmark_background_color || '#ffffff1A' }}
                      >
                        <svg 
                          className="w-4 h-4" 
                          style={{ color: settings.checkmark_icon_color || '#ffffff66' }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 
                          className="text-lg font-semibold mb-1 font-helvetica"
                          style={{ color: settings.text_color || '#ffffff' }}
                        >
                          {renderPreviewTitle(deliverable.title)}
                        </h3>
                        <p 
                          className="text-sm leading-relaxed font-helvetica"
                          style={{ color: settings.muted_text_color || 'rgba(255, 255, 255, 0.6)' }}
                        >
                          {renderPreviewDescription(deliverable.description)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {deliverables.length === 0 && (
                  <div className="text-center py-8" style={{ color: settings.text_color || '#ffffff' }}>
                    Add deliverables to see preview
                  </div>
                )}

                {deliverables.length > 4 && (
                  <div className="text-center mt-6">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {deliverables.length - 4} more deliverables
                    </span>
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