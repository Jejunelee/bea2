'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { WorkedWithSettings, WorkedWithBrand } from '@/app/types/brandworkedwith';

export default function AdminWorkedWithPage() {
  const [settings, setSettings] = useState<Partial<WorkedWithSettings>>({});
  const [brands, setBrands] = useState<WorkedWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingBrand, setEditingBrand] = useState<WorkedWithBrand | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: settingsData } = await supabase
      .from('worked_with_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (settingsData) setSettings(settingsData);

    const { data: brandsData } = await supabase
      .from('worked_with_brands')
      .select('*')
      .order('display_order', { ascending: true });
    if (brandsData) setBrands(brandsData);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('worked_with_settings')
      .update({
        background_color: settings.background_color,
        text_color: settings.text_color,
        heading_prefix: settings.heading_prefix,
        heading_brands_italic: settings.heading_brands_italic,
        heading_people_italic: settings.heading_people_italic,
        heading_suffix: settings.heading_suffix,
        divider_color: settings.divider_color,
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

  const addBrand = async () => {
    const newOrder = brands.length + 1;
    const { data, error } = await supabase
      .from('worked_with_brands')
      .insert({
        display_order: newOrder,
        name: 'New Brand',
        logo_url: '',
        website_url: ''
      })
      .select()
      .single();

    if (error) {
      setMessage('Error adding brand');
    } else {
      setBrands([...brands, data]);
      setMessage('Brand added!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateBrand = async (brand: WorkedWithBrand) => {
    const { error } = await supabase
      .from('worked_with_brands')
      .update({
        name: brand.name,
        website_url: brand.website_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', brand.id);

    if (error) {
      setMessage('Error updating brand');
    } else {
      setBrands(brands.map(b => b.id === brand.id ? brand : b));
      setEditingBrand(null);
      setMessage('Brand updated!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteBrand = async (id: number) => {
    if (!confirm('Delete this brand?')) return;
    
    const { error } = await supabase
      .from('worked_with_brands')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting brand');
    } else {
      setBrands(brands.filter(brand => brand.id !== id));
      setMessage('Brand deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const moveBrand = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === brands.length - 1) return;

    const newBrands = [...brands];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newBrands[index], newBrands[targetIndex]] = [newBrands[targetIndex], newBrands[index]];
    
    const updatedBrands = newBrands.map((brand, idx) => ({
      ...brand,
      display_order: idx + 1
    }));

    for (const brand of updatedBrands) {
      await supabase
        .from('worked_with_brands')
        .update({ display_order: brand.display_order })
        .eq('id', brand.id);
    }

    setBrands(updatedBrands);
    setMessage('Order updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogoUpload = async (brandId: number, file: File) => {
    setUploadingLogo(brandId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${brandId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('brand-logos')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error uploading logo');
      setUploadingLogo(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('brand-logos')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('worked_with_brands')
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', brandId);

    if (updateError) {
      setMessage('Error saving logo URL');
    } else {
      setBrands(brands.map(brand => brand.id === brandId ? { ...brand, logo_url: publicUrl } : brand));
      setMessage('Logo uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setUploadingLogo(null);
  };

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Worked With Section Admin</h1>
        
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

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Divider Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.divider_color || '#404040'}
                  onChange={(e) => setSettings({ ...settings, divider_color: e.target.value })}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.divider_color || ''}
                  onChange={(e) => setSettings({ ...settings, divider_color: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Heading Prefix</label>
                <input
                  type="text"
                  value={settings.heading_prefix || ''}
                  onChange={(e) => setSettings({ ...settings, heading_prefix: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Brands Italic Word</label>
                <input
                  type="text"
                  value={settings.heading_brands_italic || ''}
                  onChange={(e) => setSettings({ ...settings, heading_brands_italic: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">People Italic Word</label>
                <input
                  type="text"
                  value={settings.heading_people_italic || ''}
                  onChange={(e) => setSettings({ ...settings, heading_people_italic: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Heading Suffix</label>
                <input
                  type="text"
                  value={settings.heading_suffix || ''}
                  onChange={(e) => setSettings({ ...settings, heading_suffix: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
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

        {/* Brands */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Brands & Clients</h2>
            <button
              onClick={addBrand}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Add Brand
            </button>
          </div>

          <div className="space-y-4">
            {brands.map((brand, index) => (
              <div key={brand.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveBrand(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveBrand(index, 'down')}
                      disabled={index === brands.length - 1}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => deleteBrand(brand.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {editingBrand?.id === brand.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Brand Name</label>
                      <input
                        type="text"
                        value={editingBrand.name}
                        onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Website URL (optional)</label>
                      <input
                        type="text"
                        value={editingBrand.website_url}
                        onChange={(e) => setEditingBrand({ ...editingBrand, website_url: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Logo</label>
                      {editingBrand.logo_url && (
                        <div className="mb-2">
                          <img src={editingBrand.logo_url} alt={editingBrand.name} className="w-24 h-24 object-contain border border-gray-200 rounded bg-white p-2" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={editingBrand.logo_url}
                        onChange={(e) => setEditingBrand({ ...editingBrand, logo_url: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                        placeholder="Logo URL"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(editingBrand.id, e.target.files[0])}
                        disabled={uploadingLogo === editingBrand.id}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                      {uploadingLogo === editingBrand.id && (
                        <div className="mt-1 text-sm text-gray-500">Uploading...</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBrand(editingBrand)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBrand(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {brand.logo_url && (
                      <div className="w-16 h-16 bg-white border border-gray-200 rounded flex items-center justify-center p-2">
                        <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{brand.name}</h3>
                      {brand.website_url && (
                        <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {brand.website_url}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingBrand(brand)}
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
      </div>
    </div>
  );
}