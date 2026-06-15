// backend/utils/faqHelpers.js
const FAQ = require('../models/FAQ');

async function findSimilarFAQs(question, limit = 5) {
  const trimmed = (question || '').trim();
  if (!trimmed) return [];

  try {
    // Let the Database handle the math! This uses 0% of your Node.js CPU.
    const results = await FAQ.find(
      { 
        $text: { $search: trimmed },
        $or: [{ isApproved: true }, { status: 'approved' }]
      },
      { score: { $meta: 'textScore' } } // Let Mongo calculate the relevance score
    )
      .sort({ score: { $meta: 'textScore' } }) // Sort by best match
      .limit(limit)
      .lean();
      
    return results;
  } catch (err) {
    // Fallback if the text index isn't built yet
    return [];
  }
}

async function searchApprovedFAQs(query, limit = 5) {
  const trimmed = (query || '').trim();
  if (!trimmed) return [];

  try {
    const textResults = await FAQ.find(
      { $text: { $search: trimmed }, isApproved: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();
    if (textResults.length > 0) return textResults;
  } catch (_) {
     /* Handle missing text index silently */
  }

  // Fallback to regex (less efficient, but works if indexes are building)
  const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return FAQ.find({
    isApproved: true,
    $or: [{ question: regex }, { answer: regex }]
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

module.exports = { findSimilarFAQs, searchApprovedFAQs };