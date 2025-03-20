# Leslie AI Agent - Deployment Guide for Render

This guide will walk you through deploying the Leslie AI agent to Render. This autonomous agent will promote your Keswick holiday home on Twitter using the Eliza framework.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in (or create an account if needed)
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "leslie-eliza-agent")
4. Choose "Public" visibility (easier for deployment)
5. Click "Create repository"

## Step 2: Upload Files to GitHub

1. In your new repository, click "Add file" → "Upload files"
2. Upload all the files from the eliza-leslie-package:
   - `package.json`
   - `server.js`
   - `leslie_character.json`
   - `README.md`
3. Click "Commit changes"

## Step 3: Deploy to Render

1. Go to [Render](https://render.com) and sign in (or create an account)
2. Click the "New +" button in the top right
3. Select "Web Service"
4. Connect your GitHub account if prompted
5. Find and select your "leslie-eliza-agent" repository
6. Configure the service with these settings:
   - **Name**: leslie-ai-agent (or any name you prefer)
   - **Region**: Choose the closest to your location
   - **Branch**: main (or whatever your default branch is)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

## Step 4: Add Environment Variables

1. Scroll down to the "Environment" section
2. Add your Twitter API credentials as environment variables:
   - Key: `TWITTER_API_KEY` | Value: Your Twitter API key
   - Key: `TWITTER_API_KEY_SECRET` | Value: Your Twitter API key secret
   - Key: `TWITTER_ACCESS_TOKEN` | Value: Your Twitter access token
   - Key: `TWITTER_ACCESS_TOKEN_SECRET` | Value: Your Twitter access token secret
3. Click "Save Changes"

## Step 5: Deploy Your Service

1. Scroll to the bottom and click "Create Web Service"
2. Render will start building and deploying your service
3. This process takes about 5-10 minutes
4. Once complete, you'll see a URL for your service (e.g., `https://leslie-ai-agent.onrender.com`)

## Step 6: Verify Deployment

1. Visit your Render service URL (e.g., `https://leslie-ai-agent.onrender.com`)
2. You should see the message: "Leslie AI Agent for Keswick Holiday Home is running"
3. Visit `https://your-service-url.onrender.com/api/status` to check the agent's status
4. You should see a JSON response with the agent's status, character name, and posting schedule

## Step 7: Monitor Your Agent

1. In the Render dashboard, click on your service
2. Go to the "Logs" tab to see the agent's activity
3. You should see log entries when the agent posts to Twitter (scheduled for Tuesday, Thursday, and Saturday at 9 AM)
4. You can also check your Twitter account to see the posts

## Troubleshooting

### If your service fails to deploy:
- Check the logs in Render for specific error messages
- Verify that all files were uploaded correctly to GitHub
- Ensure your Twitter API credentials are correct

### If the agent isn't posting:
- Check the logs for any error messages
- Verify your Twitter API credentials
- Make sure the service is running (should show "Active" in Render dashboard)

## Maintenance

Your Leslie AI agent will run autonomously, posting three times per week and responding to mentions. The service will automatically restart if it crashes, and Render's free tier includes 750 hours of runtime per month, which is enough for continuous operation.

If you need to make changes to Leslie's content or behavior:
1. Update the files in your GitHub repository
2. Render will automatically detect the changes and redeploy your service

Congratulations! Your Leslie AI agent is now deployed and will autonomously promote your Keswick holiday home on Twitter.
