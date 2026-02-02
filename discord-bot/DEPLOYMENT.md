# Deployment Guide

## Quick Start (Testing)

1. **Get Discord Bot Token:**
   - Go to https://discord.com/developers/applications
   - Create New Application
   - Go to "Bot" tab → Add Bot
   - Copy token

2. **Setup:**
   ```bash
   cd revenue-automation/discord-bot
   npm install
   cp .env.example .env
   # Edit .env and add your DISCORD_TOKEN
   ```

3. **Run:**
   ```bash
   npm start
   ```

4. **Invite Bot:**
   - Go to OAuth2 → URL Generator
   - Select: `bot` + `applications.commands`
   - Bot Permissions: `Administrator` (for testing)
   - Copy URL, open in browser, invite to test server

## Production Deployment

### Option 1: DigitalOcean ($5/mo)
```bash
# SSH into droplet
git clone <repo>
cd discord-bot
npm install
npm install -g pm2

# Set environment
echo "DISCORD_TOKEN=your_token" > .env

# Run with PM2 (auto-restart)
pm2 start bot.js --name discord-bot
pm2 save
pm2 startup
```

### Option 2: Heroku (Free tier, but sleeps)
```bash
# Add Procfile
echo "worker: node bot.js" > Procfile

# Deploy
heroku create falesystems-bot
heroku config:set DISCORD_TOKEN=your_token
git push heroku main
heroku ps:scale worker=1
```

### Option 3: Railway.app (Recommended)
- Connect GitHub repo
- Add DISCORD_TOKEN env var
- Auto-deploys on push
- $5/mo, never sleeps

## Monitoring

**Check logs:**
```bash
pm2 logs discord-bot
```

**Monitor uptime:**
- Use UptimeRobot (free)
- Ping bot every 5 minutes
- Alert if down

## Scaling

**1 server handles:**
- 10,000+ Discord servers
- 1M+ users
- <1GB RAM

Only need to scale if we hit 10k+ servers (good problem to have!)
