# GitHub Setup - Deploy FaleSystems Portfolio

## ✅ Done
- Git config set (falesystems@gmail.com)
- Initial commit created (37 files, 8641+ lines)
- All files staged and committed

## 🚀 Next Steps (Manual)

### 1. Create GitHub Repository

Go to: https://github.com/new

**Settings:**
- Repository name: `falesystems-portfolio` (or any name you want)
- Description: "FaleSystems - Web Development, Bots, SEO, Automation"
- **Public** (needed for GitHub Pages free hosting)
- **Do NOT** initialize with README (we already have files)

Click "Create repository"

### 2. Connect Local Repo to GitHub

GitHub will show you commands. Use these:

```bash
cd /root/.openclaw/workspace
git remote add origin https://github.com/YOUR_USERNAME/falesystems-portfolio.git
git branch -M main
git push -u origin main
```

**Replace YOUR_USERNAME** with your GitHub username (create account with falesystems@gmail.com if you don't have one)

### 3. Enable GitHub Pages

After pushing:

1. Go to repo → **Settings** → **Pages** (left sidebar)
2. Source: Deploy from branch
3. Branch: **main** → folder: **/ (root)**
4. Save

Wait 1-2 minutes, then your site will be live at:
`https://YOUR_USERNAME.github.io/falesystems-portfolio/`

### 4. Set Custom Subdirectory (Optional)

Since portfolio is in `revenue-automation/`, you have two options:

**Option A: Move files to root** (cleaner URLs)
```bash
cd /root/.openclaw/workspace
mv revenue-automation/* .
rm -rf revenue-automation/
git add -A
git commit -m "Move portfolio to root"
git push
```

Then site will be: `https://YOUR_USERNAME.github.io/falesystems-portfolio/`

**Option B: Keep structure, adjust URLs**
Site will be: `https://YOUR_USERNAME.github.io/falesystems-portfolio/revenue-automation/`

I recommend **Option A** for cleaner URLs.

### 5. Custom Domain (Later)

Once you have a domain:
1. GitHub repo → Settings → Pages → Custom domain
2. Add your domain (e.g., `falesystems.com`)
3. Configure DNS (I can help with this)

## Authentication

When pushing, GitHub will ask for credentials:

**Username:** Your GitHub username  
**Password:** Use a **Personal Access Token** (not your Gmail password)

### Create Token:
1. GitHub → Settings (top right) → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scope: `repo` (full control)
4. Copy token (save it somewhere, shown only once)
5. Use token as password when pushing

## Quick Commands Reference

```bash
# Check status
git status

# Stage all changes
git add -A

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## After Deployment

1. **Test the site:** Visit the GitHub Pages URL
2. **Share on Reddit/Twitter:** Use the template we created
3. **Update portfolio URL** in all service pages
4. **Start marketing:** Follow marketing-plan.md Day 3-4 tasks

---

**Need help?** Tell me the step you're stuck on and I'll guide you through it. 🔥
