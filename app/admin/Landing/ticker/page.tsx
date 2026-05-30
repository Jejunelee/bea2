'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';

interface TickerItem {
  id: string;
  text: string;
  logo_url?: string;
}

export default function AdminTickerPage() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [background_color, setBackgroundColor] = useState('#ADDDB1');
  const [text_color, setTextColor] = useState('#677567');
  const [separator, setSeparator] = useState('✦');
  const [animation_duration, setAnimationDuration] = useState(28);
  const [logo_height, setLogoHeight] = useState('2rem');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        setItems(data.items || []);
        setBackgroundColor(data.background_color || '#ADDDB1');
        setTextColor(data.text_color || '#677567');
        setSeparator(data.separator || '✦');
        setAnimationDuration(data.animation_duration || 28);
        setLogoHeight(data.logo_height || '2rem');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('ticker_items')
        .upsert({
          id: 1,
          items,
          background_color,
          text_color,
          separator,
          animation_duration,
          logo_height,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: TickerItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
    };
    
    setItems([...items, newItem]);
    setNewItemText('');
  };

  const updateItem = (id: string, text: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (direction === 'up' && index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setItems(newItems);
    } else if (direction === 'down' && index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
    }
  };

  const uploadLogo = async (itemId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `ticker_${itemId}.${fileExt}`;
      const filePath = `ticker-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ticker-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ticker-assets')
        .getPublicUrl(filePath);

      setItems(items.map(item =>
        item.id === itemId ? { ...item, logo_url: publicUrl } : item
      ));

      setMessage('Logo uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setMessage('Error uploading logo');
    }
  };

  const removeLogo = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, logo_url: undefined } : item
    ));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-900 font-medium">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Ticker Admin</h1>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg font-medium border border-green-200">
            {message}
          </div>
        )}

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Appearance</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Background Color</label>
              <input
                type="color"
                value={background_color}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Text Color</label>
              <input
                type="color"
                value={text_color}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Separator</label>
              <input
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-gray-900 font-medium"
                maxLength={5}
              />
              <p className="text-xs text-gray-600 mt-1">Example: ✦, •, ★, →, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Animation Speed (seconds)</label>
              <input
                type="number"
                value={animation_duration}
                onChange={(e) => setAnimationDuration(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded text-gray-900 font-medium"
                min={5}
                max={60}
              />
              <p className="text-xs text-gray-600 mt-1">Lower number = faster scrolling</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Logo Height</label>
              <input
                type="text"
                value={logo_height}
                onChange={(e) => setLogoHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-gray-900 font-medium"
                placeholder="2rem, 32px, etc."
              />
              <p className="text-xs text-gray-600 mt-1">Example: 2rem, 32px, 1.5em</p>
            </div>
          </div>
        </div>

        {/* Items Management */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Ticker Items</h2>

          {/* Add new item */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Enter item name..."
              className="flex-1 p-2 border border-gray-300 rounded text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addItem}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
            >
              Add Item
            </button>
          </div>

          {/* Items list */}
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-medium">
                No items added yet. Click "Add Item" to get started.
              </div>
            )}
            
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-0.5 text-gray-700 hover:text-gray-900 disabled:opacity-30 font-bold"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === items.length - 1}
                      className="px-2 py-0.5 text-gray-700 hover:text-gray-900 disabled:opacity-30 font-bold"
                    >
                      ↓
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateItem(item.id, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {/* Logo section */}
                <div className="ml-8 flex items-center gap-3 flex-wrap">
                  {item.logo_url && (
                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                      <img
                        src={item.logo_url}
                        alt={item.text}
                        className="object-contain border rounded p-1 bg-white"
                        style={{ height: '40px' }}
                      />
                      <button
                        onClick={() => removeLogo(item.id)}
                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <label className="px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded cursor-pointer hover:bg-blue-700 transition-colors">
                    {item.logo_url ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadLogo(item.id, file);
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500">Recommended: Square images, max 100px height</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Live Preview</h2>
          <div
            className="overflow-hidden w-full py-4 px-2 rounded-lg"
            style={{
              backgroundColor: background_color,
              color: text_color,
            }}
          >
            <div className="flex whitespace-nowrap overflow-x-hidden">
              {[...items, ...items].slice(0, 6).map((item, i) => (
                <div key={i} className="inline-flex items-center gap-2 mx-2">
                  {item.logo_url && (
                    <img
                      src={item.logo_url}
                      alt={item.text}
                      style={{ height: logo_height }}
                      className="object-contain"
                    />
                  )}
                  <span className="text-lg font-medium whitespace-nowrap">{item.text}</span>
                  <span className="mx-2 text-lg">{separator}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This is how your ticker will appear on the frontend</p>
        </div>

        {/* Save button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}