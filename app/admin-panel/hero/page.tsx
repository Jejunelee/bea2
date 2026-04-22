'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { HeroContent } from '@/app/types/hero';

export default function AdminHeroPage() {
  const [content, setContent] = useState<Partial<HeroContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
    fetchImages();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase
      .from('hero_content')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) setContent(data);
    setLoading(false);
  };

  const fetchImages = async () => {
    const { data } = await supabase
      .from('hero_images')
      .select('*');
    
    if (data) {
      const imagesMap = data.reduce((acc, img) => {
        acc[img.image_key] = img.image_url;
        return acc;
      }, {} as Record<string, string>);
      setContent(prev => ({ ...prev, ...imagesMap }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('hero_content')
      .update({
        typed_text: content.typed_text,
        subheading_text: content.subheading_text,
        description_text: content.description_text,
        button1_text: content.button1_text,
        button2_text: content.button2_text,
        footer_text: content.footer_text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) {
      setMessage('Error saving content');
    } else {
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  const handleImageUpload = async (imageKey: string, file: File) => {
    setUploading(imageKey);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${imageKey}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage(`Error uploading ${imageKey}`);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('hero_images')
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('image_key', imageKey);

    if (dbError) {
      setMessage(`Error saving ${imageKey} URL`);
    } else {
      setContent(prev => ({ ...prev, [imageKey]: publicUrl }));
      setMessage(`${imageKey} uploaded successfully!`);
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploading(null);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Hero Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Text Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Typed Text</label>
              <input
                type="text"
                value={content.typed_text || ''}
                onChange={(e) => setContent({ ...content, typed_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Subheading Text</label>
              <input
                type="text"
                value={content.subheading_text || ''}
                onChange={(e) => setContent({ ...content, subheading_text: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                value={content.description_text || ''}
                onChange={(e) => setContent({ ...content, description_text: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Button 1 Text</label>
                <input
                  type="text"
                  value={content.button1_text || ''}
                  onChange={(e) => setContent({ ...content, button1_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Button 2 Text</label>
                <input
                  type="text"
                  value={content.button2_text || ''}
                  onChange={(e) => setContent({ ...content, button2_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Footer Text (supports HTML)</label>
              <textarea
                value={content.footer_text || ''}
                onChange={(e) => setContent({ ...content, footer_text: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Content'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Images</h2>
          
          <div className="space-y-6">
            {['left_polaroid', 'right_polaroid', 'sharpest_image'].map((imageKey) => (
              <div key={imageKey} className="border-b border-gray-100 pb-4 last:border-0">
                <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
                  {imageKey.replace('_', ' ')} Image
                </label>
                
                {content[imageKey as keyof typeof content] && (
                  <div className="mb-3">
                    <img 
                      src={content[imageKey as keyof typeof content] as string} 
                      alt={imageKey}
                      className="w-32 h-32 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(imageKey, e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  disabled={uploading === imageKey}
                />
                
                {uploading === imageKey && (
                  <div className="mt-2 text-sm text-gray-500">Uploading...</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}