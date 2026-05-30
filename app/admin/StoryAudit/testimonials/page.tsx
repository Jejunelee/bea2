'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { TestimonialsSettings, Testimonial } from '@/app/types/StoryAudit/Testimonials';

export default function AdminTestimonialsPage() {
  const [settings, setSettings] = useState<Partial<TestimonialsSettings>>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [emphasisInput, setEmphasisInput] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('audit_testimonials_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch testimonials
    const { data: testimonialsData } = await supabase
      .from('audit_testimonials')
      .select('*')
      .order('display_order', { ascending: true });
    if (testimonialsData) setTestimonials(testimonialsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_testimonials_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_gradient_start: settings.background_gradient_start,
        background_gradient_middle: settings.background_gradient_middle,
        background_gradient_end: settings.background_gradient_end,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        author_text_color: settings.author_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        quote_emphasis_phrases: settings.quote_emphasis_phrases,
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

  const addTestimonial = async () => {
    const newOrder = testimonials.length + 1;
    const { data, error } = await supabase
      .from('audit_testimonials')
      .insert({ 
        quote: 'New testimonial quote...', 
        author: 'Author Name',
        role: '',
        company: '',
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding testimonial');
    } else {
      setTestimonials([...testimonials, data]);
      setMessage('Testimonial added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateTestimonial = async (id: number, field: keyof Testimonial, value: string | number) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, [field]: value } : t);
    setTestimonials(updated);
    
    const { error } = await supabase
      .from('audit_testimonials')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating testimonial');
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    
    const { error } = await supabase
      .from('audit_testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting testimonial');
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id));
      setMessage('Testimonial deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveTestimonial = async (id: number, direction: 'up' | 'down') => {
    const index = testimonials.findIndex(t => t.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === testimonials.length - 1) return;
    
    const newTestimonials = [...testimonials];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newTestimonials[index].display_order;
    const swapOrder = newTestimonials[swapIndex].display_order;
    
    newTestimonials[index].display_order = swapOrder;
    newTestimonials[swapIndex].display_order = currentOrder;
    
    newTestimonials.sort((a, b) => a.display_order - b.display_order);
    setTestimonials(newTestimonials);
    
    await supabase
      .from('audit_testimonials')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('audit_testimonials')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newTestimonials[swapIndex].id);
  };

  const addEmphasisPhrase = () => {
    if (emphasisInput.trim() && !settings.quote_emphasis_phrases?.includes(emphasisInput.trim())) {
      setSettings({
        ...settings,
        quote_emphasis_phrases: [...(settings.quote_emphasis_phrases || []), emphasisInput.trim()]
      });
      setEmphasisInput('');
    }
  };

  const removeEmphasisPhrase = (phraseToRemove: string) => {
    setSettings({
      ...settings,
      quote_emphasis_phrases: (settings.quote_emphasis_phrases || []).filter(p => p !== phraseToRemove)
    });
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';

  // Helper to render preview quote with emphasis
  const renderPreviewQuote = (quote: string) => {
    const emphasisPhrases = settings.quote_emphasis_phrases || [];
    if (!emphasisPhrases.length) return quote;

    const result = [];
    let lastIndex = 0;
    let quoteLower = quote.toLowerCase();
    const sortedPhrases = [...emphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = quoteLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(quote.substring(lastIndex, index));
        }
        const foundPhrase = quote.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        quoteLower = quoteLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < quote.length) {
      result.push(quote.substring(lastIndex));
    }
    
    return result.length > 0 ? result : quote;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Testimonials Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'testimonials', 'preview'].map(tab => (
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
                      value={settings.section_title || 'What clients say'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'clients'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Author Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.author_text_color || '#00000066'}
                        onChange={(e) => setSettings({ ...settings, author_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.author_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, author_text_color: e.target.value })}
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

              {/* Background Gradient Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Background Gradient</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Gradient Start Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.background_gradient_start || '#ffffff'}
                        onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.background_gradient_start || ''}
                        onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Gradient Middle Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.background_gradient_middle || '#f5f3ef'}
                        onChange={(e) => setSettings({ ...settings, background_gradient_middle: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.background_gradient_middle || ''}
                        onChange={(e) => setSettings({ ...settings, background_gradient_middle: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Gradient End Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.background_gradient_end || '#f5f3ef'}
                        onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.background_gradient_end || ''}
                        onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-lg" style={{
                  background: `linear-gradient(to bottom, ${settings.background_gradient_start || '#ffffff'} 0%, ${settings.background_gradient_middle || '#f5f3ef'} 30%, ${settings.background_gradient_end || '#f5f3ef'} 100%)`
                }}>
                  <p className="text-xs text-center text-gray-500">Gradient Preview</p>
                </div>
              </div>

              {/* Quote Emphasis Phrases */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Quote Emphasis Phrases</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(settings.quote_emphasis_phrases || []).map((phrase, idx) => (
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
                    placeholder="Add phrase to emphasize (e.g., clarity I'd been missing)"
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
                <p className="text-xs text-gray-500 mt-1">These phrases will be italicized in the quote text</p>
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

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Testimonial Items</h2>
              <button onClick={addTestimonial} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Testimonial
              </button>
            </div>
            
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Testimonial #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {testimonial.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveTestimonial(testimonial.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveTestimonial(testimonial.id, 'down')}
                        disabled={index === testimonials.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Quote</label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  {/* Author Info */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Author</label>
                      <input
                        type="text"
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                      <input
                        type="text"
                        value={testimonial.role || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Company</label>
                      <input
                        type="text"
                        value={testimonial.company || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={testimonial.display_order}
                      onChange={(e) => updateTestimonial(testimonial.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No testimonials yet. Click "Add Testimonial" to get started.
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[400px]"
              style={{ 
                background: `linear-gradient(to bottom, ${settings.background_gradient_start || '#ffffff'} 0%, ${settings.background_gradient_middle || '#f5f3ef'} 30%, ${settings.background_gradient_end || '#f5f3ef'} 100%)`
              }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 left-[10%] w-[200px] h-[200px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10">
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'What clients say').split(settings.italic_word || 'clients')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'clients'}
                    </span>
                    {(settings.section_title || 'What clients say').split(settings.italic_word || 'clients')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Testimonials Preview */}
                <div className={`grid ${testimonials.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : testimonials.length === 2 ? 'grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-3 max-w-6xl mx-auto'} gap-8`}>
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <div key={testimonial.id} className="text-center">
                      <p 
                        className="text-xl md:text-2xl leading-relaxed font-helvetica mb-4"
                        style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)' }}
                      >
                        {renderPreviewQuote(testimonial.quote)}
                      </p>
                      {testimonial.author && (
                        <div className="pt-4">
                          <p 
                            className="text-base md:text-lg font-helvetica"
                            style={{ color: settings.author_text_color || 'rgba(0, 0, 0, 0.4)' }}
                          >
                            — {testimonial.author}
                            {testimonial.role && `, ${testimonial.role}`}
                            {testimonial.company && `, ${testimonial.company}`}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {testimonials.length > 3 && (
                  <div className="text-center mt-6">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {testimonials.length - 3} more testimonials
                    </span>
                  </div>
                )}
              </div>
            </div>

            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500 mt-4">
                Add testimonials to see preview
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}