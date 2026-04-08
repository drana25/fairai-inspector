import Papa from 'papaparse';

/**
 * Analyze a CSV dataset for bias across protected columns.
 *
 * @param {string} csvText - Raw CSV text content
 * @param {string[]} protectedColumns - Column names to check for bias (e.g. ["gender", "race"])
 * @param {string} targetColumn - The outcome column (e.g. "hired", "approved")
 * @returns {{ fairnessScore: number, rowCount: number, columns: Object }}
 */
export function analyzeBias(csvText, protectedColumns, targetColumn) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const rows = parsed.data;
  const rowCount = rows.length;

  // Normalize column names for matching
  const normalizedProtected = protectedColumns.map((c) => c.trim().toLowerCase());
  const normalizedTarget = targetColumn.trim().toLowerCase();

  // Determine positive outcome values
  const positiveValues = new Set(['1', 'true', 'yes', 'hired', 'approved', 'accepted', 'pass', 'granted']);

  const columnsResult = {};
  let failCount = 0;
  let warningCount = 0;

  for (const col of normalizedProtected) {
    // Group rows by the protected column value
    const groups = {};

    for (const row of rows) {
      const groupValue = (row[col] || 'unknown').toString().trim();
      const targetValue = (row[normalizedTarget] || '').toString().trim().toLowerCase();
      const isPositive = positiveValues.has(targetValue);

      if (!groups[groupValue]) {
        groups[groupValue] = { total: 0, positive: 0 };
      }
      groups[groupValue].total++;
      if (isPositive) {
        groups[groupValue].positive++;
      }
    }

    // Calculate rates per group
    const groupStats = Object.entries(groups)
      .map(([name, data]) => ({
        name,
        total: data.total,
        positive: data.positive,
        rate: data.total > 0 ? data.positive / data.total : 0,
      }))
      .sort((a, b) => b.total - a.total); // Sort by count, majority first

    if (groupStats.length < 2) {
      // Need at least 2 groups to compare
      columnsResult[col] = {
        groups: groupStats,
        majorityGroup: groupStats[0]?.name || 'N/A',
        minorityGroup: 'N/A',
        majorityRate: groupStats[0]?.rate || 0,
        minorityRate: 0,
        dir: 1,
        spd: 0,
        verdict: 'PASS',
        message: 'Only one group found—no comparison possible.',
      };
      continue;
    }

    // Majority = highest rate, Minority = lowest rate
    const sortedByRate = [...groupStats].sort((a, b) => b.rate - a.rate);
    const majority = sortedByRate[0];
    const minority = sortedByRate[sortedByRate.length - 1];

    const dir = majority.rate > 0 ? minority.rate / majority.rate : 1;
    const spd = minority.rate - majority.rate;

    let verdict;
    if (dir >= 0.9) verdict = 'PASS';
    else if (dir >= 0.8) verdict = 'WARNING';
    else verdict = 'FAIL';

    if (verdict === 'FAIL') failCount++;
    if (verdict === 'WARNING') warningCount++;

    columnsResult[col] = {
      groups: groupStats,
      majorityGroup: majority.name,
      minorityGroup: minority.name,
      majorityRate: majority.rate,
      minorityRate: minority.rate,
      dir,
      spd,
      verdict,
    };
  }

  const fairnessScore = Math.max(0, 100 - failCount * 20 - warningCount * 8);

  return {
    fairnessScore,
    rowCount,
    columns: columnsResult,
  };
}

/**
 * Auto-detect which columns might be protected attributes and which is the target.
 */
export function detectColumns(csvText) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    preview: 20,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const headers = parsed.meta.fields || [];
  const rows = parsed.data;

  const protectedKeywords = ['gender', 'sex', 'race', 'ethnicity', 'age', 'age_group', 'disability', 'religion', 'nationality', 'marital'];
  const targetKeywords = ['hired', 'approved', 'accepted', 'outcome', 'result', 'target', 'label', 'decision', 'status', 'selected', 'pass', 'granted'];

  const protectedColumns = headers.filter((h) =>
    protectedKeywords.some((kw) => h.includes(kw))
  );

  let targetColumn = headers.find((h) =>
    targetKeywords.some((kw) => h.includes(kw))
  );

  // If no target found, look for binary columns
  if (!targetColumn) {
    for (const h of headers) {
      if (protectedColumns.includes(h)) continue;
      const values = new Set(rows.map((r) => (r[h] || '').toString().trim().toLowerCase()));
      if (values.size <= 3) {
        targetColumn = h;
        break;
      }
    }
  }

  return {
    headers,
    protectedColumns,
    targetColumn: targetColumn || headers[headers.length - 1],
    sampleRows: rows.slice(0, 5),
  };
}
