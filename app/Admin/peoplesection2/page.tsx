'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { Section2Settings, Section2Episode } from '@/app/types/peoplesection2';

export default function AdminSection2Page() {
  const [settings, setSettings] = useState<Partial<Section2Settings>>({});
  const [episodes, setEpisodes] = useState<Section2Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingEpisode, setEditingEpisode] = useState<Section2Episode | null>(null);
  const [bulletsText, setBulletsText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: settingsData } = await supabase
      .from('section2_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) {
      setSettings(settingsData);
      setBulletsText(settingsData.bullets?.join('\n') || '');
    }

    const { data: episodesData } = await supabase
      .from('section2_episodes')
      .select('*')
      .order('display_order', { ascending: true });
    if (episodesData) setEpisodes(episodesData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const bulletsArray = bulletsText.split('\n').filter(b => b.trim());
    
    const { error } = await supabase
      .from('section2_settings')
      .update({
        background_color: settings.background_color,
        text_color: settings.text_color,
        badge_text: settings.badge_text,
        badge_text_color: settings.badge_text_color,
        title_prefix: settings.title_prefix,
        title_suffix: settings.title_suffix,
        title_color: settings.title_color,
        description: settings.description,
        description_color: settings.description_color,
        bullets: bulletsArray,
        bullet_color: settings.bullet_color,
        button_text: settings.button_text,
        button_background_color: settings.button_background_color,
        button_text_color: settings.button_text_color,
        button_hover_color: settings.button_hover_color,
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

  const addEpisode = async () => {
    const newOrder = episodes.length + 1;
    const { data, error } = await supabase
      .from('section2_episodes')
      .insert({
        display_order: newOrder,
        episode_number: episodes.length + 1,
        title: 'New Episode Title',
        subtitle: 'Episode Subtitle',
        embed_url: 'https://open.spotify.com/embed/...'
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding episode');
    } else {
      setEpisodes([...episodes, data]);
      setMessage('Episode added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateEpisode = async (episode: Section2Episode) => {
    const { error } = await supabase
      .from('section2_episodes')
      .update({
        episode_number: episode.episode_number,
        title: episode.title,
        subtitle: episode.subtitle,
        embed_url: episode.embed_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', episode.id);

    if (error) {
      setMessage('Error updating episode');
    } else {
      setEpisodes(episodes.map(e => e.id === episode.id ? episode : e));
      setEditingEpisode(null);
      setMessage('Episode updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteEpisode = async (id: number) => {
    if (!confirm('Delete this episode?')) return;
    
    const { error } = await supabase
      .from('section2_episodes')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting episode');
    } else {
      setEpisodes(episodes.filter(episode => episode.id !== id));
      setMessage('Episode deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveEpisode = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === episodes.length - 1) return;

    const newEpisodes = [...episodes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newEpisodes[index], newEpisodes[targetIndex]] = [newEpisodes[targetIndex], newEpisodes[index]];
    
    const updatedEpisodes = newEpisodes.map((episode, idx) => ({
      ...episode,
      display_order: idx + 1
    }));

    for (const episode of updatedEpisodes) {
      await supabase
        .from('section2_episodes')
        .update({ display_order: episode.display_order })
        .eq('id', episode.id);
    }

    setEpisodes(updatedEpisodes);
    setMessage('Order updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Section 2 - Origin Series Admin</h1>
        
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
                  value={settings.background_color || '#000000'}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Badge Text</label>
              <input
                type="text"
                value={settings.badge_text || ''}
                onChange={(e) => setSettings({ ...settings, badge_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Badge Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.badge_text_color || '#FFFFFF'}
                  onChange={(e) => setSettings({ ...settings, badge_text_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.badge_text_color || ''}
                  onChange={(e) => setSettings({ ...settings, badge_text_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Suffix</label>
              <input
                type="text"
                value={settings.title_suffix || ''}
                onChange={(e) => setSettings({ ...settings, title_suffix: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.title_color || '#F4D35E'}
                  onChange={(e) => setSettings({ ...settings, title_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.title_color || ''}
                  onChange={(e) => setSettings({ ...settings, title_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.description_color || '#FFFFFF'}
                  onChange={(e) => setSettings({ ...settings, description_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.description_color || ''}
                  onChange={(e) => setSettings({ ...settings, description_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Bullet Points (one per line)</label>
              <textarea
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Bullet Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.bullet_color || '#FFFFFF'}
                  onChange={(e) => setSettings({ ...settings, bullet_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.bullet_color || ''}
                  onChange={(e) => setSettings({ ...settings, bullet_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_background_color || '#F4C400'}
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

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Button Hover Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.button_hover_color || '#E5B800'}
                  onChange={(e) => setSettings({ ...settings, button_hover_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.button_hover_color || ''}
                  onChange={(e) => setSettings({ ...settings, button_hover_color: e.target.value })}
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

        {/* Episodes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Podcast Episodes</h2>
            <button
              onClick={addEpisode}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Add Episode
            </button>
          </div>

          <div className="space-y-4">
            {episodes.map((episode, index) => (
              <div key={episode.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveEpisode(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveEpisode(index, 'down')}
                      disabled={index === episodes.length - 1}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => deleteEpisode(episode.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {editingEpisode?.id === episode.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Episode Number</label>
                      <input
                        type="number"
                        value={editingEpisode.episode_number}
                        onChange={(e) => setEditingEpisode({ ...editingEpisode, episode_number: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                      <input
                        type="text"
                        value={editingEpisode.title}
                        onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Subtitle</label>
                      <input
                        type="text"
                        value={editingEpisode.subtitle}
                        onChange={(e) => setEditingEpisode({ ...editingEpisode, subtitle: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Spotify Embed URL</label>
                      <input
                        type="text"
                        value={editingEpisode.embed_url}
                        onChange={(e) => setEditingEpisode({ ...editingEpisode, embed_url: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="https://open.spotify.com/embed/..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateEpisode(editingEpisode)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingEpisode(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-gray-200 rounded text-sm text-gray-700">
                        Episode {episode.episode_number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-800">{episode.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{episode.subtitle}</p>
                    <p className="text-gray-500 text-xs truncate">{episode.embed_url}</p>
                    <button
                      onClick={() => setEditingEpisode(episode)}
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