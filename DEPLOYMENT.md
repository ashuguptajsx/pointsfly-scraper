# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub account (to connect your repository)

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment with serverless Chromium"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **pointsfly-scraper** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **./
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Click **Deploy**

## Step 3: Configure Environment Variables (if needed)
If you have any API keys or secrets:
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add your variables

## Important Notes

### Timeout Configuration
- **Free tier**: 10 seconds max (your scraper takes ~50s, so you NEED Pro)
- **Pro tier**: 60 seconds max (configured in vercel.json)
- **Upgrade to Pro**: https://vercel.com/pricing

### Memory Configuration
- Configured to use 1024MB (1GB) in `vercel.json`
- This is necessary for Chromium to run properly

### Region
- Set to `bom1` (Mumbai) for best performance in India
- Change in `vercel.json` if needed

## Troubleshooting

### Issue: Function timeout
**Solution**: Upgrade to Vercel Pro plan

### Issue: Out of memory
**Solution**: Increase memory in `vercel.json`:
```json
{
  "functions": {
    "app/api/search/route.ts": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

### Issue: Chromium not found
**Solution**: Make sure `@sparticuz/chromium` is in dependencies (not devDependencies)

### Issue: Slow cold starts
**Solution**: This is normal for serverless functions. First request takes longer.

## Testing After Deployment

Once deployed, test your API:
```bash
curl "https://your-app.vercel.app/api/search?from=DEL&to=BOM&date=2025-11-30"
```

Or visit in browser:
```
https://your-app.vercel.app
```

## Cost Estimate (Vercel Pro)
- **Pro Plan**: $20/month
- Includes:
  - 100GB bandwidth
  - Unlimited team members
  - 60s function timeout
  - Commercial license

## Alternative: Free Tier Workaround
If you want to stay on free tier:
1. Reduce scraping time to <10s (difficult with Playwright)
2. Use caching heavily
3. Consider using a different platform (Railway, Render)

---

**Ready to deploy?** Run `vercel` in your terminal!
