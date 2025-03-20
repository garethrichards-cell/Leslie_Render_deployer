require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { TwitterApi } = require('twitter-api-v2');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'leslie.log' })
  ]
});

// Load Leslie's character configuration
const leslieCharacter = require('./leslie_character.json');

// Twitter API client - with better error handling
let twitterClient;
try {
  // Log the credentials (partially) for debugging
  console.log("Twitter API Key (first 4 chars):", process.env.TWITTER_API_KEY ? process.env.TWITTER_API_KEY.substring(0, 4) + "..." : "undefined");
  console.log("Twitter API Key Secret (first 4 chars):", process.env.TWITTER_API_KEY_SECRET ? process.env.TWITTER_API_KEY_SECRET.substring(0, 4) + "..." : "undefined");
  console.log("Twitter Access Token (first 4 chars):", process.env.TWITTER_ACCESS_TOKEN ? process.env.TWITTER_ACCESS_TOKEN.substring(0, 4) + "..." : "undefined");
  console.log("Twitter Access Token Secret (first 4 chars):", process.env.TWITTER_ACCESS_TOKEN_SECRET ? process.env.TWITTER_ACCESS_TOKEN_SECRET.substring(0, 4) + "..." : "undefined");
  
  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  
  logger.info("Twitter client initialized successfully");
} catch (error) {
  logger.error(`Error initializing Twitter client: ${error.message}`);
  // Create a dummy client that logs instead of posting
  twitterClient = {
    v2: {
      tweet: (content) => {
        logger.info(`[DUMMY] Would tweet: ${content}`);
        return { data: { id: "dummy-id", text: content } };
      },
      reply: (content, replyToId) => {
        logger.info(`[DUMMY] Would reply to ${replyToId}: ${content}`);
        return { data: { id: "dummy-id", text: content } };
      },
      userMentionTimeline: () => {
        logger.info(`[DUMMY] Would check mentions`);
        return { data: { data: [] } };
      },
      me: () => {
        logger.info(`[DUMMY] Would get user profile`);
        return { data: { id: "dummy-id", name: "Leslie" } };
      }
    }
  };
}


// Track posted content to avoid duplicates
let postedContent = [];
try {
  if (fs.existsSync('./posted_content.json')) {
    postedContent = JSON.parse(fs.readFileSync('./posted_content.json', 'utf8'));
  }
} catch (error) {
  logger.error(`Error loading posted content: ${error.message}`);
}

// Function to save posted content
function savePostedContent() {
  try {
    fs.writeFileSync('./posted_content.json', JSON.stringify(postedContent), 'utf8');
  } catch (error) {
    logger.error(`Error saving posted content: ${error.message}`);
  }
}

// Function to generate content based on Leslie's character
function generateContent() {
  const contentTypes = [
    'property_showcase',
    'outdoor_adventures',
    'local_attractions',
    'seasonal_content'
  ];
  
  // Select content type based on distribution
  const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
  
  // Get templates for the selected type
  let templates = [];
  
  switch (randomType) {
    case 'property_showcase':
      templates = [
        "🏡 Cozy evenings by the fire after a day exploring the fells? Our Keswick cottage is calling your name! https://shorturl.at/lpcpl",
        "✨ That feeling when you step into a warm cottage after hiking Skiddaw... Pure bliss at our Keswick home: https://shorturl.at/lpcpl",
        "🛁 Nothing beats a soak in the rolltop bath while watching sunset paint Skiddaw golden. Book your stay: https://shorturl.at/lpcpl",
        "🥾 Our practical boot room is ready for your muddy gear after Lake District adventures! https://shorturl.at/lpcpl"
      ];
      break;
    case 'outdoor_adventures':
      templates = [
        "🥾 Catbells is calling! Just a short drive from our Keswick cottage, this walk offers stunning Derwentwater views. https://shorturl.at/lpcpl",
        "🏞️ Morning mist over Derwentwater is pure magic. Experience it from our Keswick holiday home: https://shorturl.at/lpcpl",
        "⛰️ Skiddaw views from your bedroom window? Yes please! Book our Keswick cottage: https://shorturl.at/lpcpl",
        "🌲 The Borrowdale Valley is spectacular this time of year. Our Keswick base is perfect for exploring it: https://shorturl.at/lpcpl"
      ];
      break;
    case 'local_attractions':
      templates = [
        "☕ Keswick's cafés are perfect for refueling after a day on the fells. Our holiday home is just minutes away: https://shorturl.at/lpcpl",
        "🍺 Sample local brews at Keswick Brewing Company, then stroll back to our cozy cottage: https://shorturl.at/lpcpl",
        "🛍️ Keswick Market is a treasure trove of local crafts and produce. Stay at our nearby cottage: https://shorturl.at/lpcpl",
        "🎭 Theatre by the Lake has an amazing program this season! Our Keswick home puts you right nearby: https://shorturl.at/lpcpl"
      ];
      break;
    case 'seasonal_content':
      templates = [
        "🍂 Autumn colors in the Lake District are simply breathtaking. Book our Keswick cottage for front-row views: https://shorturl.at/lpcpl",
        "❄️ Winter in the Lakes means cozy pubs with roaring fires. Our Keswick home is waiting for you: https://shorturl.at/lpcpl",
        "🌸 Spring wildflowers are carpeting the fells! Base yourself at our Keswick cottage: https://shorturl.at/lpcpl",
        "☀️ Summer evenings on the patio with Skiddaw views? Book our Keswick holiday home: https://shorturl.at/lpcpl"
      ];
      break;
  }
  
  // Select a random template
  let selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Check if we've used this template recently
  while (postedContent.includes(selectedTemplate) && postedContent.length < templates.length * 4) {
    selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  }
  
  // Add hashtags
  const hashtags = [
    "#LakeDistrict",
    "#Keswick",
    "#KeswickHolidays",
    "#Cumbria",
    "#OutdoorAdventures",
    "#HolidayCottage",
    "#Skiddaw",
    "#Derwentwater",
    "#LakelandCottage"
  ];
  
  // Select 2-3 random hashtags
  const numHashtags = Math.floor(Math.random() * 2) + 2; // 2-3 hashtags
  const selectedHashtags = [];
  
  for (let i = 0; i < numHashtags; i++) {
    const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
    if (!selectedHashtags.includes(randomHashtag)) {
      selectedHashtags.push(randomHashtag);
    }
  }
  
  // Add hashtags to the template
  const content = `${selectedTemplate} ${selectedHashtags.join(' ')}`;
  
  // Track this content
  postedContent.push(selectedTemplate);
  if (postedContent.length > 20) {
    postedContent.shift(); // Keep only the last 20 posts
  }
  savePostedContent();
  
  return content;
}

// Function to post to Twitter
async function postToTwitter() {
  try {
    const content = generateContent();
    logger.info(`Posting to Twitter: ${content}`);
    
    const response = await twitterClient.v2.tweet(content);
    logger.info(`Successfully posted to Twitter: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logger.error(`Error posting to Twitter: ${error.message}`);
    throw error;
  }
}

// Function to monitor Twitter for mentions and interactions
async function monitorTwitter() {
  try {
    // Get recent mentions
    const mentions = await twitterClient.v2.userMentionTimeline();
    
    for (const mention of mentions.data.data || []) {
      // Check if we've already responded to this mention
      if (postedContent.includes(`mention_${mention.id}`)) {
        continue;
      }
      
      logger.info(`Processing mention: ${mention.text}`);
      
      // Generate a response based on Leslie's character
      let response = "";
      
      if (mention.text.toLowerCase().includes("book") || mention.text.toLowerCase().includes("reservation") || mention.text.toLowerCase().includes("stay")) {
        response = `Thanks for your interest! You can book our Keswick cottage here: https://shorturl.at/lpcpl Feel free to DM with any questions about your stay.`;
      } else if (mention.text.toLowerCase().includes("price") || mention.text.toLowerCase().includes("cost") || mention.text.toLowerCase().includes("rate")) {
        response = `Our rates vary by season, but we offer great value for the Lake District! Check availability and prices here: https://shorturl.at/lpcpl`;
      } else if (mention.text.toLowerCase().includes("location") || mention.text.toLowerCase().includes("where")) {
        response = `Our cottage is ideally located in Keswick, with stunning views of Skiddaw and just a short walk to Derwentwater. Perfect base for exploring! https://shorturl.at/lpcpl`;
      } else {
        // Generic response
        const genericResponses = [
          `Thanks for reaching out! Our Keswick cottage is perfect for Lake District adventures. Check it out: https://shorturl.at/lpcpl`,
          `Appreciate your interest in our Keswick holiday home! It's a wonderful base for exploring the Lakes: https://shorturl.at/lpcpl`,
          `Thanks for connecting! Our 3-bedroom Keswick cottage has amazing Skiddaw views. More info here: https://shorturl.at/lpcpl`
        ];
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }
      
      // Reply to the mention
      await twitterClient.v2.reply(response, mention.id);
      logger.info(`Replied to mention ${mention.id}`);
      
      // Track that we've responded to this mention
      postedContent.push(`mention_${mention.id}`);
      savePostedContent();
    }
  } catch (error) {
    logger.error(`Error monitoring Twitter: ${error.message}`);
  }
}

// Schedule posts (3 times per week: Tuesday, Thursday, Saturday at 9 AM)
cron.schedule('0 9 * * 2', () => { // Tuesday
  logger.info('Running scheduled Tuesday post');
  postToTwitter();
});

cron.schedule('0 9 * * 4', () => { // Thursday
  logger.info('Running scheduled Thursday post');
  postToTwitter();
});

cron.schedule('0 9 * * 6', () => { // Saturday
  logger.info('Running scheduled Saturday post');
  postToTwitter();
});

// Monitor Twitter every 2 hours
cron.schedule('0 */2 * * *', () => {
  logger.info('Running scheduled Twitter monitoring');
  monitorTwitter();
});

// API endpoints
app.get('/', (req, res) => {
  res.send('Leslie AI Agent for Keswick Holiday Home is running');
});

app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'Leslie AI Agent is working properly' });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    character: leslieCharacter.name,
    postSchedule: '3 times per week (Tuesday, Thursday, Saturday at 9 AM)',
    lastPosted: postedContent.length > 0 ? postedContent[postedContent.length - 1] : 'No posts yet'
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Leslie AI Agent server running on port ${PORT}`);
  
  // Post immediately on startup if in development mode
  if (process.env.NODE_ENV === 'development') {
    logger.info('Development mode: posting immediately');
    postToTwitter();
  }
});
