'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { PackagesSettings, PackagesItem } from '@/app/types/packages';

export default function AdminPackagesPage() {
  const [settings, setSettings] = useState<Partial<PackagesSettings>>({});
  const [items, setItems] = useState<PackagesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingItem, setEditingItem] = useState<PackagesItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('packages_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch items
    const { data: itemsData } = await supabase
      .from('packages_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (itemsData) setItems(itemsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('packages_settings')
      .update({
        background_color: settings.background_color,
        section_padding_desktop: settings.section_padding_desktop,
        section_padding_mobile: settings.section_padding_mobile,
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
      .from('packages_items')
      .insert({
        display_order: newOrder,
        tag: 'New Package',
        tag_color: '#FED301',
        tag_subtext: 'Subtext',
        title: 'Package title here',
        description: 'Package description here...',
        bullets: ['Bullet point 1', 'Bullet point 2'],
        button_text: 'Learn more →',
        button_link: '/',
        bg_image_url: '',
        italic_words: []
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding package');
    } else {
      setItems([...items, data]);
      setMessage('Package added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateItem = async (item: PackagesItem) => {
    const { error } = await supabase
      .from('packages_items')
      .update({
        tag: item.tag,
        tag_color: item.tag_color,
        tag_subtext: item.tag_subtext,
        title: item.title,
        description: item.description,
        bullets: item.bullets,
        button_text: item.button_text,
        button_link: item.button_link,
        italic_words: item.italic_words,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (error) {
      setMessage('Error updating package');
    } else {
      setItems(items.map(i => i.id === item.id ? item : i));
      setEditingItem(null);
      setMessage('Package updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this package?')) return;
    
    const { error } = await supabase
      .from('packages_items')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting package');
    } else {
      setItems(items.filter(item => item.id !== id));
      setMessage('Package deleted');
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
        .from('packages_items')
        .update({ display_order: item.display_order })
        .eq('id', item.id);
    }

    setItems(updatedItems);
    setMessage('Order updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImageUpload = async (itemId: number, file: File) => {
    setUploadingImage(itemId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `package-${itemId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('package-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading image');
      setUploadingImage(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('package-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('packages_items')
      .update({ bg_image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (updateError) {
      setMessage('Error saving image URL');
    } else {
      setItems(items.map(item => item.id === itemId ? { ...item, bg_image_url: publicUrl } : item));
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploadingImage(null);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Packages Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Section Settings</h2>
          
          <div className="space-y-4">
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
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Desktop Padding Classes</label>
              <input
                type="text"
                value={settings.section_padding_desktop || 'py-16 px-6'}
                onChange={(e) => setSettings({ ...settings, section_padding_desktop: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="py-16 px-6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Mobile Padding Classes</label>
              <input
                type="text"
                value={settings.section_padding_mobile || 'py-12 px-4'}
                onChange={(e) => setSettings({ ...settings, section_padding_mobile: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="py-12 px-4"
              />
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

        {/* Packages Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Packages</h2>
            <button
              onClick={addItem}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Add Package
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
                      <label className="block text-sm font-medium mb-1 text-gray-700">Tag</label>
                      <input
                        type="text"
                        value={editingItem.tag}
                        onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Tag Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editingItem.tag_color}
                          onChange={(e) => setEditingItem({ ...editingItem, tag_color: e.target.value })}
                          className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editingItem.tag_color}
                          onChange={(e) => setEditingItem({ ...editingItem, tag_color: e.target.value })}
                          className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Tag Subtext</label>
                      <input
                        type="text"
                        value={editingItem.tag_subtext}
                        onChange={(e) => setEditingItem({ ...editingItem, tag_subtext: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                      <textarea
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Italic Words (comma-separated)</label>
                      <input
                        type="text"
                        value={editingItem.italic_words.join(', ')}
                        onChange={(e) => setEditingItem({ ...editingItem, italic_words: e.target.value.split(',').map(w => w.trim()) })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="fix, actual, problem"
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
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Bullet Points (one per line)</label>
                      <textarea
                        value={editingItem.bullets.join('\n')}
                        onChange={(e) => setEditingItem({ ...editingItem, bullets: e.target.value.split('\n').filter(b => b.trim()) })}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Button Text</label>
                      <input
                        type="text"
                        value={editingItem.button_text}
                        onChange={(e) => setEditingItem({ ...editingItem, button_text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Button Link</label>
                      <input
                        type="text"
                        value={editingItem.button_link}
                        onChange={(e) => setEditingItem({ ...editingItem, button_link: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Background Image</label>
                      {editingItem.bg_image_url && (
                        <div className="mb-2">
                          <img src={editingItem.bg_image_url} alt="Background" className="w-32 h-auto border border-gray-200 rounded" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={editingItem.bg_image_url}
                        onChange={(e) => setEditingItem({ ...editingItem, bg_image_url: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                        placeholder="Image URL"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(editingItem.id, e.target.files[0])}
                        disabled={uploadingImage === editingItem.id}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                      {uploadingImage === editingItem.id && (
                        <div className="mt-1 text-sm text-gray-500">Uploading...</div>
                      )}
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
                    <div className="mb-2">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full border border-gray-300" style={{ backgroundColor: item.tag_color, color: '#000000' }}>
                        {item.tag}
                      </span>
                      <span className="ml-2 text-xs text-gray-600">{item.tag_subtext}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description.substring(0, 100)}...</p>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-700">Bullets:</strong> {item.bullets.length} items
                    </div>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
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