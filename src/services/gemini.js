const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Get a plain-English explanation from Gemini for a bias finding.
 * Falls back to a local explanation if the API fails.
 */
export async function getExplanation(columnName, metrics) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // If no API key, use local fallback immediately
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    return generateLocalExplanation(columnName, metrics);
  }

  const prompt = buildPrompt(columnName, metrics);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.4,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned ${response.status}, using local fallback`);
      return generateLocalExplanation(columnName, metrics);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn('Gemini returned no text, using local fallback');
      return generateLocalExplanation(columnName, metrics);
    }

    return text.trim();
  } catch (error) {
    console.warn('Gemini API call failed, using local fallback:', error.message);
    return generateLocalExplanation(columnName, metrics);
  }
}

function buildPrompt(columnName, metrics) {
  return `You are a fairness auditor explaining bias analysis results to a non-technical HR manager.

Column analysed: ${columnName}
Majority group (${metrics.majorityGroup}): ${(metrics.majorityRate * 100).toFixed(1)}% positive outcome rate
Minority group (${metrics.minorityGroup}): ${(metrics.minorityRate * 100).toFixed(1)}% positive outcome rate
Disparate Impact Ratio: ${metrics.dir.toFixed(3)} (legal threshold is 0.8)
Verdict: ${metrics.verdict}

Write exactly 3 short sentences:
1. What this finding means in plain English (no jargon)
2. Why this likely happened in the training data
3. One specific action the team can take today to begin fixing it

Tone: empathetic, specific, actionable. Maximum 80 words total.
Do not use legal language. Do not make definitive legal claims.
Always say "may indicate" or "suggests" rather than "proves".`;
}

/**
 * Generate explanation locally without API call.
 * Never throws — always returns a string.
 */
export function generateLocalExplanation(columnName, metrics) {
  const { minorityGroup, majorityGroup, minorityRate, majorityRate, dir, verdict } = metrics;
  const diff = Math.round((majorityRate - minorityRate) * 100);

  if (verdict === 'FAIL') {
    return `${minorityGroup} individuals have a ${diff}% lower positive outcome rate than ${majorityGroup} individuals in the "${columnName}" category (DIR: ${dir.toFixed(2)}), falling below the legal 0.8 threshold. This may reflect historical bias in how training data was collected. Recommended action: audit training data for underrepresentation and review whether selection criteria are genuinely role-relevant.`;
  }

  if (verdict === 'WARNING') {
    return `There is a ${diff}% gap between ${majorityGroup} and ${minorityGroup} groups in "${columnName}" (DIR: ${dir.toFixed(2)}), which is close to the 0.8 concern threshold. This suggests a potential pattern worth monitoring. Consider reviewing recent selection decisions for this group and tracking this metric over the next quarter.`;
  }

  return `The "${columnName}" category shows similar outcome rates across ${majorityGroup} and ${minorityGroup} groups (DIR: ${dir.toFixed(2)}), meeting fairness standards. Continue monitoring to maintain this balance. No immediate action required, but periodic review is recommended.`;
}
