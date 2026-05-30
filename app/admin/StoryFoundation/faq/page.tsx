'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { FoundationFAQSettings, FoundationFAQItem } from '@/app/types/StoryFoundation/FAQ';

export default function AdminFoundationFAQPage() {
  const [settings, setSettings] = useState<Partial<FoundationFAQSettings>>({});
  const [faqs, setFaqs] = useState<FoundationFAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [openPreviewIndex, setOpenPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('foundation_faq_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch FAQ items
    const { data: faqsData } = await supabase
      .from('foundation_faq_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (faqsData) setFaqs(faqsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('foundation_faq_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        card_background_color: settings.card_background_color,
        card_hover_color: settings.card_hover_color,
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

  const addFAQ = async () => {
    const newOrder = faqs.length + 1;
    const { data, error } = await supabase
      .from('foundation_faq_items')
      .insert({ 
        question: 'New question?', 
        answer: 'New answer text...',
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding FAQ');
    } else {
      setFaqs([...faqs, data]);
      setMessage('FAQ added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateFAQ = async (id: number, field: keyof FoundationFAQItem, value: string | number) => {
    const updated = faqs.map(f => f.id === id ? { ...f, [field]: value } : f);
    setFaqs(updated);
    
    const { error } = await supabase
      .from('foundation_faq_items')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating FAQ');
  };

  const deleteFAQ = async (id: number) => {
    if (!confirm('Delete this FAQ?')) return;
    
    const { error } = await supabase
      .from('foundation_faq_items')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting FAQ');
    } else {
      setFaqs(faqs.filter(f => f.id !== id));
      setMessage('FAQ deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveFAQ = async (id: number, direction: 'up' | 'down') => {
    const index = faqs.findIndex(f => f.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;
    
    const newFaqs = [...faqs];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newFaqs[index].display_order;
    const swapOrder = newFaqs[swapIndex].display_order;
    
    newFaqs[index].display_order = swapOrder;
    newFaqs[swapIndex].display_order = currentOrder;
    
    newFaqs.sort((a, b) => a.display_order - b.display_order);
    setFaqs(newFaqs);
    
    await supabase
      .from('foundation_faq_items')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('foundation_faq_items')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newFaqs[swapIndex].id);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = settings.glow_intensity || 30;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">FAQ Section Admin (Foundation)</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'faqs', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'faqs' ? 'FAQ Items' : tab}
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
                      value={settings.section_title || 'Frequently asked'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the italic word field to specify which word gets italic styling</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'asked'}
                      onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      placeholder="asked"
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
                        value={settings.muted_text_color || '#00000099'}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.muted_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                        placeholder="rgba(0,0,0,0.6)"
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
                        placeholder="rgba(255,255,255,0.5)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Card Hover Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.card_hover_color || '#ffffffB3'}
                        onChange={(e) => setSettings({ ...settings, card_hover_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.card_hover_color || ''}
                        onChange={(e) => setSettings({ ...settings, card_hover_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                        placeholder="rgba(255,255,255,0.7)"
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
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtle (0%)</span>
                      <span>Current: {settings.glow_intensity || 30}%</span>
                      <span>Strong (100%)</span>
                    </div>
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

        {/* FAQ Items Tab */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">FAQ Items</h2>
              <button onClick={addFAQ} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add FAQ
              </button>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      FAQ #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {faq.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveFAQ(faq.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveFAQ(faq.id, 'down')}
                        disabled={index === faqs.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteFAQ(faq.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  {/* Answer */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={faq.display_order}
                      onChange={(e) => updateFAQ(faq.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {faqs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No FAQ items yet. Click "Add FAQ" to get started.
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
              style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 left-[5%] w-[200px] h-[200px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'Frequently asked').split(settings.italic_word || 'asked')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'asked'}
                    </span>
                    {(settings.section_title || 'Frequently asked').split(settings.italic_word || 'asked')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* FAQ Preview */}
                <div className="space-y-3">
                  {faqs.slice(0, 4).map((faq, idx) => (
                    <div key={faq.id}>
                      <button
                        onClick={() => setOpenPreviewIndex(openPreviewIndex === idx ? null : idx)}
                        className="w-full text-left py-4 px-5 rounded-xl flex justify-between items-center gap-4 transition-colors"
                        style={{
                          backgroundColor: settings.card_background_color || 'rgba(255, 255, 255, 0.5)',
                        }}
                        onMouseEnter={(e) => {
                          if (settings.card_hover_color) {
                            e.currentTarget.style.backgroundColor = settings.card_hover_color;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (settings.card_background_color) {
                            e.currentTarget.style.backgroundColor = settings.card_background_color;
                          }
                        }}
                      >
                        <span 
                          className="text-base md:text-lg font-medium font-helvetica"
                          style={{ color: settings.text_color || '#000000' }}
                        >
                          {faq.question}
                        </span>
                        <span 
                          className="text-xl md:text-2xl flex-shrink-0"
                          style={{ color: `${settings.text_color}40` }}
                        >
                          {openPreviewIndex === idx ? "−" : "+"}
                        </span>
                      </button>
                      
                      {openPreviewIndex === idx && (
                        <div 
                          className="px-5 py-4 text-base md:text-lg leading-relaxed font-helvetica border-l-2 ml-6"
                          style={{ 
                            color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)',
                            borderLeftColor: `${accentColor}40`
                          }}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {faqs.length === 0 && (
                  <div className="text-center py-8" style={{ color: settings.text_color || '#000000' }}>
                    Add FAQ items to see preview
                  </div>
                )}

                {faqs.length > 4 && (
                  <div className="text-center mt-4">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {faqs.length - 4} more questions
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