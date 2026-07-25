/**
 * Abbreviates a number with SI-like suffixes (k, m, b, t).
 * @param {number} num - The number to format.
 * @param {number} [decimals=1] - Number of decimal places to show (default 1).
 * @returns {string} Formatted string (e.g., 25000 → "25k", 15300 → "15.3k").
 */
function abbreviateNumber(num, decimals = 1) {
  // Handle negative numbers and zero
  if (num === 0) return '0';
  if (num < 0) return '-' + abbreviateNumber(Math.abs(num), decimals);

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'QN', 'S', 'SP'];
  const threshold = 1000;

  // Determine which suffix to use
  let index = 0;
  while (num >= threshold && index < suffixes.length - 1) {
    num /= threshold;
    index++;
  }

  // Round to the given decimal places and format
  const rounded = Number(num.toFixed(decimals));
  // Avoid showing '.0' if decimals=1 and value is integer
  const formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(decimals);

  return formatted + suffixes[index];
}

// Examples:
console.log(abbreviateNumber(25000000000000000000));
