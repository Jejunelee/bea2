// Landing.tsx (renamed from Hero.tsx)
import React, { useState } from 'react';

interface LandingData {
  // Hero Section
  picture1: string;
  picture2: string;
  title: string;
  secondaryHeader: string;
  description: string;
  countries: string;
  
  // Ticker
  tickers: string;
  
  // Section 1
  section1Title: string;
  section1SecondaryHeader: string;
  box1Image: string;
  box1Text: string;
  box2Image: string;
  box2Text: string;
  box3Image: string;
  box3Text: string;
  box4Image: string;
  box4Text: string;
  
  // Section 2 (Quote)
  quoteText: string;
  
  // Section 3 (About Me)
  aboutTitle: string;
  aboutCountries: string;
  aboutDescription: string;
  aboutImages: string[];
  
  // Section 4 (Statistics)
  stat1Number: number;
  stat1Text: string;
  stat2Number: number;
  stat2Text: string;
  stat3Number: number;
  stat3Text: string;
  stat4Number: number;
  stat4Text: string;
  
  // Section 5 (Latest Drops)
  drop1Image: string;
  drop2Image: string;
  drop3Image: string;
  
  // Section 6 (Opinions)
  opinion1Title: string;
  opinion1Subheader: string;
  opinion1Description: string;
  opinion2Title: string;
  opinion2Subheader: string;
  opinion2Description: string;
  opinion3Title: string;
  opinion3Subheader: string;
  opinion3Description: string;
  
  // Section 7 (Starting Point)
  startingPointTitle: string;
  
  // Section 8 (Brands & Individuals)
  brandTitle: string;
  brandDescription: string;
  brandBulletpoints: string;
  individualTitle: string;
  individualDescription: string;
  individualBulletpoints: string;
}

interface LandingProps {
  onChange?: (data: LandingData) => void;
  initialData?: Partial<LandingData>;
}

const Landing: React.FC<LandingProps> = ({ onChange, initialData = {} }) => {
  const [formData, setFormData] = useState<LandingData>({
    picture1: initialData.picture1 || '',
    picture2: initialData.picture2 || '',
    title: initialData.title || '',
    secondaryHeader: initialData.secondaryHeader || '',
    description: initialData.description || '',
    countries: initialData.countries || '',
    tickers: initialData.tickers || '',
    section1Title: initialData.section1Title || '',
    section1SecondaryHeader: initialData.section1SecondaryHeader || '',
    box1Image: initialData.box1Image || '',
    box1Text: initialData.box1Text || '',
    box2Image: initialData.box2Image || '',
    box2Text: initialData.box2Text || '',
    box3Image: initialData.box3Image || '',
    box3Text: initialData.box3Text || '',
    box4Image: initialData.box4Image || '',
    box4Text: initialData.box4Text || '',
    quoteText: initialData.quoteText || '',
    aboutTitle: initialData.aboutTitle || '',
    aboutCountries: initialData.aboutCountries || '',
    aboutDescription: initialData.aboutDescription || '',
    aboutImages: initialData.aboutImages || [],
    stat1Number: initialData.stat1Number || 0,
    stat1Text: initialData.stat1Text || '',
    stat2Number: initialData.stat2Number || 0,
    stat2Text: initialData.stat2Text || '',
    stat3Number: initialData.stat3Number || 0,
    stat3Text: initialData.stat3Text || '',
    stat4Number: initialData.stat4Number || 0,
    stat4Text: initialData.stat4Text || '',
    drop1Image: initialData.drop1Image || '',
    drop2Image: initialData.drop2Image || '',
    drop3Image: initialData.drop3Image || '',
    opinion1Title: initialData.opinion1Title || '',
    opinion1Subheader: initialData.opinion1Subheader || '',
    opinion1Description: initialData.opinion1Description || '',
    opinion2Title: initialData.opinion2Title || '',
    opinion2Subheader: initialData.opinion2Subheader || '',
    opinion2Description: initialData.opinion2Description || '',
    opinion3Title: initialData.opinion3Title || '',
    opinion3Subheader: initialData.opinion3Subheader || '',
    opinion3Description: initialData.opinion3Description || '',
    startingPointTitle: initialData.startingPointTitle || '',
    brandTitle: initialData.brandTitle || '',
    brandDescription: initialData.brandDescription || '',
    brandBulletpoints: initialData.brandBulletpoints || '',
    individualTitle: initialData.individualTitle || '',
    individualDescription: initialData.individualDescription || '',
    individualBulletpoints: initialData.individualBulletpoints || '',
  });

  const handleChange = (field: keyof LandingData, value: string | number | string[]) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleImageUpload = (field: keyof LandingData, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImagesUpload = (files: FileList) => {
    const newImages: string[] = [];
    const filesArray = Array.from(files);
    const limitedFiles = filesArray.slice(0, 6 - formData.aboutImages.length);
    
    limitedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === limitedFiles.length) {
          const updatedImages = [...formData.aboutImages, ...newImages].slice(0, 6);
          handleChange('aboutImages', updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAboutImage = (index: number) => {
    const updatedImages = formData.aboutImages.filter((_, i) => i !== index);
    handleChange('aboutImages', updatedImages);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Landing Page Editor</h2>
      
      {/* Hero Section */}
      <Section title="a. Hero Section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload 
            label="Picture 1" 
            image={formData.picture1}
            onUpload={(file) => handleImageUpload('picture1', file)}
          />
          <ImageUpload 
            label="Picture 2" 
            image={formData.picture2}
            onUpload={(file) => handleImageUpload('picture2', file)}
          />
          <InputField 
            label="Title" 
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <InputField 
            label="Secondary Header" 
            value={formData.secondaryHeader}
            onChange={(e) => handleChange('secondaryHeader', e.target.value)}
          />
          <InputField 
            label="Description" 
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            textarea
          />
          <InputField 
            label="Countries" 
            value={formData.countries}
            onChange={(e) => handleChange('countries', e.target.value)}
          />
        </div>
      </Section>

      {/* Ticker Section */}
      <Section title="b. Ticker">
        <InputField 
          label="Tickers (comma separated)" 
          value={formData.tickers}
          onChange={(e) => handleChange('tickers', e.target.value)}
          placeholder="e.g., Breaking News, Latest Updates, Special Offer"
        />
      </Section>

      {/* Section 1 */}
      <Section title="c. Section 1">
        <div className="space-y-4">
          <InputField 
            label="Title" 
            value={formData.section1Title}
            onChange={(e) => handleChange('section1Title', e.target.value)}
          />
          <InputField 
            label="Secondary Header" 
            value={formData.section1SecondaryHeader}
            onChange={(e) => handleChange('section1SecondaryHeader', e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Box {num}</h4>
                <ImageUpload 
                  label={`Box ${num} Image`}
                  image={formData[`box${num}Image` as keyof LandingData] as string}
                  onUpload={(file) => handleImageUpload(`box${num}Image` as keyof LandingData, file)}
                />
                <InputField 
                  label={`Box ${num} Text`}
                  value={formData[`box${num}Text` as keyof LandingData] as string}
                  onChange={(e) => handleChange(`box${num}Text` as keyof LandingData, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 2 - Quote */}
      <Section title="d. Section 2 (The Quote)">
        <InputField 
          label="Quote Text" 
          value={formData.quoteText}
          onChange={(e) => handleChange('quoteText', e.target.value)}
          textarea
          rows={3}
        />
      </Section>

      {/* Section 3 - About Me */}
      <Section title="e. Section 3 (About Me)">
        <div className="space-y-4">
          <InputField 
            label="Title" 
            value={formData.aboutTitle}
            onChange={(e) => handleChange('aboutTitle', e.target.value)}
          />
          <InputField 
            label="Countries" 
            value={formData.aboutCountries}
            onChange={(e) => handleChange('aboutCountries', e.target.value)}
          />
          <InputField 
            label="Description" 
            value={formData.aboutDescription}
            onChange={(e) => handleChange('aboutDescription', e.target.value)}
            textarea
            rows={4}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Maximum 6)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.aboutImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`About ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => removeAboutImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.aboutImages.length < 6 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer h-24 hover:border-blue-400 transition-colors">
                  <span className="text-2xl text-gray-600">+</span>
                  <span className="text-xs text-gray-600">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleMultipleImagesUpload(e.target.files)}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">{formData.aboutImages.length}/6 images uploaded</p>
          </div>
        </div>
      </Section>

      {/* Section 4 - Statistics */}
      <Section title="f. Section 4 (Statistics)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Statistic {num}</h4>
              <InputField 
                label="Number" 
                type="number"
                value={formData[`stat${num}Number` as keyof LandingData] as number}
                onChange={(e) => handleChange(`stat${num}Number` as keyof LandingData, Number(e.target.value))}
              />
              <InputField 
                label="Text" 
                value={formData[`stat${num}Text` as keyof LandingData] as string}
                onChange={(e) => handleChange(`stat${num}Text` as keyof LandingData, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Section 5 - Latest Drops */}
      <Section title="g. Section 5 (Latest Drops)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <ImageUpload 
              key={num}
              label={`Box ${num}`}
              image={formData[`drop${num}Image` as keyof LandingData] as string}
              onUpload={(file) => handleImageUpload(`drop${num}Image` as keyof LandingData, file)}
            />
          ))}
        </div>
      </Section>

      {/* Section 6 - Opinions */}
      <Section title="h. Section 6 (Opinions)">
        <div className="space-y-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Opinion {num}</h4>
              <InputField 
                label="Title" 
                value={formData[`opinion${num}Title` as keyof LandingData] as string}
                onChange={(e) => handleChange(`opinion${num}Title` as keyof LandingData, e.target.value)}
              />
              <InputField 
                label="Subheader" 
                value={formData[`opinion${num}Subheader` as keyof LandingData] as string}
                onChange={(e) => handleChange(`opinion${num}Subheader` as keyof LandingData, e.target.value)}
              />
              <InputField 
                label="Description" 
                value={formData[`opinion${num}Description` as keyof LandingData] as string}
                onChange={(e) => handleChange(`opinion${num}Description` as keyof LandingData, e.target.value)}
                textarea
                rows={2}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7 - Starting Point */}
      <Section title="i. Section 7 (Starting Point)">
        <InputField 
          label="Title" 
          value={formData.startingPointTitle}
          onChange={(e) => handleChange('startingPointTitle', e.target.value)}
        />
      </Section>

      {/* Section 8 - Brands & Individuals */}
      <Section title="j. Section 8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 text-lg">Card for Brands</h4>
            <InputField 
              label="Title" 
              value={formData.brandTitle}
              onChange={(e) => handleChange('brandTitle', e.target.value)}
            />
            <InputField 
              label="Description" 
              value={formData.brandDescription}
              onChange={(e) => handleChange('brandDescription', e.target.value)}
              textarea
              rows={2}
            />
            <InputField 
              label="Bulletpoints (one per line)" 
              value={formData.brandBulletpoints}
              onChange={(e) => handleChange('brandBulletpoints', e.target.value)}
              textarea
              rows={3}
              placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
            />
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 text-lg">Card for Individuals</h4>
            <InputField 
              label="Title" 
              value={formData.individualTitle}
              onChange={(e) => handleChange('individualTitle', e.target.value)}
            />
            <InputField 
              label="Description" 
              value={formData.individualDescription}
              onChange={(e) => handleChange('individualDescription', e.target.value)}
              textarea
              rows={2}
            />
            <InputField 
              label="Bulletpoints (one per line)" 
              value={formData.individualBulletpoints}
              onChange={(e) => handleChange('individualBulletpoints', e.target.value)}
              textarea
              rows={3}
              placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

// Helper Components with improved contrast
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
    <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h3>
    {children}
  </div>
);

const InputField: React.FC<{
  label: string;
  value: string | number;
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

const ImageUpload: React.FC<{
  label: string;
  image: string;
  onUpload: (file: File) => void;
}> = ({ label, image, onUpload }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {image && (
      <div className="mb-2">
        <img src={image} alt={label} className="w-full h-32 object-cover rounded-lg" />
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files && onUpload(e.target.files[0])}
      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
    />
  </div>
);

export default Landing;