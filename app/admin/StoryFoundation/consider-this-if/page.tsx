'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { FoundationConsiderSettings, FoundationConsiderItem } from '@/app/types/StoryFoundation/ConsiderThisIf';

export default function AdminFoundationConsiderPage() {
  const [settings, setSettings] = useState<Partial<FoundationConsiderSettings>>({});
  const [items, setItems] = useState<FoundationConsiderItem[]>([]);
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
      .from('foundation_consider_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch items
    const { data: itemsData } = await supabase
      .from('foundation_consider_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (itemsData) setItems(itemsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('foundation_consider_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        icon_color: settings.icon_color,
        emphasis_words: settings.emphasis_words,
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
      .from('foundation_consider_items')
      .insert({ 
        text: 'New consideration text...', 
        display_order: newOrder
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

  const updateItem = async (id: number, field: keyof FoundationConsiderItem, value: string | number) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    
    const { error } = await supabase
      .from('foundation_consider_items')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating item');
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    
    const { error } = await supabase
      .from('foundation_consider_items')
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

  const moveItem = async (id: number, direction: 'up' | 'down') => {
    const index = items.findIndex(i => i.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newItems[index].display_order;
    const swapOrder = newItems[swapIndex].display_order;
    
    newItems[index].display_order = swapOrder;
    newItems[swapIndex].display_order = currentOrder;
    
    newItems.sort((a, b) => a.display_order - b.display_order);
    setItems(newItems);
    
    await supabase
      .from('foundation_consider_items')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('foundation_consider_items')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newItems[swapIndex].id);
  };

  const addEmphasisWord = () => {
    if (emphasisInput.trim() && !settings.emphasis_words?.includes(emphasisInput.trim())) {
      setSettings({
        ...settings,
        emphasis_words: [...(settings.emphasis_words || []), emphasisInput.trim()]
      });
      setEmphasisInput('');
    }
  };

  const removeEmphasisWord = (wordToRemove: string) => {
    setSettings({
      ...settings,
      emphasis_words: (settings.emphasis_words || []).filter(w => w !== wordToRemove)
    });
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';

  // Helper to render preview text with emphasis
  const renderPreviewText = (text: string) => {
    const emphasisWords = settings.emphasis_words || [];
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
          <span key={index} className="font-editorial italic" style={{ color: settings.text_color || '#ffffff' }}>
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Consider This If - Admin (Foundation)</h1>
        
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
              {tab === 'items' ? 'Consideration Items' : tab}
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
                      value={settings.section_title || 'You should consider this if'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'if'}
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
                        value={settings.muted_text_color || '#ffffffB3'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Icon Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.icon_color || '#ffffff4D'}
                        onChange={(e) => setSettings({ ...settings, icon_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.icon_color || ''}
                        onChange={(e) => setSettings({ ...settings, icon_color: e.target.value })}
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

              {/* Emphasis Words */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Emphasis Words</h3>
                <p className="text-sm text-gray-600 mb-2">These words/phrases will be italicized in the text</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(settings.emphasis_words || []).map((word, idx) => (
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
                  {(!settings.emphasis_words || settings.emphasis_words.length === 0) && (
                    <span className="text-xs text-gray-400">No emphasis words added</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={emphasisInput}
                    onChange={(e) => setEmphasisInput(e.target.value)}
                    placeholder="Add word or phrase to emphasize (e.g., tight)"
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === items.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Words added to "Emphasis Words" in settings will be italicized
                    </p>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={item.display_order}
                      onChange={(e) => updateItem(item.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
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
              className="rounded-lg p-8 relative overflow-hidden min-h-[400px]"
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

              <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header Preview */}
                <div className="mb-8 text-center">
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

                {/* Items Preview */}
                <div className="space-y-4">
                  {items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <span 
                        className="text-base mt-0.5"
                        style={{ color: settings.icon_color || '#ffffff4D' }}
                      >
                        ✦
                      </span>
                      <p 
                        className="text-base leading-relaxed font-helvetica"
                        style={{ color: settings.muted_text_color || 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {renderPreviewText(item.text)}
                      </p>
                    </div>
                  ))}
                </div>

                {items.length === 0 && (
                  <div className="text-center py-8" style={{ color: settings.text_color || '#ffffff' }}>
                    Add items to see preview
                  </div>
                )}

                {items.length > 5 && (
                  <div className="text-center mt-4">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {items.length - 5} more items
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