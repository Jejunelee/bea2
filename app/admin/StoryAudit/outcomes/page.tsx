'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { OutcomesSettings, Outcome } from '@/app/types/StoryAudit/Outcomes';
import Image from 'next/image';

export default function AdminOutcomesPage() {
  const [settings, setSettings] = useState<Partial<OutcomesSettings>>({});
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
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
      .from('audit_outcomes_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch outcomes
    const { data: outcomesData } = await supabase
      .from('audit_outcomes')
      .select('*')
      .order('display_order', { ascending: true });
    if (outcomesData) setOutcomes(outcomesData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_outcomes_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        process_note_text: settings.process_note_text,
        process_note_emphasis_phrases: settings.process_note_emphasis_phrases,
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

  const addOutcome = async () => {
    const newOrder = outcomes.length + 1;
    const { data, error } = await supabase
      .from('audit_outcomes')
      .insert({ 
        text: 'New outcome text...', 
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding outcome');
    } else {
      setOutcomes([...outcomes, data]);
      setMessage('Outcome added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateOutcome = async (id: number, field: keyof Outcome, value: string | number) => {
    const updated = outcomes.map(o => o.id === id ? { ...o, [field]: value } : o);
    setOutcomes(updated);
    
    const { error } = await supabase
      .from('audit_outcomes')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating outcome');
  };

  const deleteOutcome = async (id: number) => {
    if (!confirm('Delete this outcome?')) return;
    
    const { error } = await supabase
      .from('audit_outcomes')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting outcome');
    } else {
      setOutcomes(outcomes.filter(o => o.id !== id));
      setMessage('Outcome deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveOutcome = async (id: number, direction: 'up' | 'down') => {
    const index = outcomes.findIndex(o => o.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === outcomes.length - 1) return;
    
    const newOutcomes = [...outcomes];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newOutcomes[index].display_order;
    const swapOrder = newOutcomes[swapIndex].display_order;
    
    newOutcomes[index].display_order = swapOrder;
    newOutcomes[swapIndex].display_order = currentOrder;
    
    newOutcomes.sort((a, b) => a.display_order - b.display_order);
    setOutcomes(newOutcomes);
    
    await supabase
      .from('audit_outcomes')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('audit_outcomes')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newOutcomes[swapIndex].id);
  };

  const addEmphasisPhrase = () => {
    if (emphasisInput.trim() && !settings.process_note_emphasis_phrases?.includes(emphasisInput.trim())) {
      setSettings({
        ...settings,
        process_note_emphasis_phrases: [...(settings.process_note_emphasis_phrases || []), emphasisInput.trim()]
      });
      setEmphasisInput('');
    }
  };

  const removeEmphasisPhrase = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      process_note_emphasis_phrases: (settings.process_note_emphasis_phrases || []).filter(p => p !== phraseToRemove)
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `outcomes-${Date.now()}.${fileExt}`;
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

  // Helper to render preview headline
  const renderPreviewHeadline = () => {
    const title = settings.section_title || 'What you walk away with';
    const italicWord = settings.italic_word || 'with';
    const parts = title.split(italicWord);
    
    return (
      <>
        {parts[0]}
        <span className="font-editorial italic">{italicWord}</span>
        {parts[1]}
      </>
    );
  };

  // Helper to render preview process note
  const renderPreviewProcessNote = () => {
    const text = settings.process_note_text || '';
    const emphasisPhrases = settings.process_note_emphasis_phrases || [];
    
    if (!emphasisPhrases.length) return text;
    
    let result = [];
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Outcomes Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'outcomes', 'preview'].map(tab => (
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Section Title</label>
                <input
                  type="text"
                  value={settings.section_title || 'What you walk away with'}
                  onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">Use the italic word field to specify which word gets italic styling</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word in Title</label>
                <input
                  type="text"
                  value={settings.italic_word || 'with'}
                  onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  placeholder="with"
                />
              </div>

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
                      placeholder="rgba(0,0,0,0.7)"
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

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Process Note Text</label>
                <textarea
                  value={settings.process_note_text || ''}
                  onChange={(e) => setSettings({ ...settings, process_note_text: e.target.value })}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Process Note Emphasis Phrases</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(settings.process_note_emphasis_phrases || []).map((phrase, idx) => (
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
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={emphasisInput}
                    onChange={(e) => setEmphasisInput(e.target.value)}
                    placeholder="Add phrase to emphasize (e.g., not a generic content audit)"
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

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Outcome Image</label>
                {settings.image_url && (
                  <div className="mb-2">
                    <div className="relative w-full aspect-[16/9] max-w-md">
                      <Image
                        src={settings.image_url}
                        alt="Outcome illustration"
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

        {/* Outcomes Tab */}
        {activeTab === 'outcomes' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Outcome Items</h2>
              <button onClick={addOutcome} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Outcome
              </button>
            </div>
            
            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Outcome #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {outcome.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveOutcome(outcome.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveOutcome(outcome.id, 'down')}
                        disabled={index === outcomes.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteOutcome(outcome.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Outcome Text</label>
                    <textarea
                      value={outcome.text}
                      onChange={(e) => updateOutcome(outcome.id, 'text', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={outcome.display_order}
                      onChange={(e) => updateOutcome(outcome.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {outcomes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No outcome items yet. Click "Add Outcome" to get started.
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden"
              style={{ backgroundColor: settings.background_color || '#ffffff' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {renderPreviewHeadline()}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Outcomes Grid Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                  {outcomes.slice(0, 4).map((outcome) => (
                    <div key={outcome.id} className="flex items-start gap-4">
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                        style={{ backgroundColor: `${settings.text_color}05` }}
                      >
                        <svg 
                          className="w-4 h-4" 
                          style={{ color: `${settings.text_color}40` }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p 
                        className="text-base md:text-lg leading-relaxed font-helvetica flex-1"
                        style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                      >
                        {outcome.text}
                      </p>
                    </div>
                  ))}
                </div>

                {outcomes.length > 4 && (
                  <div className="text-center mt-4">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {outcomes.length - 4} more outcomes
                    </span>
                  </div>
                )}

                {/* Process Note Preview */}
                <div className="mt-8 pt-6 border-t" style={{ borderColor: `${settings.text_color}10` }}>
                  <div 
                    className="rounded-lg p-4 max-w-2xl mx-auto"
                    style={{ backgroundColor: `${settings.text_color}05` }}
                  >
                    <p 
                      className="text-sm md:text-base leading-relaxed font-helvetica italic text-center"
                      style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)' }}
                    >
                      {renderPreviewProcessNote()}
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {settings.image_url && (
                  <div className="mt-8 w-full relative aspect-[15/9]">
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

            {outcomes.length === 0 && (
              <div className="text-center py-8 text-gray-500 mt-4">
                Add outcomes to see preview
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}