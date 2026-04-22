'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { LatestSettings, LatestCard, SocialLink } from '@/app/types/latest';

export default function AdminLatestPage() {
  const [settings, setSettings] = useState<Partial<LatestSettings>>({});
  const [cards, setCards] = useState<LatestCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingCard, setEditingCard] = useState<LatestCard | null>(null);
  const [uploadingIcon, setUploadingIcon] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [uploadingHeadphones, setUploadingHeadphones] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('latest_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch cards
    const { data: cardsData } = await supabase
      .from('latest_cards')
      .select('*')
      .order('display_order', { ascending: true });
    if (cardsData) setCards(cardsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('latest_settings')
      .update({
        background_color: settings.background_color,
        title_text: settings.title_text,
        social_links: settings.social_links,
        podcast_title: settings.podcast_title,
        headphones_image_url: settings.headphones_image_url,
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

  const addSocialLink = () => {
    const currentLinks = settings.social_links || [];
    setSettings({
      ...settings,
      social_links: [...currentLinks, { name: 'new', url: '/work' }]
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const currentLinks = settings.social_links || [];
    const newLinks = [...currentLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings({ ...settings, social_links: newLinks });
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = settings.social_links || [];
    const newLinks = currentLinks.filter((_, i) => i !== index);
    setSettings({ ...settings, social_links: newLinks });
  };

  const addCard = async () => {
    const newOrder = cards.length + 1;
    const { data, error } = await supabase
      .from('latest_cards')
      .insert({
        display_order: newOrder,
        background_color: '#cccccc',
        icon_url: '',
        image_url: '',
        link_url: '/work'
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding card');
    } else {
      setCards([...cards, data]);
      setMessage('Card added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateCard = async (card: LatestCard) => {
    const { error } = await supabase
      .from('latest_cards')
      .update({
        background_color: card.background_color,
        link_url: card.link_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', card.id);

    if (error) {
      setMessage('Error updating card');
    } else {
      setCards(cards.map(c => c.id === card.id ? card : c));
      setEditingCard(null);
      setMessage('Card updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteCard = async (id: number) => {
    if (!confirm('Delete this card?')) return;
    
    const { error } = await supabase
      .from('latest_cards')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting card');
    } else {
      setCards(cards.filter(card => card.id !== id));
      setMessage('Card deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveCard = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;

    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    
    const updatedCards = newCards.map((card, idx) => ({
      ...card,
      display_order: idx + 1
    }));

    for (const card of updatedCards) {
      await supabase
        .from('latest_cards')
        .update({ display_order: card.display_order })
        .eq('id', card.id);
    }

    setCards(updatedCards);
    setMessage('Order updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleIconUpload = async (cardId: number, file: File) => {
    setUploadingIcon(cardId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `icon-${cardId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('latest-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading icon');
      setUploadingIcon(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('latest-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('latest_cards')
      .update({ icon_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', cardId);

    if (updateError) {
      setMessage('Error saving icon URL');
    } else {
      setCards(cards.map(card => card.id === cardId ? { ...card, icon_url: publicUrl } : card));
      setMessage('Icon uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploadingIcon(null);
  };

  const handleImageUpload = async (cardId: number, file: File) => {
    setUploadingImage(cardId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `image-${cardId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('latest-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading image');
      setUploadingImage(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('latest-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('latest_cards')
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', cardId);

    if (updateError) {
      setMessage('Error saving image URL');
    } else {
      setCards(cards.map(card => card.id === cardId ? { ...card, image_url: publicUrl } : card));
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploadingImage(null);
  };

  const handleHeadphonesUpload = async (file: File) => {
    setUploadingHeadphones(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `headphones-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('latest-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading headphones image');
      setUploadingHeadphones(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('latest-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, headphones_image_url: publicUrl });
    setMessage('Headphones image uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploadingHeadphones(false);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Latest Section Admin</h1>
        
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Text</label>
              <input
                type="text"
                value={settings.title_text || ''}
                onChange={(e) => setSettings({ ...settings, title_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Podcast Title</label>
              <input
                type="text"
                value={settings.podcast_title || ''}
                onChange={(e) => setSettings({ ...settings, podcast_title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Headphones Image</label>
              {settings.headphones_image_url && (
                <div className="mb-2">
                  <img src={settings.headphones_image_url} alt="Headphones" className="w-24 h-auto border border-gray-200 rounded" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleHeadphonesUpload(e.target.files[0])}
                disabled={uploadingHeadphones}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {uploadingHeadphones && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Social Links</label>
              {settings.social_links?.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Social name"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="URL"
                  />
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addSocialLink}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
              >
                Add Social Link
              </button>
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

        {/* Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Content Cards</h2>
            <button
              onClick={addCard}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Add Card
            </button>
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveCard(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveCard(index, 'down')}
                      disabled={index === cards.length - 1}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={card.background_color}
                        onChange={(e) => {
                          const updated = cards.map(c => c.id === card.id ? { ...c, background_color: e.target.value } : c);
                          setCards(updated);
                        }}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={card.background_color}
                        onChange={(e) => {
                          const updated = cards.map(c => c.id === card.id ? { ...c, background_color: e.target.value } : c);
                          setCards(updated);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Link URL</label>
                    <input
                      type="text"
                      value={card.link_url}
                      onChange={(e) => {
                        const updated = cards.map(c => c.id === card.id ? { ...c, link_url: e.target.value } : c);
                        setCards(updated);
                      }}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Icon</label>
                    {card.icon_url && (
                      <div className="mb-2">
                        <img src={card.icon_url} alt="Icon" className="w-12 h-12 object-contain border border-gray-200 rounded" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleIconUpload(card.id, e.target.files[0])}
                      disabled={uploadingIcon === card.id}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {uploadingIcon === card.id && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
                    {card.image_url && (
                      <div className="mb-2">
                        <img src={card.image_url} alt="Card" className="w-32 h-auto border border-gray-200 rounded" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(card.id, e.target.files[0])}
                      disabled={uploadingImage === card.id}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {uploadingImage === card.id && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                  </div>
                </div>

                <button
                  onClick={() => updateCard(card)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Save Card Changes
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}