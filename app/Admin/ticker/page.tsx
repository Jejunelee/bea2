'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { TickerSettings } from '@/app/types/ticker';

export default function AdminTickerPage() {
  const [settings, setSettings] = useState<Partial<TickerSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('ticker_items')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('ticker_items')
      .update({
        items: settings.items,
        background_color: settings.background_color,
        text_color: settings.text_color,
        separator: settings.separator,
        animation_duration: settings.animation_duration,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) {
      setMessage('Error saving settings');
    } else {
      setMessage('Ticker settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  const addItem = () => {
    if (newItem.trim() && settings.items) {
      setSettings({
        ...settings,
        items: [...settings.items, newItem.trim()]
      });
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    if (settings.items) {
      const newItems = [...settings.items];
      newItems.splice(index, 1);
      setSettings({ ...settings, items: newItems });
    }
  };

  const updateItem = (index: number, value: string) => {
    if (settings.items) {
      const newItems = [...settings.items];
      newItems[index] = value;
      setSettings({ ...settings, items: newItems });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (settings.items) {
      const newItems = [...settings.items];
      if (direction === 'up' && index > 0) {
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      } else if (direction === 'down' && index < newItems.length - 1) {
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      }
      setSettings({ ...settings, items: newItems });
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Ticker Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Appearance Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color || '#ADDDB1'}
                  onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_color || ''}
                  onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="#ADDDB1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.text_color || '#677567'}
                  onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.text_color || ''}
                  onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="#677567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Separator Symbol</label>
              <input
                type="text"
                value={settings.separator || '✦'}
                onChange={(e) => setSettings({ ...settings, separator: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                maxLength={5}
              />
              <p className="text-xs text-gray-500 mt-1">Example: ✦, •, ★, →, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Animation Speed (seconds)</label>
              <input
                type="number"
                value={settings.animation_duration || 28}
                onChange={(e) => setSettings({ ...settings, animation_duration: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                min={5}
                max={60}
              />
              <p className="text-xs text-gray-500 mt-1">Lower number = faster scrolling</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Ticker Items</h2>
          
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add new item..."
              className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={addItem}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {settings.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === (settings.items?.length || 0) - 1}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-colors"
                  >
                    ↓
                  </button>
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2 text-gray-800">Preview</h3>
            <div
              className="overflow-hidden w-full py-4 px-2 rounded"
              style={{
                backgroundColor: settings.background_color || '#ADDDB1',
                color: settings.text_color || '#677567',
              }}
            >
              <div className="flex whitespace-nowrap">
                {[...(settings.items || []), ...(settings.items || [])].slice(0, 8).map((item, i) => (
                  <span key={i} className="text-lg tracking-wide font-normal">
                    {item}
                    <span className="mx-4">{settings.separator || '✦'}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}