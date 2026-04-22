'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { FamiliarCard, FamiliarSettings } from '@/app/types/familiar';
import Image from 'next/image';

export default function AdminFamiliarPage() {
  const [cards, setCards] = useState<FamiliarCard[]>([]);
  const [settings, setSettings] = useState<Partial<FamiliarSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [editingCard, setEditingCard] = useState<FamiliarCard | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch cards
    const { data: cardsData } = await supabase
      .from('familiar_cards')
      .select('*')
      .order('card_order', { ascending: true });
    
    if (cardsData) setCards(cardsData);

    // Fetch settings
    const { data: settingsData } = await supabase
      .from('familiar_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (settingsData) setSettings(settingsData);
    
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('familiar_settings')
      .update({
        heading_text: settings.heading_text,
        heading_italic_word: settings.heading_italic_word,
        subheading_text: settings.subheading_text,
        background_color: settings.background_color,
        card_background_color: settings.card_background_color,
        text_color: settings.text_color,
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

  const handleImageUpload = async (cardId: number, file: File) => {
    setUploading(cardId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `card-${cardId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('familiar-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage(`Error uploading image for card ${cardId}`);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('familiar-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('familiar_cards')
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', cardId);

    if (updateError) {
      setMessage(`Error saving image URL for card ${cardId}`);
    } else {
      setCards(cards.map(card => 
        card.id === cardId ? { ...card, image_url: publicUrl } : card
      ));
      setMessage(`Image for card ${cardId} uploaded successfully!`);
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploading(null);
  };

  const updateCard = async (card: FamiliarCard) => {
    const { error } = await supabase
      .from('familiar_cards')
      .update({
        title: card.title,
        description: card.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', card.id);

    if (error) {
      setMessage('Error updating card');
    } else {
      setCards(cards.map(c => c.id === card.id ? card : c));
      setEditingCard(null);
      setMessage('Card updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addNewCard = async () => {
    const newOrder = cards.length + 1;
    const newCard = {
      card_order: newOrder,
      image_url: '',
      title: 'New Card Title',
      description: 'Card description goes here...',
    };

    const { data, error } = await supabase
      .from('familiar_cards')
      .insert(newCard)
      .select()
      .single();

    if (error) {
      setMessage('Error adding new card');
    } else {
      setCards([...cards, data]);
      setMessage('New card added! Edit it to add details.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteCard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    const { error } = await supabase
      .from('familiar_cards')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting card');
    } else {
      setCards(cards.filter(card => card.id !== id));
      setMessage('Card deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveCard = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;

    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    
    // Update card_order values
    const updatedCards = newCards.map((card, idx) => ({
      ...card,
      card_order: idx + 1
    }));

    // Update in database
    for (const card of updatedCards) {
      await supabase
        .from('familiar_cards')
        .update({ card_order: card.card_order })
        .eq('id', card.id);
    }

    setCards(updatedCards);
    setMessage('Card order updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Familiar Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Settings Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Section Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Heading Text</label>
              <input
                type="text"
                value={settings.heading_text || ''}
                onChange={(e) => setSettings({ ...settings, heading_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word</label>
              <input
                type="text"
                value={settings.heading_italic_word || ''}
                onChange={(e) => setSettings({ ...settings, heading_italic_word: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Subheading Text</label>
              <input
                type="text"
                value={settings.subheading_text || ''}
                onChange={(e) => setSettings({ ...settings, subheading_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color || '#FFFFFF'}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Card Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.card_background_color || '#000000'}
                  onChange={(e) => setSettings({ ...settings, card_background_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.card_background_color || ''}
                  onChange={(e) => setSettings({ ...settings, card_background_color: e.target.value })}
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

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Cards</h2>
            <button
              onClick={addNewCard}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add New Card
            </button>
          </div>

          <div className="space-y-6">
            {cards.map((card, index) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
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
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
                    {card.image_url && (
                      <div className="mb-2">
                        <img 
                          src={card.image_url} 
                          alt={card.title}
                          className="w-32 h-32 object-cover rounded border border-gray-300"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(card.id, e.target.files[0]);
                        }
                      }}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      disabled={uploading === card.id}
                    />
                    {uploading === card.id && (
                      <div className="mt-2 text-sm text-gray-500">Uploading...</div>
                    )}
                  </div>

                  <div>
                    {editingCard?.id === card.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingCard.title}
                          onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="Title"
                        />
                        <textarea
                          value={editingCard.description}
                          onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                          rows={4}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="Description"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateCard(editingCard)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">{card.title}</h3>
                        <p className="text-gray-600 mb-2">{card.description.substring(0, 100)}...</p>
                        <button
                          onClick={() => setEditingCard(card)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edit Text
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}