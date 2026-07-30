const Property = require('../models/Property');

// Helper: Call Gemini API if key exists, else generate smart context-aware response
const callGeminiOrFallback = async (prompt, systemInstruction) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\n${prompt}` }],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.error('Gemini API call failed, using fallback:', err.message);
    }
  }
  return null;
};

// @desc    Generate AI property description
// @route   POST /api/ai/generate-description
// @access  Private (Owner/Admin)
const generateDescription = async (req, res) => {
  try {
    const { title, category, propertyType, city, bedrooms, bathrooms, areaSqFt, amenities } = req.body;

    const prompt = `Title: ${title || 'Luxury Residence'}
Category: ${category || 'apartment'}
Type: For ${propertyType || 'sale'}
Location: ${city || 'Guwahati, Assam'}
Bedrooms: ${bedrooms || 2} BHK
Bathrooms: ${bathrooms || 2}
Area: ${areaSqFt || 1200} sq ft
Key Amenities: ${Array.isArray(amenities) ? amenities.join(', ') : amenities || 'Power Backup, Elevator, Parking, 24/7 Security'}`;

    const systemInstruction = `You are a professional real estate copywriter in India. Generate a compelling, high-converting 3-paragraph property description for an Indian real estate portal. Highlight key features, lifestyle benefits in Guwahati/Assam, and investment potential. Keep it clean and captivating.`;

    const aiGenerated = await callGeminiOrFallback(prompt, systemInstruction);

    if (aiGenerated) {
      return res.json({ success: true, description: aiGenerated });
    }

    // Fallback AI synthesis engine for Indian market
    const typeLabel = propertyType === 'rent' ? 'lease' : 'ownership';
    const amenityText = Array.isArray(amenities) && amenities.length > 0 ? amenities.join(', ') : '24/7 power backup, covered car parking, and round-the-clock security';

    const fallbackDescription = `Welcome to this exceptional ${bedrooms || 2}BHK ${category || 'apartment'} situated in the prime location of ${city || 'Guwahati, Assam'}. Spanning ${areaSqFt || 1200} sq ft of thoughtfully engineered living area, this property seamlessly balances contemporary aesthetics with everyday convenience.

Inside, enjoy well-ventilated rooms, ample natural sunlight, modular kitchen fittings, and premium flooring. Situated near major commercial hubs, reputed schools, and transport corridors, this residence offers optimal connectivity.

Key highlights include: ${amenityText}. Excellent choice for families seeking a dream home or investors looking for high rental yield for ${typeLabel} in Assam. Schedule your site visit today!`;

    res.json({
      success: true,
      description: fallbackDescription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Natural Language Property Search Assistant
// @route   POST /api/ai/chat
// @access  Public
const aiChatAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message prompt is required' });
    }

    const lowerMsg = message.toLowerCase();
    const dbQuery = { status: 'approved' };

    // Extract BHK / bedrooms
    const bhkMatch = lowerMsg.match(/(\d+)\s*(bhk|bed|bedroom)/i);
    if (bhkMatch) {
      dbQuery.bedrooms = Number(bhkMatch[1]);
    }

    // Extract property type
    if (lowerMsg.includes('rent') || lowerMsg.includes('lease')) {
      dbQuery.propertyType = 'rent';
    } else if (lowerMsg.includes('buy') || lowerMsg.includes('sale') || lowerMsg.includes('purchase')) {
      dbQuery.propertyType = 'sale';
    }

    // Extract price min/max in ₹
    const underMatch = lowerMsg.match(/(under|below|less than|max)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
    if (underMatch) {
      let val = Number(underMatch[2]);
      // Handle Lakhs / Cr verbal input (e.g. 50 lakhs -> 5000000)
      if (lowerMsg.includes('lakh') || lowerMsg.includes('lac')) val *= 100000;
      if (lowerMsg.includes('cr') || lowerMsg.includes('crore')) val *= 10000000;
      dbQuery.price = { $lte: val };
    }

    // Extract Category
    if (lowerMsg.includes('apartment') || lowerMsg.includes('flat')) dbQuery.category = 'apartment';
    if (lowerMsg.includes('house') || lowerMsg.includes('home') || lowerMsg.includes('bungalow')) dbQuery.category = 'house';
    if (lowerMsg.includes('villa')) dbQuery.category = 'villa';
    if (lowerMsg.includes('commercial') || lowerMsg.includes('office')) dbQuery.category = 'commercial';
    if (lowerMsg.includes('studio')) dbQuery.category = 'studio';

    // Extract Assam / Guwahati Localities & Cities
    const locations = [
      'guwahati', 'gs road', 'ganeshguri', 'beltola', 'dispur', 'zoo road',
      'christian basti', 'six mile', 'jalukbari', 'chandmari', 'vip road', 'assam',
      'kolkata', 'mumbai', 'delhi', 'bangalore'
    ];
    const matchedLoc = locations.find((l) => lowerMsg.includes(l));
    if (matchedLoc) {
      dbQuery['$or'] = [
        { 'location.city': { $regex: matchedLoc, $options: 'i' } },
        { 'location.address': { $regex: matchedLoc, $options: 'i' } },
        { title: { $regex: matchedLoc, $options: 'i' } },
      ];
    }

    // Find matching properties
    const matchingProperties = await Property.find(dbQuery)
      .populate('owner', 'name email phone avatar')
      .limit(4);

    let replyText = '';
    if (matchingProperties.length > 0) {
      replyText = `I found ${matchingProperties.length} verified listing${matchingProperties.length > 1 ? 's' : ''} matching your query "${message}":`;
    } else {
      const alternativeProperties = await Property.find({ status: 'approved' }).limit(3);
      replyText = `I couldn't find exact matches for "${message}", but here are top recommended property listings in Guwahati, Assam:`;
      return res.json({
        success: true,
        reply: replyText,
        properties: alternativeProperties,
      });
    }

    res.json({
      success: true,
      reply: replyText,
      properties: matchingProperties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateDescription,
  aiChatAssistant,
};
