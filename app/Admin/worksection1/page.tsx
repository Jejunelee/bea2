'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { SocialFeedSettings, SocialFeedPlatform, SocialFeedPost, SocialFeedSocialLink } from '@/app/types/worksection1';

export default function AdminSocialFeedPage() {
  const [settings, setSettings] = useState<Partial<SocialFeedSettings>>({});
  const [platforms, setPlatforms] = useState<SocialFeedPlatform[]>([]);
  const [posts, setPosts] = useState<SocialFeedPost[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialFeedSocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [editingPost, setEditingPost] = useState<SocialFeedPost | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<SocialFeedPlatform | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialFeedSocialLink | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    const { data: settingsData } = await supabase
      .from('social_feed_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    const { data: platformsData } = await supabase
      .from('social_feed_platforms')
      .select('*')
      .order('display_order', { ascending: true });
    if (platformsData) setPlatforms(platformsData);

    const { data: postsData } = await supabase
      .from('social_feed_posts')
      .select('*')
      .order('platform_key', { ascending: true })
      .order('display_order', { ascending: true });
    if (postsData) setPosts(postsData);

    const { data: socialLinksData } = await supabase
      .from('social_feed_social_links')
      .select('*')
      .order('display_order', { ascending: true });
    if (socialLinksData) setSocialLinks(socialLinksData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('social_feed_settings')
      .update({
        background_gradient_start: settings.background_gradient_start,
        background_gradient_end: settings.background_gradient_end,
        search_placeholder: settings.search_placeholder,
        expand_all_text: settings.expand_all_text,
        collapse_all_text: settings.collapse_all_text,
        no_results_text: settings.no_results_text,
        clear_search_text: settings.clear_search_text,
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

  const updatePlatform = async (platform: SocialFeedPlatform) => {
    const { error } = await supabase
      .from('social_feed_platforms')
      .update({
        display_name: platform.display_name,
        icon_class: platform.icon_class,
        icon_gradient: platform.icon_gradient,
        follow_link: platform.follow_link,
        follow_text: platform.follow_text,
        is_active: platform.is_active,
        display_order: platform.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', platform.id);

    if (error) {
      setMessage('Error updating platform');
    } else {
      setPlatforms(platforms.map(p => p.id === platform.id ? platform : p));
      setEditingPlatform(null);
      setMessage('Platform updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addPost = async () => {
    const { data, error } = await supabase
      .from('social_feed_posts')
      .insert({
        platform_key: 'instagram',
        post_url: '',
        embed_url: '',
        caption: '',
        title: '',
        display_order: 0,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding post');
    } else {
      setPosts([...posts, data]);
      setEditingPost(data);
      setMessage('Post added! Edit to add details.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updatePost = async (post: SocialFeedPost) => {
    const { error } = await supabase
      .from('social_feed_posts')
      .update({
        platform_key: post.platform_key,
        post_url: post.post_url,
        embed_url: post.embed_url,
        caption: post.caption,
        title: post.title,
        display_order: post.display_order,
        is_active: post.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (error) {
      setMessage('Error updating post');
    } else {
      setPosts(posts.map(p => p.id === post.id ? post : p));
      setEditingPost(null);
      setMessage('Post updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    
    const { error } = await supabase
      .from('social_feed_posts')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting post');
    } else {
      setPosts(posts.filter(post => post.id !== id));
      setMessage('Post deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateSocialLink = async (link: SocialFeedSocialLink) => {
    const { error } = await supabase
      .from('social_feed_social_links')
      .update({
        name: link.name,
        url: link.url,
        background_color: link.background_color,
        is_active: link.is_active,
        display_order: link.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', link.id);

    if (error) {
      setMessage('Error updating social link');
    } else {
      setSocialLinks(socialLinks.map(l => l.id === link.id ? link : l));
      setEditingSocialLink(null);
      setMessage('Social link updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Social Feed Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'platforms', 'posts', 'social-links'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Background Gradient Start</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.background_gradient_start || '#f9fafb'}
                    onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                    className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.background_gradient_start || ''}
                    onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Background Gradient End</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.background_gradient_end || '#f3f4f6'}
                    onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                    className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.background_gradient_end || ''}
                    onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Search Placeholder</label>
                <input
                  type="text"
                  value={settings.search_placeholder || ''}
                  onChange={(e) => setSettings({ ...settings, search_placeholder: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Expand All Text</label>
                  <input
                    type="text"
                    value={settings.expand_all_text || ''}
                    onChange={(e) => setSettings({ ...settings, expand_all_text: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Collapse All Text</label>
                  <input
                    type="text"
                    value={settings.collapse_all_text || ''}
                    onChange={(e) => setSettings({ ...settings, collapse_all_text: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">No Results Text</label>
                <input
                  type="text"
                  value={settings.no_results_text || ''}
                  onChange={(e) => setSettings({ ...settings, no_results_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Clear Search Text</label>
                <input
                  type="text"
                  value={settings.clear_search_text || ''}
                  onChange={(e) => setSettings({ ...settings, clear_search_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
        )}

        {/* Platforms Tab */}
        {activeTab === 'platforms' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Platforms</h2>
            
            <div className="space-y-4">
              {platforms.map(platform => (
                <div key={platform.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {editingPlatform?.id === platform.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Display Name</label>
                        <input
                          type="text"
                          value={editingPlatform.display_name}
                          onChange={(e) => setEditingPlatform({ ...editingPlatform, display_name: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Icon Class (FontAwesome)</label>
                        <input
                          type="text"
                          value={editingPlatform.icon_class}
                          onChange={(e) => setEditingPlatform({ ...editingPlatform, icon_class: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="fab fa-instagram"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Icon Gradient (Tailwind)</label>
                        <input
                          type="text"
                          value={editingPlatform.icon_gradient}
                          onChange={(e) => setEditingPlatform({ ...editingPlatform, icon_gradient: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="bg-gradient-to-r from-pink-500 to-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Follow Link URL</label>
                        <input
                          type="text"
                          value={editingPlatform.follow_link || ''}
                          onChange={(e) => setEditingPlatform({ ...editingPlatform, follow_link: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Follow Text</label>
                        <input
                          type="text"
                          value={editingPlatform.follow_text || ''}
                          onChange={(e) => setEditingPlatform({ ...editingPlatform, follow_text: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingPlatform.is_spotify}
                            onChange={(e) => setEditingPlatform({ ...editingPlatform, is_spotify: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Is Spotify (special handling)</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingPlatform.is_active}
                            onChange={(e) => setEditingPlatform({ ...editingPlatform, is_active: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updatePlatform(editingPlatform)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPlatform(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <i className={`${platform.icon_class} text-xl`}></i>
                          <h3 className="font-semibold text-gray-800">{platform.display_name}</h3>
                          {!platform.is_active && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {platform.follow_link ? `Link: ${platform.follow_link}` : 'No follow link'}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingPlatform(platform)}
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
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Posts</h2>
              <button
                onClick={addPost}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
              >
                Add Post
              </button>
            </div>

            <div className="space-y-4">
              {posts.map(post => {
                const platform = platforms.find(p => p.platform_key === post.platform_key);
                return (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {editingPost?.id === post.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Platform</label>
                          <select
                            value={editingPost.platform_key}
                            onChange={(e) => setEditingPost({ ...editingPost, platform_key: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          >
                            {platforms.filter(p => p.is_active).map(p => (
                              <option key={p.platform_key} value={p.platform_key}>{p.display_name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Post URL (Instagram/TikTok)</label>
                          <input
                            type="text"
                            value={editingPost.post_url || ''}
                            onChange={(e) => setEditingPost({ ...editingPost, post_url: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="https://www.instagram.com/p/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Embed URL (LinkedIn/Spotify)</label>
                          <input
                            type="text"
                            value={editingPost.embed_url || ''}
                            onChange={(e) => setEditingPost({ ...editingPost, embed_url: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="https://open.spotify.com/embed/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Title (Spotify only)</label>
                          <input
                            type="text"
                            value={editingPost.title || ''}
                            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Caption (Instagram/TikTok/LinkedIn)</label>
                          <textarea
                            value={editingPost.caption || ''}
                            onChange={(e) => setEditingPost({ ...editingPost, caption: e.target.value })}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                          <input
                            type="number"
                            value={editingPost.display_order}
                            onChange={(e) => setEditingPost({ ...editingPost, display_order: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingPost.is_active}
                              onChange={(e) => setEditingPost({ ...editingPost, is_active: e.target.checked })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updatePost(editingPost)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPost(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {platform && <i className={`${platform.icon_class} text-sm`}></i>}
                            <span className="text-xs text-gray-600">{post.platform_key}</span>
                            {!post.is_active && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Inactive</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-md">
                            {post.title || post.caption || post.post_url || post.embed_url || 'No content'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Order: {post.display_order}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingPost(post)}
                            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-600 hover:text-red-800 text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social-links' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Social Links (YouTube, Substack, etc.)</h2>
            
            <div className="space-y-4">
              {socialLinks.map(link => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {editingSocialLink?.id === link.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                        <input
                          type="text"
                          value={editingSocialLink.name}
                          onChange={(e) => setEditingSocialLink({ ...editingSocialLink, name: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">URL</label>
                        <input
                          type="text"
                          value={editingSocialLink.url}
                          onChange={(e) => setEditingSocialLink({ ...editingSocialLink, url: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={editingSocialLink.background_color || '#000000'}
                            onChange={(e) => setEditingSocialLink({ ...editingSocialLink, background_color: e.target.value })}
                            className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editingSocialLink.background_color || ''}
                            onChange={(e) => setEditingSocialLink({ ...editingSocialLink, background_color: e.target.value })}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                        <input
                          type="number"
                          value={editingSocialLink.display_order}
                          onChange={(e) => setEditingSocialLink({ ...editingSocialLink, display_order: parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingSocialLink.is_active}
                            onChange={(e) => setEditingSocialLink({ ...editingSocialLink, is_active: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateSocialLink(editingSocialLink)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSocialLink(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{link.name}</h3>
                        <p className="text-sm text-gray-600 truncate max-w-md">{link.url}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: link.background_color }}></div>
                          <span className="text-xs text-gray-500">Order: {link.display_order}</span>
                          {!link.is_active && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Inactive</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingSocialLink(link)}
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
        )}
      </div>
    </div>
  );
}