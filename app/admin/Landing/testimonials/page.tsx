'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { TestimonialSliderSettings, TestimonialSlide } from '@/app/types/testimonial';
import Image from 'next/image';

export default function AdminTestimonialsPage() {
  const [settings, setSettings] = useState<Partial<TestimonialSliderSettings>>({});
  const [testimonials, setTestimonials] = useState<TestimonialSlide[]>([]);
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
      .from('testimonial_slider_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch testimonials
    const { data: testimonialsData } = await supabase
      .from('testimonial_slides')
      .select('*')
      .order('display_order', { ascending: true });
    if (testimonialsData) setTestimonials(testimonialsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('testimonial_slider_settings')
      .update({
        heading_text: settings.heading_text,
        heading_italic_word: settings.heading_italic_word,
        subheading_text: settings.subheading_text,
        background_color: settings.background_color,
        text_color: settings.text_color,
        card_background_color: settings.card_background_color,
        accent_color: settings.accent_color,
        animation_speed_multiplier: settings.animation_speed_multiplier,
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

  const addTestimonial = async () => {
    const newOrder = testimonials.length + 1;
    const { data, error } = await supabase
      .from('testimonial_slides')
      .insert({ 
        quote: 'New testimonial text...', 
        author: 'Author Name', 
        role: 'Position',
        company: 'Company Name',
        display_order: newOrder,
        image_name: 'default.jpg'
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding testimonial');
    } else {
      setTestimonials([...testimonials, data]);
      setMessage('Testimonial added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateTestimonial = async (id: number, field: keyof TestimonialSlide, value: string | number) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, [field]: value } : t);
    setTestimonials(updated);
    
    const { error } = await supabase
      .from('testimonial_slides')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating testimonial');
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    
    const { error } = await supabase
      .from('testimonial_slides')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting testimonial');
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id));
      setMessage('Testimonial deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImageUpload = async (slideId: number, file: File) => {
    setUploading(`slide-${slideId}`);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `testimonial-${slideId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('testimonial-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading image');
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('testimonial-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('testimonial_slides')
      .update({ 
        image_url: publicUrl, 
        image_name: file.name,
        updated_at: new Date().toISOString() 
      })
      .eq('id', slideId);

    if (updateError) {
      setMessage('Error saving image URL');
    } else {
      setTestimonials(testimonials.map(t => t.id === slideId ? { ...t, image_url: publicUrl, image_name: file.name } : t));
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploading(null);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Testimonial Slider Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'testimonials', 'preview'].map(tab => (
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Slider Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Heading Text</label>
                <input
                  type="text"
                  value={settings.heading_text || 'What clients say'}
                  onChange={(e) => setSettings({ ...settings, heading_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  placeholder="What clients say"
                />
                <p className="text-xs text-gray-500 mt-1">Use the italic word field below to specify which word gets italic styling</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word in Heading</label>
                <input
                  type="text"
                  value={settings.heading_italic_word || 'clients'}
                  onChange={(e) => setSettings({ ...settings, heading_italic_word: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  placeholder="clients"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Subheading Text</label>
                <input
                  type="text"
                  value={settings.subheading_text || 'Real stories from people Ive worked with'}
                  onChange={(e) => setSettings({ ...settings, subheading_text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.text_color || '#ffffff'}
                      onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                      className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.text_color || ''}
                      onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Card Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.card_background_color || '#ffffff'}
                      onChange={(e) => setSettings({ ...settings, card_background_color: e.target.value })}
                      className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.card_background_color || ''}
                      onChange={(e) => setSettings({ ...settings, card_background_color: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.accent_color || '#e9c08f'}
                      onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                      className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.accent_color || ''}
                      onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Animation Speed (seconds per full cycle)
                  <span className="text-xs text-gray-500 ml-2">Higher = slower</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={settings.animation_speed_multiplier || 20}
                  onChange={(e) => setSettings({ ...settings, animation_speed_multiplier: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Faster (10s)</span>
                  <span>Current: {settings.animation_speed_multiplier || 20}s</span>
                  <span>Slower (60s)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {testimonials.length} testimonials: ~{Math.max(20, testimonials.length * 6)}s total
                </p>
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

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Testimonials</h2>
              <button onClick={addTestimonial} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Testimonial
              </button>
            </div>
            
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Testimonial #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {testimonial.display_order}
                      </span>
                    </h3>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Quote */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Quote</label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Wrap words you want to emphasize with &lt;span class="font-editorial italic"&gt;word&lt;/span&gt;
                    </p>
                  </div>

                  {/* Author Info Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Author</label>
                      <input
                        type="text"
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                      <input
                        type="text"
                        value={testimonial.role || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Company</label>
                      <input
                        type="text"
                        value={testimonial.company || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Display Order */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={testimonial.display_order}
                      onChange={(e) => updateTestimonial(testimonial.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Profile Image</label>
                    {testimonial.image_url && (
                      <div className="mb-2">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                          <Image
                            src={testimonial.image_url}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{testimonial.image_name}</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(testimonial.id, e.target.files[0])}
                      disabled={uploading === `slide-${testimonial.id}`}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {uploading === `slide-${testimonial.id}` && (
                      <div className="mt-1 text-sm text-gray-500">Uploading...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No testimonials yet. Click "Add Testimonial" to get started.
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: settings.background_color || '#000000' }}
            >
              {/* Header Preview */}
              <div className="text-center mb-6">
                <h2 
                  className="text-2xl"
                  style={{ color: settings.text_color || '#ffffff' }}
                >
                  {(settings.heading_text || 'What clients say').split(settings.heading_italic_word || 'clients')[0]}
                  <span className="italic font-editorial">
                    {settings.heading_italic_word || 'clients'}
                  </span>
                  {(settings.heading_text || 'What clients say').split(settings.heading_italic_word || 'clients')[1]}
                </h2>
                <p 
                  className="mt-1"
                  style={{ color: settings.text_color || '#ffffff', opacity: 0.8 }}
                >
                  {settings.subheading_text || 'Real stories from people Ive worked with'}
                </p>
              </div>

              {/* Card Preview */}
              <div className="max-w-md mx-auto">
                {testimonials.slice(0, 1).map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="rounded-xl p-4 border shadow-sm"
                    style={{ 
                      backgroundColor: settings.card_background_color || '#ffffff',
                      borderColor: `${accentColor}40`
                    }}
                  >
                    <div className="flex justify-center mb-3">
                      <div 
                        className="relative w-16 h-16 rounded-full overflow-hidden"
                        style={{ boxShadow: `0 0 0 3px ${accentColor}20` }}
                      >
                        {testimonial.image_url ? (
                          <Image
                            src={testimonial.image_url}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: `${accentColor}20` }}
                          >
                            <span className="text-xs" style={{ color: accentColor }}>
                              No img
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className="text-2xl font-editorial italic mb-2"
                      style={{ color: `${accentColor}60` }}
                    >
                      "
                    </div>
                    
                    <p 
                      className="text-sm text-gray-700 leading-relaxed mb-3"
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {testimonial.quote.length > 150 
                        ? testimonial.quote.substring(0, 150) + '...' 
                        : testimonial.quote}
                    </p>
                    
                    <div 
                      className="pt-2"
                      style={{ borderTop: `1px solid ${accentColor}30` }}
                    >
                      <p className="text-sm font-medium text-gray-900 text-center">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-gray-500 text-center">
                        {testimonial.role}{testimonial.role && testimonial.company && " · "}{testimonial.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {testimonials.length === 0 && (
                <div className="text-center py-8" style={{ color: settings.text_color || '#ffffff' }}>
                  Add testimonials to see preview
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}