# Leslie AI Agent - Eliza Deployment for Render

This repository contains the Leslie AI agent for promoting a Keswick holiday home on Twitter. The agent is designed to run on Render and uses the Eliza framework to create an autonomous social media presence.

## Features

- Automated posting 3 times per week (Tuesday, Thursday, Saturday)
- Intelligent responses to mentions and comments
- Content strategy focused on property features, outdoor adventures, local attractions, and seasonal content
- Monitoring of relevant keywords and hashtags
- Analytics tracking for engagement metrics

## Requirements

- Node.js 16+
- Twitter API credentials

## Environment Variables

Create a `.env` file with the following variables:

```
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_KEY_SECRET=your_twitter_api_key_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

## Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your Twitter API credentials
4. Run the server: `npm start`

## Deployment to Render

1. Push this repository to GitHub
2. Connect to Render and create a new Web Service
3. Select your GitHub repository
4. Configure as a Node.js application
5. Add your Twitter API credentials as environment variables
6. Deploy!

## Files

- `server.js` - Main application file
- `leslie_character.json` - Leslie's personality and content strategy
- `package.json` - Dependencies and configuration

## License

Private - For use with Keswick holiday home promotion only
