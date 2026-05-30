'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { CaseStudySettings, CaseStudy } from '@/app/types/FractionalCommunication/CaseStudies';

export default function AdminFractionalCaseStudiesPage() {
  const [settings, setSettings] = useState<Partial<CaseStudySettings>>({});
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [emphasisWord, setEmphasisWord] = useState('');
  const [editingTitle, setEditingTitle] = useState<string>('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('fractional_casestudy_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch case studies
    const { data: caseStudiesData } = await supabase
      .from('fractional_case_studies')
      .select('*')
      .order('display_order', { ascending: true });
    if (caseStudiesData) setCaseStudies(caseStudiesData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('fractional_casestudy_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        category_color: settings.category_color,
        border_color: settings.border_color,
        title_emphasis_words: settings.title_emphasis_words,
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

  const addCaseStudy = async () => {
    const newOrder = caseStudies.length + 1;
    const { data, error } = await supabase
      .from('fractional_case_studies')
      .insert({ 
        title: 'New Case Study',
        description: 'Description of the case study goes here...',
        category: 'Category',
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding case study');
    } else {
      setCaseStudies([...caseStudies, data]);
      setMessage('Case study added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateCaseStudy = async (id: number, field: keyof CaseStudy, value: string | number) => {
    const updated = caseStudies.map(c => c.id === id ? { ...c, [field]: value } : c);
    setCaseStudies(updated);
    
    const { error } = await supabase
      .from('fractional_case_studies')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating case study');
  };

  const deleteCaseStudy = async (id: number) => {
    if (!confirm('Delete this case study?')) return;
    
    const { error } = await supabase
      .from('fractional_case_studies')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting case study');
    } else {
      setCaseStudies(caseStudies.filter(c => c.id !== id));
      setMessage('Case study deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveCaseStudy = async (id: number, direction: 'up' | 'down') => {
    const index = caseStudies.findIndex(c => c.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === caseStudies.length - 1) return;
    
    const newCaseStudies = [...caseStudies];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newCaseStudies[index].display_order;
    const swapOrder = newCaseStudies[swapIndex].display_order;
    
    newCaseStudies[index].display_order = swapOrder;
    newCaseStudies[swapIndex].display_order = currentOrder;
    
    newCaseStudies.sort((a, b) => a.display_order - b.display_order);
    setCaseStudies(newCaseStudies);
    
    await supabase
      .from('fractional_case_studies')
      .update({ display_order: swapOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await supabase
      .from('fractional_case_studies')
      .update({ display_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', newCaseStudies[swapIndex].id);
  };

  const updateTitleEmphasisWord = (title: string, emphasisWord: string) => {
    const currentWords = settings.title_emphasis_words || {};
    const newWords = { ...currentWords };
    
    if (emphasisWord.trim()) {
      newWords[title] = emphasisWord.trim();
    } else {
      delete newWords[title];
    }
    
    setSettings({ ...settings, title_emphasis_words: newWords });
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = settings.glow_intensity || 30;

  // Helper to render preview title with emphasis
  const renderPreviewTitle = (title: string) => {
    const emphasisWords = settings.title_emphasis_words || {};
    const emphasisWord = emphasisWords[title];
    
    if (emphasisWord && title.includes(emphasisWord)) {
      const parts = title.split(emphasisWord);
      return (
        <>
          {parts[0]}
          <span className="font-editorial italic" style={{ color: settings.text_color || '#000000' }}>
            {emphasisWord}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Case Studies Admin (Fractional)</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'case-studies', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'case-studies' ? 'Case Studies' : tab}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Section Settings</h2>
            
            <div className="space-y-6">
              {/* Title Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Title Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Section Title</label>
                    <input
                      type="text"
                      value={settings.section_title || 'Case studies'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'studies'}
                      onChange={(e) => setSettings({ ...settings, italic_word: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Color Settings */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Color Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.background_color || '#fefdf8'}
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
                        value={settings.text_color || '#000000'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Muted Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.muted_text_color || '#00000099'}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.muted_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, muted_text_color: e.target.value })}
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

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Category Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.category_color || '#0000004D'}
                        onChange={(e) => setSettings({ ...settings, category_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.category_color || ''}
                        onChange={(e) => setSettings({ ...settings, category_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Border Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.border_color || '#00000033'}
                        onChange={(e) => setSettings({ ...settings, border_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.border_color || ''}
                        onChange={(e) => setSettings({ ...settings, border_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Glow Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={settings.glow_intensity || 30}
                      onChange={(e) => setSettings({ ...settings, glow_intensity: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-center mt-1">{settings.glow_intensity || 30}%</div>
                  </div>
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

        {/* Case Studies Tab */}
        {activeTab === 'case-studies' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Case Studies</h2>
              <button onClick={addCaseStudy} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Case Study
              </button>
            </div>
            
            <div className="space-y-6">
              {caseStudies.map((study, index) => (
                <div key={study.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Case Study #{index + 1}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {study.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveCaseStudy(study.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveCaseStudy(study.id, 'down')}
                        disabled={index === caseStudies.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteCaseStudy(study.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                    <input
                      type="text"
                      value={study.title}
                      onChange={(e) => updateCaseStudy(study.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Title Emphasis Word */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Emphasis Word/Phrase for This Title</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={(settings.title_emphasis_words || {})[study.title] || ''}
                        onChange={(e) => {
                          const newWords = { ...(settings.title_emphasis_words || {}) };
                          if (e.target.value.trim()) {
                            newWords[study.title] = e.target.value.trim();
                          } else {
                            delete newWords[study.title];
                          }
                          setSettings({ ...settings, title_emphasis_words: newWords });
                        }}
                        placeholder="e.g., CCA Manila, anana, HUNGRY"
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This word/phrase will be italicized in the title. Leave empty to not italicize anything.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                    <textarea
                      value={study.description}
                      onChange={(e) => updateCaseStudy(study.id, 'description', e.target.value)}
                      rows={5}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Category */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                    <input
                      type="text"
                      value={study.category}
                      onChange={(e) => updateCaseStudy(study.id, 'category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                      placeholder="e.g., Culinary education, Food media, Travel and hospitality"
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={study.display_order}
                      onChange={(e) => updateCaseStudy(study.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {caseStudies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No case studies yet. Click "Add Case Study" to get started.
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[450px]"
              style={{ backgroundColor: settings.background_color || '#fefdf8' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor((glowIntensity / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'Case studies').split(settings.italic_word || 'studies')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'studies'}
                    </span>
                    {(settings.section_title || 'Case studies').split(settings.italic_word || 'studies')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Case Studies Preview */}
                <div className="grid md:grid-cols-2 gap-8">
                  {caseStudies.slice(0, 4).map((study) => (
                    <div key={study.id}>
                      <div className="border-l-2 pl-6" style={{ borderColor: settings.border_color || '#00000033' }}>
                        <h3 
                          className="text-xl md:text-2xl font-semibold mb-3 font-helvetica"
                          style={{ color: settings.text_color || '#000000' }}
                        >
                          {renderPreviewTitle(study.title)}
                        </h3>
                        <p 
                          className="text-base md:text-lg leading-relaxed font-helvetica mb-3"
                          style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)' }}
                        >
                          {study.description.length > 200 
                            ? study.description.substring(0, 200) + '...' 
                            : study.description}
                        </p>
                        <span 
                          className="text-sm uppercase tracking-wider font-helvetica"
                          style={{ color: settings.category_color || 'rgba(0, 0, 0, 0.3)' }}
                        >
                          {study.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {caseStudies.length === 0 && (
                  <div className="text-center py-8" style={{ color: settings.text_color || '#000000' }}>
                    Add case studies to see preview
                  </div>
                )}

                {caseStudies.length > 4 && (
                  <div className="text-center mt-6">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {caseStudies.length - 4} more case studies
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}