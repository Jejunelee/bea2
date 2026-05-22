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

  // Determine button visibility and preview
  const showButton1 = content.button1_text && content.button1_text.trim() !== '';
  const showButton2 = content.button2_text && content.button2_text.trim() !== '';
  const buttonsCount = (showButton1 ? 1 : 0) + (showButton2 ? 1 : 0);

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

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Buttons Configuration</label>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Current configuration:</strong> {buttonsCount === 0 ? 'No buttons' : buttonsCount === 1 ? 'Single button' : 'Two buttons'}
                </p>
                <p className="text-xs text-gray-500">
                  {buttonsCount === 0 && "⚠️ No buttons will be shown. Add text to at least one button below."}
                  {buttonsCount === 1 && "✓ Single button will appear larger and centered."}
                  {buttonsCount === 2 && "✓ Two buttons will appear side by side at normal size."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Button 1 Text</label>
                <input
                  type="text"
                  value={content.button1_text || ''}
                  onChange={(e) => setContent({ ...content, button1_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Leave empty to hide this button"
                />
                <p className="text-xs text-gray-500 mt-1">Button 1 - Yellow color</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Button 2 Text</label>
                <input
                  type="text"
                  value={content.button2_text || ''}
                  onChange={(e) => setContent({ ...content, button2_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Leave empty to hide this button"
                />
                <p className="text-xs text-gray-500 mt-1">Button 2 - Green color</p>
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

        {/* Live Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
          <div className="bg-gray-50 p-6 rounded">
            <div className="text-center">
              <div className={`mt-5 sm:mt-6 md:mt-8 flex justify-center items-center ${
                buttonsCount === 1 ? 'w-full' : 'flex-col sm:flex-row gap-2 sm:gap-4 md:gap-5'
              }`}>
                {buttonsCount === 1 && showButton1 && (
                  <button className="font-helvetica border-2 px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full bg-yellow-400 font-medium shadow-md text-base sm:text-lg md:text-xl text-black w-full sm:w-auto min-w-[200px] sm:min-w-[250px] cursor-default">
                    {content.button1_text}
                  </button>
                )}
                
                {buttonsCount === 1 && showButton2 && (
                  <button className="font-helvetica border-2 px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full bg-green-200 font-medium shadow-md text-base sm:text-lg md:text-xl text-black w-full sm:w-auto min-w-[200px] sm:min-w-[250px] cursor-default">
                    {content.button2_text}
                  </button>
                )}

                {buttonsCount === 2 && (
                  <>
                    <button className="font-helvetica border-2 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full bg-yellow-400 font-medium shadow-md text-sm sm:text-base text-black w-full sm:w-auto cursor-default">
                      {content.button1_text}
                    </button>
                    <button className="font-helvetica border-2 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full bg-green-200 font-medium shadow-md text-sm sm:text-base text-black w-full sm:w-auto cursor-default">
                      {content.button2_text}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Preview shows how buttons will appear. Single buttons are larger and centered.
          </p>
        </div>
      </div>
    </div>
  );
}