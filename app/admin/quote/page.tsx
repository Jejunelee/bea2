'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { QuoteSettings, StyledWord } from '@/app/types/quote';

export default function AdminQuotePage() {
  const [settings, setSettings] = useState<Partial<QuoteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newStyledWord, setNewStyledWord] = useState({ word: '', style: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('quote_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('quote_settings')
      .update({
        quote_text: settings.quote_text,
        styled_words: settings.styled_words,
        background_gradient_start: settings.background_gradient_start,
        background_gradient_mid: settings.background_gradient_mid,
        background_gradient_end: settings.background_gradient_end,
        typing_speed: settings.typing_speed,
        text_color: settings.text_color,
        text_size_desktop: settings.text_size_desktop,
        text_size_mobile: settings.text_size_mobile,
        show_arrow_icon: settings.show_arrow_icon,
        arrow_icon_url: settings.arrow_icon_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) {
      setMessage('Error saving settings');
    } else {
      setMessage('Quote settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  const addStyledWord = () => {
    if (newStyledWord.word && newStyledWord.style) {
      const currentWords = settings.styled_words || [];
      setSettings({
        ...settings,
        styled_words: [...currentWords, newStyledWord]
      });
      setNewStyledWord({ word: '', style: '' });
    }
  };

  const removeStyledWord = (index: number) => {
    const currentWords = settings.styled_words || [];
    const newWords = currentWords.filter((_, i) => i !== index);
    setSettings({ ...settings, styled_words: newWords });
  };

  const updateStyledWord = (index: number, field: keyof StyledWord, value: string) => {
    const currentWords = settings.styled_words || [];
    const newWords = [...currentWords];
    newWords[index] = { ...newWords[index], [field]: value };
    setSettings({ ...settings, styled_words: newWords });
  };

  const handleArrowIconUpload = async (file: File) => {
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `quote-arrow-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading arrow icon');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    setSettings({ ...settings, arrow_icon_url: publicUrl });
    setMessage('Arrow icon uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    setUploading(false);
  };

  const renderPreview = () => {
    const quoteText = settings.quote_text || '';
    const styledWords = settings.styled_words || [];
    const lines = quoteText.split('\n');
    
    return lines.map((line, lineIndex) => {
      let result = [];
      let lastIndex = 0;
      
      for (const styled of styledWords) {
        const index = line.indexOf(styled.word, lastIndex);
        if (index !== -1) {
          if (index > lastIndex) {
            result.push(line.substring(lastIndex, index));
          }
          result.push(
            <span key={`${lineIndex}-${index}`} className={styled.style}>
              {styled.word}
            </span>
          );
          lastIndex = index + styled.word.length;
        }
      }
      
      if (lastIndex < line.length) {
        result.push(line.substring(lastIndex));
      }
      
      return (
        <React.Fragment key={lineIndex}>
          {result}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Quote Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Quote Text */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quote Text</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Quote Content</label>
            <textarea
              value={settings.quote_text || ''}
              onChange={(e) => setSettings({ ...settings, quote_text: e.target.value })}
              rows={8}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono text-sm"
              placeholder="Enter your quote here... Use Enter/Return for line breaks"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Make sure the words you want to style appear exactly as written here.<br/>
              <strong className="text-blue-600">Press Enter/Return to create line breaks</strong> - the typing animation will automatically move to the next line.
            </p>
          </div>
        </div>

        {/* Styled Words */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Styled Words</h2>
          <p className="text-sm text-gray-600 mb-4">
            Words or phrases that will receive special styling in the quote
          </p>

          <div className="space-y-4 mb-6">
            {settings.styled_words?.map((word, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={word.word}
                    onChange={(e) => updateStyledWord(index, 'word', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Word or phrase"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={word.style}
                    onChange={(e) => updateStyledWord(index, 'style', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="CSS classes (e.g., italic font-editorial)"
                  />
                </div>
                <button
                  onClick={() => removeStyledWord(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-2 text-gray-800">Add New Styled Word</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStyledWord.word}
                onChange={(e) => setNewStyledWord({ ...newStyledWord, word: e.target.value })}
                placeholder="Word/phrase"
                className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                type="text"
                value={newStyledWord.style}
                onChange={(e) => setNewStyledWord({ ...newStyledWord, style: e.target.value })}
                placeholder="CSS classes"
                className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={addStyledWord}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Appearance Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Background Gradient Colors</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="color"
                    value={settings.background_gradient_start || '#f3f1df'}
                    onChange={(e) => setSettings({ ...settings, background_gradient_start: e.target.value })}
                    className="w-full h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <p className="text-xs text-center mt-1 text-gray-600">Start</p>
                </div>
                <div>
                  <input
                    type="color"
                    value={settings.background_gradient_mid || '#e6e9b8'}
                    onChange={(e) => setSettings({ ...settings, background_gradient_mid: e.target.value })}
                    className="w-full h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <p className="text-xs text-center mt-1 text-gray-600">Middle</p>
                </div>
                <div>
                  <input
                    type="color"
                    value={settings.background_gradient_end || '#e9c08f'}
                    onChange={(e) => setSettings({ ...settings, background_gradient_end: e.target.value })}
                    className="w-full h-10 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <p className="text-xs text-center mt-1 text-gray-600">End</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.text_color || '#000000'}
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Text Size</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={settings.text_size_desktop || '32px'}
                    onChange={(e) => setSettings({ ...settings, text_size_desktop: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Desktop (e.g., 32px)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Desktop</p>
                </div>
                <div>
                  <input
                    type="text"
                    value={settings.text_size_mobile || '26px'}
                    onChange={(e) => setSettings({ ...settings, text_size_mobile: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Mobile (e.g., 26px)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mobile</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Typing Speed</label>
              <input
                type="range"
                min="10"
                max="200"
                value={settings.typing_speed || 50}
                onChange={(e) => setSettings({ ...settings, typing_speed: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fast (10ms)</span>
                <span>{settings.typing_speed || 50}ms</span>
                <span>Slow (200ms)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Icon Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Arrow Icon</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.show_arrow_icon || false}
                onChange={(e) => setSettings({ ...settings, show_arrow_icon: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Show arrow icon after typing completes</label>
            </div>

            {settings.show_arrow_icon && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Arrow Icon URL</label>
                  <input
                    type="text"
                    value={settings.arrow_icon_url || ''}
                    onChange={(e) => setSettings({ ...settings, arrow_icon_url: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                    placeholder="/Landing/Icons/Arrow-5.png"
                  />
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Or upload new icon</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleArrowIconUpload(e.target.files[0]);
                        }
                      }}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                  </div>

                  {settings.arrow_icon_url && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Preview:</p>
                      <img src={settings.arrow_icon_url} alt="Arrow" className="w-12 h-auto" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
          
          <div 
            className="p-8 rounded-lg border border-gray-200"
            style={{
              background: `radial-gradient(circle at center, ${settings.background_gradient_start || '#f3f1df'} 0%, ${settings.background_gradient_mid || '#e6e9b8'} 50%, ${settings.background_gradient_end || '#e9c08f'} 100%)`,
            }}
          >
            <p 
              className="text-center font-medium whitespace-pre-wrap"
              style={{ 
                color: settings.text_color || '#000000',
                fontSize: 'clamp(20px, 4vw, 32px)',
              }}
            >
              {renderPreview()}
            </p>
            
            {settings.show_arrow_icon && settings.arrow_icon_url && (
              <div className="mt-12 flex justify-center">
                <img 
                  src={settings.arrow_icon_url} 
                  alt="Arrow" 
                  className="w-16 h-auto animate-bounce"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold shadow-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}