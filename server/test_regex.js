const lowerMsg = "show me properties above 50 lakhs";

// A. Improved Price Parsing using Regex (Supports k, m, lakh, cr and above/below)
const priceMatch = lowerMsg.match(/(under|below|max|budget|above|over|min|minimum)\s?(?:rs\.?|₹)?\s?(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|m|lakh|lakhs|lac|lacs|cr|crore|crores)?/i);

if (priceMatch) {
    const operator = priceMatch[1].toLowerCase();
    let priceStr = priceMatch[2].replace(/,/g, '');
    let price = parseFloat(priceStr);
    const unit = priceMatch[3] ? priceMatch[3].toLowerCase() : '';

    console.log("Match found!");
    console.log("Operator:", operator);
    console.log("PriceStr:", priceStr);
    console.log("Unit:", unit);

    if (unit === 'k') price *= 1000;
    else if (unit === 'm') price *= 1000000;
    else if (unit.includes('lakh') || unit.includes('lac')) price *= 100000;
    else if (unit.includes('cr') || unit.includes('crore')) price *= 10000000;

    console.log("Final Price:", price);
} else {
    console.log("No match found.");
}
