'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { ConsiderThisIfSettings, ConsiderThisIfItem } from '@/app/types/StoryAudit/ConsiderThisIf';

export default function AdminConsiderThisIfPage() {
  const [settings, setSettings] = useState<Partial<ConsiderThisIfSettings>>({});
  const [items, setItems] = useState<ConsiderThisIfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedItem, setSelectedItem] = useState<ConsiderThisIfItem | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('audit_consider_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch items
    const { data: itemsData } = await supabase
      .from('audit_consider_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (itemsData) setItems(itemsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_consider_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
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

  const addItem = async () => {
    const newOrder = items.length + 1;
    const { data, error } = await supabase
      .from('audit_consider_items')
      .insert({ 
        text: 'New consideration text...', 
        display_order: newOrder,
        emphasis_words: []
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding item');
    } else {
      setItems([...items, data]);
      setMessage('Item added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateItem = async (id: number, field: keyof ConsiderThisIfItem, value: string | number | string[]) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    
    const { error } = await supabase
      .from('audit_consider_items')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating item');
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    
    const { error } = await supabase
      .from('audit_consider_items')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting item');
    } else {
      setItems(items.filter(i => i.id !== id));
      setMessage('Item deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addEmphasisWord = (itemId: number, word: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && !item.emphasis_words?.includes(word)) {
      const newWords = [...(item.emphasis_words || []), word];
      updateItem(itemId, 'emphasis_words', newWords);
    }
  };

  const removeEmphasisWord = (itemId: number, wordToRemove: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newWords = (item.emphasis_words || []).filter(w => w !== wordToRemove);
      updateItem(itemId, 'emphasis_words', newWords);
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const glowOpacity = (settings.glow_intensity || 30) / 100;
  const accentColor = settings.accent_color || '#e9c08f';

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Consider This If - Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'items', 'preview'].map(tab => (
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
                  value={settings.section_title || 'You should consider this if'}
                  onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  placeholder="You should consider this if"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word</label>
                <input
                  type="text"
                  value={settings.italic_word || 'if'}
                  onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  placeholder="if"
                />
                <p className="text-xs text-gray-500 mt-1">This word will be italicized in the title</p>
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
                      value={settings.muted_text_color || '#ffffffB3'}
                      onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                      className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.muted_text_color || ''}
                      onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      placeholder="rgba(255,255,255,0.7)"
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

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Consideration Items</h2>
              <button onClick={addItem} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Item #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {item.display_order}
                      </span>
                    </h3>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Text */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Text</label>
                    <textarea
                      value={item.text}
                      onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  {/* Display Order */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={item.display_order}
                      onChange={(e) => updateItem(item.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Emphasis Words Management */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Words</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(item.emphasis_words || []).map((word, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          {word}
                          <button
                            onClick={() => removeEmphasisWord(item.id, word)}
                            className="hover:text-blue-900 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!item.emphasis_words || item.emphasis_words.length === 0) && (
                        <span className="text-xs text-gray-500">No emphasis words added</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id={`new-word-${item.id}`}
                        placeholder="Add word to emphasize (e.g., changed)"
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              addEmphasisWord(item.id, input.value.trim());
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`new-word-${item.id}`) as HTMLInputElement;
                          if (input.value.trim()) {
                            addEmphasisWord(item.id, input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Words added here will be italicized when displayed
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items yet. Click "Add Item" to get started.
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
              style={{ backgroundColor: settings.background_color || '#000000' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(glowOpacity * 100).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(glowOpacity * 50).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#ffffff' }}
                  >
                    {(settings.section_title || 'You should consider this if').split(settings.italic_word || 'if')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'if'}
                    </span>
                    {(settings.section_title || 'You should consider this if').split(settings.italic_word || 'if')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                <div className="space-y-5">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <span 
                        className="text-xl mt-0.5"
                        style={{ color: `${settings.muted_text_color || '#ffffffB3'}` }}
                      >
                        ✦
                      </span>
                      <p 
                        className="text-lg md:text-xl leading-relaxed font-helvetica"
                        style={{ color: settings.muted_text_color || '#ffffffB3' }}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {items.length > 3 && (
                  <div className="text-center mt-4">
                    <span className="text-xs" style={{ color: `${settings.muted_text_color}` }}>
                      + {items.length - 3} more items
                    </span>
                  </div>
                )}
              </div>
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 mt-4">
                Add items to see preview
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}