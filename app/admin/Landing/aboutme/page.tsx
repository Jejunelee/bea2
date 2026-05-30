'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { AboutMeSettings, AboutMeCountry, AboutMeParagraph, AboutMeImage } from '@/app/types/aboutme';

export default function AdminAboutMePage() {
  const [settings, setSettings] = useState<Partial<AboutMeSettings>>({});
  const [countries, setCountries] = useState<AboutMeCountry[]>([]);
  const [paragraphs, setParagraphs] = useState<AboutMeParagraph[]>([]);
  const [images, setImages] = useState<AboutMeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('about_me_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch countries
    const { data: countriesData } = await supabase
      .from('about_me_countries')
      .select('*')
      .order('display_order', { ascending: true });
    if (countriesData) setCountries(countriesData);

    // Fetch paragraphs
    const { data: paragraphsData } = await supabase
      .from('about_me_paragraphs')
      .select('*')
      .order('display_order', { ascending: true });
    if (paragraphsData) setParagraphs(paragraphsData);

    // Fetch images
    const { data: imagesData } = await supabase
      .from('about_me_images')
      .select('*')
      .order('position', { ascending: true })
      .order('layer_order', { ascending: true });
    if (imagesData) setImages(imagesData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('about_me_settings')
      .update({
        title_prefix: settings.title_prefix,
        title_name: settings.title_name,
        highlight_image_url: settings.highlight_image_url,
        highlight_image_animation: settings.highlight_image_animation,
        background_color: settings.background_color,
        text_color: settings.text_color,
        italic_text_color: settings.italic_text_color,
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

  const handleHighlightImageUpload = async (file: File) => {
    setUploading('highlight');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `highlight-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('aboutme-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading highlight image');
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('aboutme-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, highlight_image_url: publicUrl });
    setMessage('Highlight image uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploading(null);
  };

  const addCountry = async () => {
    const newOrder = countries.length + 1;
    const { data, error } = await supabase
      .from('about_me_countries')
      .insert({ country_name: 'New Country', flag_emoji: '🏳️', display_order: newOrder })
      .select()
      .single();

    if (error) {
      setMessage('Error adding country');
    } else {
      setCountries([...countries, data]);
      setMessage('Country added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateCountry = async (id: number, field: keyof AboutMeCountry, value: string | number) => {
    const updated = countries.map(c => c.id === id ? { ...c, [field]: value } : c);
    setCountries(updated);
    
    const { error } = await supabase
      .from('about_me_countries')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating country');
  };

  const deleteCountry = async (id: number) => {
    if (!confirm('Delete this country?')) return;
    
    const { error } = await supabase
      .from('about_me_countries')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting country');
    } else {
      setCountries(countries.filter(c => c.id !== id));
      setMessage('Country deleted');
    }
  };

  const addParagraph = async () => {
    const newOrder = paragraphs.length + 1;
    const { data, error } = await supabase
      .from('about_me_paragraphs')
      .insert({ paragraph_text: 'New paragraph text...', is_italic: false, display_order: newOrder })
      .select()
      .single();

    if (error) {
      setMessage('Error adding paragraph');
    } else {
      setParagraphs([...paragraphs, data]);
      setMessage('Paragraph added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateParagraph = async (id: number, field: keyof AboutMeParagraph, value: string | boolean | number) => {
    const updated = paragraphs.map(p => p.id === id ? { ...p, [field]: value } : p);
    setParagraphs(updated);
    
    const { error } = await supabase
      .from('about_me_paragraphs')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating paragraph');
  };

  const deleteParagraph = async (id: number) => {
    if (!confirm('Delete this paragraph?')) return;
    
    const { error } = await supabase
      .from('about_me_paragraphs')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting paragraph');
    } else {
      setParagraphs(paragraphs.filter(p => p.id !== id));
      setMessage('Paragraph deleted');
    }
  };

  const updateImageField = async (id: number, field: keyof AboutMeImage, value: string | number) => {
    const updated = images.map(img => img.id === id ? { ...img, [field]: value } : img);
    setImages(updated);
    
    const { error } = await supabase
      .from('about_me_images')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating image');
  };

  const handleImageUpload = async (imageId: number, file: File) => {
    setUploading(`image-${imageId}`);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `aboutme-${imageId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('aboutme-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage(`Error uploading image`);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('aboutme-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('about_me_images')
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', imageId);

    if (updateError) {
      setMessage('Error saving image URL');
    } else {
      setImages(images.map(img => img.id === imageId ? { ...img, image_url: publicUrl } : img));
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploading(null);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">About Me Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'countries', 'paragraphs', 'images'].map(tab => (
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Title Prefix</label>
                <input
                  type="text"
                  value={settings.title_prefix || ''}
                  onChange={(e) => setSettings({ ...settings, title_prefix: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  value={settings.title_name || ''}
                  onChange={(e) => setSettings({ ...settings, title_name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.background_color || '#FEFDF8'}
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
                <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.text_color || '#374151'}
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

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Italic Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.italic_text_color || '#4B5563'}
                    onChange={(e) => setSettings({ ...settings, italic_text_color: e.target.value })}
                    className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.italic_text_color || ''}
                    onChange={(e) => setSettings({ ...settings, italic_text_color: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Highlight Image</label>
                {settings.highlight_image_url && (
                  <div className="mb-2">
                    <img src={settings.highlight_image_url} alt="Highlight" className="w-32 h-auto border border-gray-200 rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleHighlightImageUpload(e.target.files[0])}
                  disabled={uploading === 'highlight'}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploading === 'highlight' && (
                  <div className="mt-1 text-sm text-gray-500">Uploading...</div>
                )}
                <div className="mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.highlight_image_animation || false}
                      onChange={(e) => setSettings({ ...settings, highlight_image_animation: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable highlight image animation</span>
                  </label>
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

        {/* Countries Tab */}
        {activeTab === 'countries' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Countries</h2>
              <button onClick={addCountry} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Country
              </button>
            </div>
            
            <div className="space-y-3">
              {countries.map(country => (
                <div key={country.id} className="flex gap-3 items-center p-3 border border-gray-200 rounded bg-gray-50">
                  <input
                    type="text"
                    value={country.flag_emoji}
                    onChange={(e) => updateCountry(country.id, 'flag_emoji', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="🇵🇭"
                  />
                  <input
                    type="text"
                    value={country.country_name}
                    onChange={(e) => updateCountry(country.id, 'country_name', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    value={country.display_order}
                    onChange={(e) => updateCountry(country.id, 'display_order', parseInt(e.target.value))}
                    className="w-20 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => deleteCountry(country.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paragraphs Tab */}
        {activeTab === 'paragraphs' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Paragraphs</h2>
              <button onClick={addParagraph} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Paragraph
              </button>
            </div>
            
            <div className="space-y-4">
              {paragraphs.map(paragraph => (
                <div key={paragraph.id} className="p-4 border border-gray-200 rounded bg-gray-50">
                  <textarea
                    value={paragraph.paragraph_text}
                    onChange={(e) => updateParagraph(paragraph.id, 'paragraph_text', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={paragraph.is_italic}
                        onChange={(e) => updateParagraph(paragraph.id, 'is_italic', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Italic style</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={paragraph.display_order}
                        onChange={(e) => updateParagraph(paragraph.id, 'display_order', parseInt(e.target.value))}
                        className="w-20 p-1 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      />
                      <button
                        onClick={() => deleteParagraph(paragraph.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Images</h2>
            
            <div className="space-y-6">
              {images.map(image => (
                <div key={image.id} className="border border-gray-200 rounded p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2 text-gray-800 capitalize">{image.image_key}</h3>
                  
                  {image.image_url && (
                    <div className="mb-3">
                      <img src={image.image_url} alt={image.image_name} className="w-32 h-auto border border-gray-300 rounded" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={image.image_name}
                      onChange={(e) => updateImageField(image.id, 'image_name', e.target.value)}
                      className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      placeholder="Image name"
                    />
                    <input
                      type="text"
                      value={image.width}
                      onChange={(e) => updateImageField(image.id, 'width', e.target.value)}
                      className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      placeholder="Width class (e.g., w-56)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={image.top_offset || ''}
                      onChange={(e) => updateImageField(image.id, 'top_offset', e.target.value)}
                      className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      placeholder="Top offset"
                    />
                    <input
                      type="text"
                      value={image.left_offset || ''}
                      onChange={(e) => updateImageField(image.id, 'left_offset', e.target.value)}
                      className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      placeholder="Left offset"
                    />
                    <input
                      type="text"
                      value={image.right_offset || ''}
                      onChange={(e) => updateImageField(image.id, 'right_offset', e.target.value)}
                      className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      placeholder="Right offset"
                    />
                    <input
                      type="text"
                      value={image.bottom_offset || ''}
                      onChange={(e) => updateImageField(image.id, 'bottom_offset', e.target.value)}
                      className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      placeholder="Bottom offset"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Upload New Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(image.id, e.target.files[0])}
                      disabled={uploading === `image-${image.id}`}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {uploading === `image-${image.id}` && (
                      <div className="mt-1 text-sm text-gray-500">Uploading...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}