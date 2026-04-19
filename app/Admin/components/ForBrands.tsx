// ForBrands.tsx
import React, { useState } from 'react';

interface ForBrandsData {
  // Header
  headerTitle: string;
  headerSecondaryHeader: string;
  
  // Section 1
  section1Title: string;
  brandCardTitle: string;
  brandCardDescription: string;
  brandCardBulletpoints: string;
  individualCardTitle: string;
  individualCardDescription: string;
  individualCardBulletpoints: string;
  
  // Section 2 (Brands I've Worked With)
  section2Title: string;
  brandImages: string[];
}

interface ForBrandsProps {
  onChange?: (data: ForBrandsData) => void;
  initialData?: Partial<ForBrandsData>;
}

const ForBrands: React.FC<ForBrandsProps> = ({ onChange, initialData = {} }) => {
  const [formData, setFormData] = useState<ForBrandsData>({
    headerTitle: initialData.headerTitle || '',
    headerSecondaryHeader: initialData.headerSecondaryHeader || '',
    section1Title: initialData.section1Title || '',
    brandCardTitle: initialData.brandCardTitle || '',
    brandCardDescription: initialData.brandCardDescription || '',
    brandCardBulletpoints: initialData.brandCardBulletpoints || '',
    individualCardTitle: initialData.individualCardTitle || '',
    individualCardDescription: initialData.individualCardDescription || '',
    individualCardBulletpoints: initialData.individualCardBulletpoints || '',
    section2Title: initialData.section2Title || '',
    brandImages: initialData.brandImages || [],
  });

  const handleChange = (field: keyof ForBrandsData, value: string | string[]) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedImages = [...formData.brandImages, reader.result as string].slice(0, 6);
      handleChange('brandImages', updatedImages);
    };
    reader.readAsDataURL(file);
  };

  const removeBrandImage = (index: number) => {
    const updatedImages = formData.brandImages.filter((_, i) => i !== index);
    handleChange('brandImages', updatedImages);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">For Brands Page Editor</h2>
      
      {/* Header Section */}
      <Section title="a. Header">
        <div className="grid grid-cols-1 gap-4">
          <InputField 
            label="Title" 
            value={formData.headerTitle}
            onChange={(e) => handleChange('headerTitle', e.target.value)}
            placeholder="Enter header title"
          />
          <InputField 
            label="Secondary Header" 
            value={formData.headerSecondaryHeader}
            onChange={(e) => handleChange('headerSecondaryHeader', e.target.value)}
            placeholder="Enter secondary header"
          />
        </div>
      </Section>

      {/* Section 1 */}
      <Section title="b. Section 1">
        <div className="space-y-6">
          <InputField 
            label="Section Title" 
            value={formData.section1Title}
            onChange={(e) => handleChange('section1Title', e.target.value)}
            placeholder="Enter section title"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card for Brands */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 text-lg">Card for Brands</h4>
              <InputField 
                label="Title" 
                value={formData.brandCardTitle}
                onChange={(e) => handleChange('brandCardTitle', e.target.value)}
                placeholder="Card title"
              />
              <InputField 
                label="Description" 
                value={formData.brandCardDescription}
                onChange={(e) => handleChange('brandCardDescription', e.target.value)}
                textarea
                rows={3}
                placeholder="Enter description"
              />
              <InputField 
                label="Bulletpoints (one per line)" 
                value={formData.brandCardBulletpoints}
                onChange={(e) => handleChange('brandCardBulletpoints', e.target.value)}
                textarea
                rows={4}
                placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
              />
            </div>

            {/* Card for Individuals */}
            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 text-lg">Card for Individuals</h4>
              <InputField 
                label="Title" 
                value={formData.individualCardTitle}
                onChange={(e) => handleChange('individualCardTitle', e.target.value)}
                placeholder="Card title"
              />
              <InputField 
                label="Description" 
                value={formData.individualCardDescription}
                onChange={(e) => handleChange('individualCardDescription', e.target.value)}
                textarea
                rows={3}
                placeholder="Enter description"
              />
              <InputField 
                label="Bulletpoints (one per line)" 
                value={formData.individualCardBulletpoints}
                onChange={(e) => handleChange('individualCardBulletpoints', e.target.value)}
                textarea
                rows={4}
                placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2 - Brands I've Worked With */}
      <Section title="c. Section 2 (Brands I've Worked With)">
        <div className="space-y-4">
          <InputField 
            label="Title" 
            value={formData.section2Title}
            onChange={(e) => handleChange('section2Title', e.target.value)}
            placeholder="Enter section title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Images (Maximum 6)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.brandImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`Brand ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => removeBrandImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.brandImages.length < 6 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer h-24 hover:border-blue-400 transition-colors">
                  <span className="text-2xl text-gray-600">+</span>
                  <span className="text-xs text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">{formData.brandImages.length}/6 images uploaded</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

// Helper Components
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
    <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h3>
    {children}
  </div>
);

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', textarea = false, rows = 1, placeholder }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    )}
  </div>
);

export default ForBrands;