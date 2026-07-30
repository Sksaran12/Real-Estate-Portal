import React, { useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const AIDescriptionGenerator = ({ propertyData, onGenerated }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!propertyData.title) {
      toast.error('Please enter at least a Property Title first');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/ai/generate-description', {
        title: propertyData.title,
        category: propertyData.category,
        propertyType: propertyData.propertyType,
        city: propertyData.city,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        areaSqFt: propertyData.areaSqFt,
        amenities: propertyData.amenities,
      });

      if (data.success && data.description) {
        onGenerated(data.description);
        toast.success('AI description generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 transition-all shadow-sm"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Generating AI Description...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <span>Auto-Generate Description with AI</span>
        </>
      )}
    </button>
  );
};

export default AIDescriptionGenerator;
