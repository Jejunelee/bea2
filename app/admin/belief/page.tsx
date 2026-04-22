'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { BeliefSettings, BeliefItem } from '@/app/types/belief';

export default function AdminBeliefPage() {
  const [settings, setSettings] = useState<Partial<BeliefSettings>>({});
  const [items, setItems] = useState<BeliefItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingItem, setEditingItem] = useState<BeliefItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('belief_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch items
    const { data: itemsData } = await supabase
      .from('belief_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (itemsData) setItems(itemsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('belief_settings')
      .update({
        background_image_url: settings.background_image_url,
        background_color: settings.background_color,
        overlay_opacity: settings.overlay_opacity,
        hero_badge_text: settings.hero_badge_text,
        hero_title_prefix: settings.hero_title_prefix,
        hero_title_italic: settings.hero_title_italic,
        hero_title_suffix: settings.hero_title_suffix,
        content_background_color: settings.content_background_color,
        text_color: settings.text_color,
        button_text: settings.button_text,
        button_link: settings.button_link,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
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

  const handleBackgroundImageUpload = async (file: File) => {
    setUploadingImage(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `background-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('belief-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading background image');
      setUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('belief-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, background_image_url: publicUrl });
    setMessage('Background image uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploadingImage(false);
  };

  const addItem = async () => {
    const newOrder = items.length + 1;
    const { data, error } = await supabase
      .from('belief_items')
      .insert({
        display_order: newOrder,
        title: 'New Belief',
        headline_prefix: '',
        headline_italic: '',
        headline_suffix: '',
        description: 'Description goes here...'
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

  const updateItem = async (item: BeliefItem) => {
    const { error } = await supabase
      .from('belief_items')
      .update({
        title: item.title,
        headline_prefix: item.headline_prefix,
        headline_italic: item.headline_italic,
        headline_suffix: item.headline_suffix,
        description: item.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (error) {
      setMessage('Error updating item');
    } else {
      setItems(items.map(i => i.id === item.id ? item : i));
      setEditingItem(null);
      setMessage('Item updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this belief item?')) return;
    
    const { error } = await supabase
      .from('belief_items')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting item');
    } else {
      setItems(items.filter(item => item.id !== id));
      setMessage('Item deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      display_order: idx + 1
    }));

    for (const item of updatedItems) {
      await supabase
        .from('belief_items')
        .update({ display_order: item.display_order })
        .eq('id', item.id);
    }

    setItems(updatedItems);
    setMessage('Order updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Belief Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Hero Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Image</label>
              {settings.background_image_url && (
                <div className="mb-2">
                  <img src={settings.background_image_url} alt="Background" className="w-32 h-auto border border-gray-200 rounded" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleBackgroundImageUpload(e.target.files[0])}
                disabled={uploadingImage}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              <input
                type="text"
                value={settings.background_image_url || ''}
                onChange={(e) => setSettings({ ...settings, background_image_url: e.target.value })}
                className="w-full mt-2 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                placeholder="Or enter image URL directly"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color || '#f3f3f3'}
                  onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_color || ''}
                  onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Overlay Opacity (0-100)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.overlay_opacity || 60}
                onChange={(e) => setSettings({ ...settings, overlay_opacity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-right text-sm text-gray-600">{settings.overlay_opacity || 60}%</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Hero Badge Text</label>
              <input
                type="text"
                value={settings.hero_badge_text || ''}
                onChange={(e) => setSettings({ ...settings, hero_badge_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Title Prefix</label>
                <input
                  type="text"
                  value={settings.hero_title_prefix || ''}
                  onChange={(e) => setSettings({ ...settings, hero_title_prefix: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Title Italic</label>
                <input
                  type="text"
                  value={settings.hero_title_italic || ''}
                  onChange={(e) => setSettings({ ...settings, hero_title_italic: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Title Suffix</label>
                <input
                  type="text"
                  value={settings.hero_title_suffix || ''}
                  onChange={(e) => setSettings({ ...settings, hero_title_suffix: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Content Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Content Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.content_background_color || '#000000'}
                  onChange={(e) => setSettings({ ...settings, content_background_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.content_background_color || ''}
                  onChange={(e) => setSettings({ ...settings, content_background_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.text_color || '#FFFFFF'}
                  onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.text_color || ''}
                  onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Button Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Text</label>
              <input
                type="text"
                value={settings.button_text || ''}
                onChange={(e) => setSettings({ ...settings, button_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Link</label>
              <input
                type="text"
                value={settings.button_link || ''}
                onChange={(e) => setSettings({ ...settings, button_link: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_background_color || '#ADDDB1'}
                  onChange={(e) => setSettings({ ...settings, button_background_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_background_color || ''}
                  onChange={(e) => setSettings({ ...settings, button_background_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_text_color || '#000000'}
                  onChange={(e) => setSettings({ ...settings, button_text_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_text_color || ''}
                  onChange={(e) => setSettings({ ...settings, button_text_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>

        {/* Belief Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Belief Items</h2>
            <button
              onClick={addItem}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Add Belief
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {editingItem?.id === item.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Headline Prefix</label>
                      <input
                        type="text"
                        value={editingItem.headline_prefix}
                        onChange={(e) => setEditingItem({ ...editingItem, headline_prefix: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Headline Italic</label>
                      <input
                        type="text"
                        value={editingItem.headline_italic}
                        onChange={(e) => setEditingItem({ ...editingItem, headline_italic: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Headline Suffix</label>
                      <input
                        type="text"
                        value={editingItem.headline_suffix}
                        onChange={(e) => setEditingItem({ ...editingItem, headline_suffix: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateItem(editingItem)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-700 mb-2">
                      {item.headline_prefix}
                      {item.headline_italic && <span className="italic">{item.headline_italic}</span>}
                      {item.headline_suffix}
                    </p>
                    <p className="text-gray-600 text-sm">{item.description.substring(0, 100)}...</p>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}