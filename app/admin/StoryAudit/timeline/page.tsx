'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { TimelineSettings, TimelineWeek } from '@/app/types/StoryAudit/Timeline';

export default function AdminTimelinePage() {
  const [settings, setSettings] = useState<Partial<TimelineSettings>>({});
  const [weeks, setWeeks] = useState<TimelineWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data: settingsData } = await supabase
      .from('audit_timeline_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    // Fetch timeline weeks
    const { data: weeksData } = await supabase
      .from('audit_timeline_weeks')
      .select('*')
      .order('display_order', { ascending: true });
    if (weeksData) setWeeks(weeksData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('audit_timeline_settings')
      .update({
        section_title: settings.section_title,
        italic_word: settings.italic_word,
        background_color: settings.background_color,
        text_color: settings.text_color,
        muted_text_color: settings.muted_text_color,
        accent_color: settings.accent_color,
        glow_intensity: settings.glow_intensity,
        circle_background_color: settings.circle_background_color,
        circle_text_color: settings.circle_text_color,
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

  const addWeek = async () => {
    const newOrder = weeks.length + 1;
    const newWeekNumber = weeks.length + 1;
    const { data, error } = await supabase
      .from('audit_timeline_weeks')
      .insert({ 
        week_number: newWeekNumber,
        title: 'New Week Title',
        description: 'Week description goes here...',
        display_order: newOrder
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding week');
    } else {
      setWeeks([...weeks, data]);
      setMessage('Week added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateWeek = async (id: number, field: keyof TimelineWeek, value: string | number) => {
    const updated = weeks.map(w => w.id === id ? { ...w, [field]: value } : w);
    setWeeks(updated);
    
    const { error } = await supabase
      .from('audit_timeline_weeks')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) setMessage('Error updating week');
  };

  const deleteWeek = async (id: number) => {
    if (!confirm('Delete this week?')) return;
    
    const { error } = await supabase
      .from('audit_timeline_weeks')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting week');
    } else {
      setWeeks(weeks.filter(w => w.id !== id));
      setMessage('Week deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveWeek = async (id: number, direction: 'up' | 'down') => {
    const index = weeks.findIndex(w => w.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === weeks.length - 1) return;
    
    const newWeeks = [...weeks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newWeeks[index].display_order;
    const swapOrder = newWeeks[swapIndex].display_order;
    const currentWeekNumber = newWeeks[index].week_number;
    const swapWeekNumber = newWeeks[swapIndex].week_number;
    
    // Swap display orders and week numbers
    newWeeks[index].display_order = swapOrder;
    newWeeks[index].week_number = swapWeekNumber;
    newWeeks[swapIndex].display_order = currentOrder;
    newWeeks[swapIndex].week_number = currentWeekNumber;
    
    newWeeks.sort((a, b) => a.display_order - b.display_order);
    setWeeks(newWeeks);
    
    // Update both weeks in database
    await supabase
      .from('audit_timeline_weeks')
      .update({ 
        display_order: swapOrder, 
        week_number: swapWeekNumber,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    await supabase
      .from('audit_timeline_weeks')
      .update({ 
        display_order: currentOrder, 
        week_number: currentWeekNumber,
        updated_at: new Date().toISOString() 
      })
      .eq('id', newWeeks[swapIndex].id);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  const accentColor = settings.accent_color || '#e9c08f';

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Timeline Section Admin</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['settings', 'weeks', 'preview'].map(tab => (
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
                      value={settings.section_title || 'How the two weeks run'}
                      onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Italic Word/Phrase</label>
                    <input
                      type="text"
                      value={settings.italic_word || 'two weeks'}
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Circle Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.circle_background_color || '#000000'}
                        onChange={(e) => setSettings({ ...settings, circle_background_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.circle_background_color || ''}
                        onChange={(e) => setSettings({ ...settings, circle_background_color: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Circle Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.circle_text_color || '#ffffff'}
                        onChange={(e) => setSettings({ ...settings, circle_text_color: e.target.value })}
                        className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.circle_text_color || ''}
                        onChange={(e) => setSettings({ ...settings, circle_text_color: e.target.value })}
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

        {/* Weeks Tab */}
        {activeTab === 'weeks' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Timeline Weeks</h2>
              <button onClick={addWeek} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Add Week
              </button>
            </div>
            
            <div className="space-y-6">
              {weeks.map((week, index) => (
                <div key={week.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Week {week.week_number}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Order: {week.display_order}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveWeek(week.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveWeek(week.id, 'down')}
                        disabled={index === weeks.length - 1}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 transition-colors"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteWeek(week.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Week Number */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Week Number</label>
                    <input
                      type="number"
                      value={week.week_number}
                      onChange={(e) => updateWeek(week.id, 'week_number', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                      min="1"
                    />
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                    <input
                      type="text"
                      value={week.title}
                      onChange={(e) => updateWeek(week.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                    <textarea
                      value={week.description}
                      onChange={(e) => updateWeek(week.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={week.display_order}
                      onChange={(e) => updateWeek(week.id, 'display_order', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {weeks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No timeline weeks yet. Click "Add Week" to get started.
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
            
            <div 
              className="rounded-lg p-8 relative overflow-hidden min-h-[400px]"
              style={{ backgroundColor: settings.background_color || '#fefdf8' }}
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute top-20 right-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 40).toString(16).padStart(2, '0')}` }}
                />
                <div 
                  className="absolute bottom-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{ backgroundColor: `${accentColor}${Math.floor(((settings.glow_intensity || 30) / 100) * 30).toString(16).padStart(2, '0')}` }}
                />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header Preview */}
                <div className="mb-8 text-center">
                  <h2 
                    className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
                    style={{ color: settings.text_color || '#000000' }}
                  >
                    {(settings.section_title || 'How the two weeks run').split(settings.italic_word || 'two weeks')[0]}
                    <span className="font-editorial italic">
                      {settings.italic_word || 'two weeks'}
                    </span>
                    {(settings.section_title || 'How the two weeks run').split(settings.italic_word || 'two weeks')[1]}
                  </h2>
                  <div 
                    className="w-16 h-px mx-auto mt-4"
                    style={{ backgroundColor: `${settings.text_color}20` }}
                  />
                </div>

                {/* Timeline Preview */}
                <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
                  {weeks.slice(0, 2).map((week) => (
                    <div key={week.id} className="flex-1 text-center">
                      <div 
                        className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-2xl md:text-3xl font-medium font-helvetica mx-auto mb-4 shadow-lg"
                        style={{
                          backgroundColor: settings.circle_background_color || '#000000',
                          color: settings.circle_text_color || '#ffffff'
                        }}
                      >
                        {week.week_number}
                      </div>
                      <h3 
                        className="text-lg md:text-xl font-semibold mb-2 font-helvetica"
                        style={{ color: settings.text_color || '#000000' }}
                      >
                        {week.title}
                      </h3>
                      <p 
                        className="text-sm md:text-base leading-relaxed font-helvetica"
                        style={{ color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)' }}
                      >
                        {week.description.length > 100 
                          ? week.description.substring(0, 100) + '...' 
                          : week.description}
                      </p>
                    </div>
                  ))}
                </div>

                {weeks.length === 0 && (
                  <div className="text-center py-8" style={{ color: settings.text_color || '#000000' }}>
                    Add timeline weeks to see preview
                  </div>
                )}

                {weeks.length > 2 && (
                  <div className="text-center mt-6">
                    <span className="text-xs" style={{ color: settings.muted_text_color }}>
                      + {weeks.length - 2} more weeks
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