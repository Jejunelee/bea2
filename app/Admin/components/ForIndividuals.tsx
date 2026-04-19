// ForIndividuals.tsx
import React, { useState } from 'react';

interface ForIndividualsData {
  // Header
  headerTitle: string;
  headerSecondaryHeader: string;
  
  // Section 1
  section1Header: string;
  section1Title: string;
  section1Description: string;
  section1BulletPoints: string;
  section1ButtonText: string;
  
  // Section 2
  section2Header: string;
  section2Title: string;
  section2Description: string;
  section2BulletPoints: string;
  section2ButtonText: string;
  spotifyLinks: string[];
  
  // Section 3
  section3Header: string;
  section3Title: string;
  section3Description: string;
  section3BulletPoints: string;
  section3ButtonText: string;
}

interface ForIndividualsProps {
  onChange?: (data: ForIndividualsData) => void;
  initialData?: Partial<ForIndividualsData>;
}

const ForIndividuals: React.FC<ForIndividualsProps> = ({ onChange, initialData = {} }) => {
  const [formData, setFormData] = useState<ForIndividualsData>({
    headerTitle: initialData.headerTitle || '',
    headerSecondaryHeader: initialData.headerSecondaryHeader || '',
    section1Header: initialData.section1Header || '',
    section1Title: initialData.section1Title || '',
    section1Description: initialData.section1Description || '',
    section1BulletPoints: initialData.section1BulletPoints || '',
    section1ButtonText: initialData.section1ButtonText || '',
    section2Header: initialData.section2Header || '',
    section2Title: initialData.section2Title || '',
    section2Description: initialData.section2Description || '',
    section2BulletPoints: initialData.section2BulletPoints || '',
    section2ButtonText: initialData.section2ButtonText || '',
    spotifyLinks: initialData.spotifyLinks || ['', '', ''],
    section3Header: initialData.section3Header || '',
    section3Title: initialData.section3Title || '',
    section3Description: initialData.section3Description || '',
    section3BulletPoints: initialData.section3BulletPoints || '',
    section3ButtonText: initialData.section3ButtonText || '',
  });

  const handleChange = (field: keyof ForIndividualsData, value: string | string[]) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleSpotifyLinkChange = (index: number, value: string) => {
    const updatedLinks = [...formData.spotifyLinks];
    updatedLinks[index] = value;
    handleChange('spotifyLinks', updatedLinks);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">For Individuals Page Editor</h2>
      
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
        <div className="space-y-4">
          <InputField 
            label="Header" 
            value={formData.section1Header}
            onChange={(e) => handleChange('section1Header', e.target.value)}
            placeholder="Enter section header"
          />
          <InputField 
            label="Title" 
            value={formData.section1Title}
            onChange={(e) => handleChange('section1Title', e.target.value)}
            placeholder="Enter title"
          />
          <InputField 
            label="Description" 
            value={formData.section1Description}
            onChange={(e) => handleChange('section1Description', e.target.value)}
            textarea
            rows={3}
            placeholder="Enter description"
          />
          <InputField 
            label="Bullet Points (one per line)" 
            value={formData.section1BulletPoints}
            onChange={(e) => handleChange('section1BulletPoints', e.target.value)}
            textarea
            rows={4}
            placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
          />
          <InputField 
            label="Button Text" 
            value={formData.section1ButtonText}
            onChange={(e) => handleChange('section1ButtonText', e.target.value)}
            placeholder="Enter button text (e.g., Learn More)"
          />
        </div>
      </Section>

      {/* Section 2 */}
      <Section title="c. Section 2">
        <div className="space-y-4">
          <InputField 
            label="Header" 
            value={formData.section2Header}
            onChange={(e) => handleChange('section2Header', e.target.value)}
            placeholder="Enter section header"
          />
          <InputField 
            label="Title" 
            value={formData.section2Title}
            onChange={(e) => handleChange('section2Title', e.target.value)}
            placeholder="Enter title"
          />
          <InputField 
            label="Description" 
            value={formData.section2Description}
            onChange={(e) => handleChange('section2Description', e.target.value)}
            textarea
            rows={3}
            placeholder="Enter description"
          />
          <InputField 
            label="Bullet Points (one per line)" 
            value={formData.section2BulletPoints}
            onChange={(e) => handleChange('section2BulletPoints', e.target.value)}
            textarea
            rows={4}
            placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
          />
          <InputField 
            label="Button Text" 
            value={formData.section2ButtonText}
            onChange={(e) => handleChange('section2ButtonText', e.target.value)}
            placeholder="Enter button text (e.g., Listen Now)"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spotify Links (Maximum 3)
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  type="url"
                  value={formData.spotifyLinks[index] || ''}
                  onChange={(e) => handleSpotifyLinkChange(index, e.target.value)}
                  placeholder={`Spotify Link ${index + 1} (e.g., https://open.spotify.com/...)`}
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter up to 3 Spotify playlist or track URLs</p>
          </div>
        </div>
      </Section>

      {/* Section 3 */}
      <Section title="d. Section 3">
        <div className="space-y-4">
          <InputField 
            label="Header" 
            value={formData.section3Header}
            onChange={(e) => handleChange('section3Header', e.target.value)}
            placeholder="Enter section header"
          />
          <InputField 
            label="Title" 
            value={formData.section3Title}
            onChange={(e) => handleChange('section3Title', e.target.value)}
            placeholder="Enter title"
          />
          <InputField 
            label="Description" 
            value={formData.section3Description}
            onChange={(e) => handleChange('section3Description', e.target.value)}
            textarea
            rows={3}
            placeholder="Enter description"
          />
          <InputField 
            label="Bullet Points (one per line)" 
            value={formData.section3BulletPoints}
            onChange={(e) => handleChange('section3BulletPoints', e.target.value)}
            textarea
            rows={4}
            placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
          />
          <InputField 
            label="Button Text" 
            value={formData.section3ButtonText}
            onChange={(e) => handleChange('section3ButtonText', e.target.value)}
            placeholder="Enter button text (e.g., Contact Me)"
          />
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

export default ForIndividuals;