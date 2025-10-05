
// use this command in the command line to concatenate all valid json's into one:
// jq -s '.' $(for f in *.json; do jq empty "$f" 2>/dev/null && echo "$f"; done) > combined.json

// Imports
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';

// Extracting Grants
const grantsData = await fs.readFile('./funding_database/combined.json', 'utf-8');
const grants = JSON.parse(grantsData);


// Raw AI Search
/*


// Loading Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractFundingAmount(summary) {
  // List of common patterns
  const patterns = [
    // Danish/European: 150.000 DKK, €4.000.000
    /(?:€|DKK|kr\.?)\s?[\d.]+\.000/gi,
    /[\d.]+\.000\s?(?:€|DKK|kr\.?)/gi,
    
    // US/UK: $150,000, €4,000,000
    /(?:€|DKK|kr\.?|\$|USD|EUR)\s?[\d,]+/gi,
    /[\d,]+\s?(?:€|DKK|kr\.?|\$|USD|EUR)/gi,
    
    // With million/billion: €4 million, 150 thousand DKK
    /[\d.,]+\s?(?:million|billion|thousand|mio|mia|tusind)\s?(?:€|DKK|kr\.?|USD|EUR)?/gi,
    /(?:€|DKK|kr\.?|USD|EUR)\s?[\d.,]+\s?(?:million|billion|thousand|mio|mia|tusind)/gi,
    
    // Text format: "up to €4 million", "grants of 150.000 DKK"
    /up to\s+(?:€|DKK|kr\.?|\$)?\s?[\d.,]+(?:\s?(?:million|billion|thousand|mio|mia))?/gi,
    /grants? of\s+(?:€|DKK|kr\.?|\$)?\s?[\d.,]+/gi
  ];
  
  // Try each pattern
  for (const pattern of patterns) {
    const match = summary.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  
  return 'Not specified';
}

function safeJoin(arr, separator = ', ') {
  if (!arr) return 'Not specified';
  if (Array.isArray(arr)) return arr.join(separator);
  return String(arr);
}

async function rankGrants(userAnswers, grants) {
  const prompt = `You are a grant matcher for startups.
  Here is the startup information:
  1. Industries: ${userAnswers.industries}
  2. Team Members in University: ${userAnswers.uniAffiliations}
  3. Revenue: ${userAnswers.revenue}
  4. Investment Received: ${userAnswers.investment}
  5. Is Incorporated: ${userAnswers.incorporated}
  6. Company Age: ${userAnswers.companyAge}

  AVAILABLE GRANTS:
  ${grants.map((grant, idx) => `
  Grant ${idx + 1}: ${grant.fund_name || 'Unnamed Grant'}
  Host: ${grant.host || 'Not specified'}
  Summary: ${grant.summary || 'No summary available'}
  Eligible Applicants: ${safeJoin(grant.eligible_applicants)}
  Activity Types: ${safeJoin(grant.activity_types)}
  Application Deadline: ${grant.deadlines?.[0]?.application_deadline || 'Rolling'}
  Funding Amount: ${extractFundingAmount(grant.summary || '')}
  `).join('\n---\n')}

  TASK:
  Analyze each grant carefully against the user's profile. Consider:
  - Whether the user's organization type matches eligible applicants
  - Whether their industry/activities align with the grant's focus areas
  - Whether they meet any stated requirements (company age, revenue, etc.)
  - The funding amount relative to their needs
  - Deadline urgency

  Rank these grants from best to worst match. Return ONLY a valid JSON array (no markdown formatting):
  [
    {
      "grant_index": 0,
      "fund_name": "...",
      "match_score": 85
    }
  ]

  Sort by match_score (0-100) descending.`;

  // THIS WAS MISSING - Make the API call
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  // THIS WAS MISSING - Parse the response
  const responseText = message.content[0].text;
  
  let jsonText = responseText;
  if (responseText.includes('```')) {
    jsonText = responseText.match(/```(?:json)?\n?([\s\S]*?)```/)?.[1] || responseText;
  }
  if (responseText.match(/\[[\s\S]*\]/)) {
    jsonText = responseText.match(/\[[\s\S]*\]/)[0];
  }
  
  const rankings = JSON.parse(jsonText);
  
  // THIS WAS MISSING - Return the merged results
  return rankings.map(ranking => ({
    ...grants[ranking.grant_index],
    match_score: ranking.match_score
  }));
}

const user_answers = {
  industries: "Climate tech",
  uniAffiliations: "One founder at DTU",
  revenue: "500,000 DKK",
  investment: "250,000 DKK",
  companyAge: "1.5 years",
  incorporated: "Yes"
};

console.log('AI Ranking...\n');

const ranked_grants = await rankGrants(user_answers, grants);


ranked_grants.forEach((grant, idx) => {
  console.log(`\n${idx + 1}. ${grant.fund_name} (Score: ${grant.match_score}/100)`);
  console.log(`   Host: ${grant.host}`);
  console.log(`   Link: ${grant.url}`);
});
*/







// Jaccard Search Method


const stopwords = new Set([
  // English
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do', 'does',
  'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'might', 'more', 'most', 'must', 'my', 'myself', 'no', 'nor',
  'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 's', 'same', 'she', 'should', 'so', 'some',
  'such', 't', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your',
  'yours', 'yourself', 'yourselves',
  
  // Danish
  'af', 'alle', 'alt', 'anden', 'andet', 'andre', 'at', 'blev', 'blive', 'bliver',
  'da', 'de', 'dem', 'den', 'denne', 'der', 'deres', 'det', 'dette', 'dig', 'din',
  'dine', 'disse', 'dit', 'dog', 'du', 'efter', 'ej', 'eller', 'en', 'end', 'er',
  'et', 'far', 'fik', 'få', 'får', 'for', 'fra', 'ham', 'han', 'hans', 'har',
  'havde', 'have', 'hej', 'helt', 'hende', 'hendes', 'her', 'hos', 'hun', 'hvad',
  'hvem', 'hver', 'hvilken', 'hvis', 'hvor', 'hvordan', 'hvorfor', 'hvornår', 'i',
  'ikke', 'ind', 'ingen', 'intet', 'ja', 'jeg', 'jer', 'jeres', 'jo', 'kan', 'kom',
  'komme', 'kommer', 'kun', 'kunne', 'lav', 'lidt', 'lige', 'lille', 'man', 'mand',
  'mange', 'med', 'meget', 'men', 'mens', 'mere', 'mig', 'min', 'mine', 'mit',
  'mod', 'må', 'ned', 'nej', 'nogen', 'noget', 'nogle', 'nu', 'når', 'nær', 'næste',
  'næsten', 'og', 'også', 'om', 'op', 'os', 'over', 'på', 'selv', 'sig', 'sin',
  'sine', 'sit', 'skal', 'skulle', 'som', 'stor', 'store', 'så', 'sådan', 'thi',
  'til', 'tit', 'under', 'var', 'ved', 'vi', 'vil', 'ville', 'vor', 'vores', 'være',
  'været',

  // English Grant Specific Keywords
  'fund','grant', 'project',
  

  // Danish Grant Specific Keywords
  'fond','leget',


]);


function extractKeywordsWithFrequency(grant) {
  const allText = [
    grant.fund_name || '',
    grant.summary || '',
    grant.host || '',
    ...(grant.eligible_applicants || []),
    ...(grant.activity_types || []),
    ...(grant.reporting_requirements || [])
  ].join(' ');
  
  const words = allText
    .toLowerCase()
    .match(/\b[a-zæøå]+\b/gi) || [];
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    if (word.length > 2 && !stopwords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top keywords
  const sortedKeywords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
  
  return sortedKeywords;
}


// Usage

const grantsWithKeywords = grants.map(grant => ({
  ...grant,
  keywords: extractKeywordsWithFrequency(grant)
}));

// Save back to file
await fs.writeFile(
  './funding_database/grants_with_keywords.json',
  JSON.stringify(grantsWithKeywords, null, 2)
);



// Split all the strings for each grant into words

// filter out all "normal" words, convert all to lowercase

// Perform Jaccard Simmilarity between catagories (lowercased) and grant strings

