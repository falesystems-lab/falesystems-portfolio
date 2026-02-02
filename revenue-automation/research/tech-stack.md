# Tech Stack & Tools

## Core Principle: Start Free, Upgrade When Revenue Justifies

---

## Discord Bot Stack

### Language & Framework
**Choice:** Node.js + Discord.js v14

**Why:**
- JavaScript (easy to maintain)
- Discord.js is most popular (best docs)
- Async/await for clean code
- Large community (ChatGPT knows it well)

**Alternatives considered:**
- Python (discord.py) - Good, but slightly slower
- Go - Fast, but overkill for our scale
- Rust - Too complex for rapid iteration

---

### Database
**Phase 1 (0-1000 servers):** In-memory (Map/JSON files)
- **Cost:** $0
- **Why:** Simple, no setup, fast enough
- **Limitation:** Data lost on restart (acceptable for config)

**Phase 2 (1000-10000 servers):** SQLite
- **Cost:** $0
- **Why:** File-based, no server needed
- **Tool:** better-sqlite3 (npm)

**Phase 3 (10000+ servers):** PostgreSQL
- **Cost:** $5-10/mo (Railway, Supabase)
- **Why:** Scales, backups, proper DB
- **Migration:** Use Prisma ORM (easy migration)

---

### Hosting
**Phase 1 (beta/testing):** Local machine
- **Cost:** $0
- **Why:** Testing only

**Phase 2 (launch):** Railway.app
- **Cost:** $5/mo (starter)
- **Why:**
  - Git-based deploy (push = deploy)
  - Environment variables
  - Auto-restart
  - Scales easily
- **Alternatives:** Heroku (expensive), DigitalOcean ($6, more setup)

**Phase 3 (scale):** DigitalOcean Droplet
- **Cost:** $12/mo (4GB RAM)
- **Why:** Cheaper at scale, full control
- **Setup:** PM2 for process management

---

### Monitoring
**Uptime:** UptimeRobot (free, pings every 5 min)
**Errors:** Sentry (free tier, 5k events/mo)
**Logs:** Built-in console.log + PM2 logs
**Analytics:** Custom (track commands used, servers, etc.)

**Cost:** $0

---

### Payment Processing
**Stripe**
- **Fee:** 2.9% + $0.30
- **Why:** Developer-friendly, webhooks, subscriptions
- **Alternative:** Paddle (handles VAT, but 5% + $0.50)

**Setup:**
- Stripe Checkout (hosted payment page)
- Webhook: update user to premium on payment
- Cancel flow: stripe.subscriptions.cancel

---

## Website/Blog Stack

### Framework
**Next.js 14 (App Router)**

**Why:**
- SEO-friendly (SSG/SSR)
- Fast (React)
- API routes (backend in same repo)
- Easy deployment (Vercel)
- Image optimization
- TypeScript support

**Alternatives:**
- Astro (even faster, but newer)
- Jekyll (simple, but limited)

---

### Hosting
**Vercel** (free tier)

**Limits:**
- 100GB bandwidth/mo (plenty for start)
- Unlimited sites
- Auto-deploy on git push
- Edge functions

**Cost:** $0 until traffic exceeds free tier

**Fallback:** Netlify (similar), Cloudflare Pages

---

### Content Management
**Option 1:** Markdown files (Git-based)
- Write in `/content/posts/*.md`
- Next.js reads + renders
- **Pros:** Simple, version-controlled, no CMS overhead
- **Cons:** No GUI (fine for us, AI writes anyway)

**Option 2:** Notion API (if needed GUI)
- Write posts in Notion
- Fetch via API, render on site
- **Pros:** Nice editor
- **Cons:** API rate limits, complexity

**Recommendation:** Start with Markdown, consider Notion later

---

### Styling
**Tailwind CSS**

**Why:**
- Utility-first (fast development)
- No CSS files (fewer files to manage)
- Responsive built-in
- Popular (easy to find examples)

**Alternative:** Plain CSS (fine, but slower)

---

### Analytics
**Phase 1:** Google Analytics 4 (free)
- Visitor tracking
- Page views
- Basic demographics

**Phase 2:** Plausible or Fathom ($9-15/mo)
- Privacy-focused
- Simpler dashboard
- EU-friendly (GDPR)

**Cost:** $0 initially, $9-15/mo when revenue allows

---

### Email Newsletter
**ConvertKit** (free up to 1,000 subscribers)

**Why:**
- Creator-friendly
- Automation sequences
- Landing pages built-in
- Tag-based segmentation

**Alternative:** Mailchimp (also free, but less creator-focused)

**Cost:** $0 until 1,000 subscribers

---

## Landing Page SaaS Stack

### Frontend
**Next.js + Tailwind** (same as blog)

**Pages:**
- Home (value prop, demo)
- Pricing
- Templates gallery
- Generate page (form)
- Dashboard (user's pages)

---

### Backend
**Next.js API Routes**

**Endpoints:**
- `/api/generate` - Create landing page (calls OpenAI)
- `/api/checkout` - Stripe payment
- `/api/webhook` - Stripe webhook (update DB)
- `/api/user/pages` - List user's pages

---

### AI Generation
**OpenAI API (gpt-4o-mini for cost efficiency)**

**Prompt Structure:**
```
Generate a professional landing page for:
- Business: {user input}
- Industry: {user input}
- Target audience: {user input}
- Goal: {user input}

Return as JSON:
{
  "headline": "...",
  "subheadline": "...",
  "cta": "...",
  "features": [...],
  "hero_image_prompt": "..."
}
```

**Cost:** ~$0.01-0.05 per page generation

---

### Database
**Supabase (PostgreSQL)**
- **Free tier:** 500MB, plenty for start
- **Tables:**
  - users (email, stripe_id, plan)
  - pages (user_id, html, created_at)
  - payments (user_id, amount, status)

**Alternative:** Firebase (NoSQL, free tier also generous)

---

### File Storage
**Vercel Blob Storage** (generated HTML files)
- Free tier: 1GB
- Or store in DB (for small files)

**Alternative:** AWS S3 (cheap, $0.023/GB)

---

### Deployment
**Vercel** (same as blog, monorepo)

**Structure:**
```
/apps
  /web (blog + marketing site)
  /app (SaaS dashboard)
  /bot (Discord bot - separate)
```

---

## Development Tools

### Code Editor
**VSCode** (free)
- Extensions: Prettier, ESLint, Tailwind IntelliSense
- GitHub Copilot (optional, $10/mo - worth it)

---

### Version Control
**Git + GitHub**
- Free private repos
- GitHub Actions for CI/CD
- Issues/Projects for task tracking

---

### Design
**Figma** (free tier)
- Wireframes
- Design mockups
- Share with users for feedback

**Canva** (free tier)
- Blog post images
- Social media graphics
- Quick graphics

---

### AI Coding Assistant
**GitHub Copilot** ($10/mo, optional but recommended)
- Autocomplete code
- Explain code
- Generate tests
- Refactor

**Alternative:** Free - Codeium, Tabnine

---

## Cost Summary

### Month 1-3 (MVP):
| Service | Cost |
|---------|------|
| Domain | $10/year ($1/mo) |
| Railway (bot hosting) | $5/mo |
| OpenAI API | ~$5/mo |
| **Total** | **$11/mo** |

### Month 4-6 (Growing):
| Service | Cost |
|---------|------|
| Domain | $1/mo |
| Railway/DigitalOcean | $10/mo |
| Supabase DB | $0 (free tier) |
| OpenAI API | ~$20/mo |
| Stripe fees | ~3% of revenue |
| **Total** | **~$30/mo + 3% revenue** |

### Month 6-12 (Scaling):
| Service | Cost |
|---------|------|
| Domain + CDN | $10/mo |
| Server (upgraded) | $20/mo |
| Database | $10/mo |
| OpenAI API | $50/mo |
| Email (>1k subs) | $30/mo |
| Analytics (Plausible) | $15/mo |
| Tools (Ahrefs Lite) | $99/mo |
| **Total** | **~$230/mo + fees** |

**Break-even:** ~$300/mo revenue

---

## Tool Alternatives (Cost-Conscious)

### If Budget Tight:

**Instead of Ahrefs ($99/mo):**
- Ubersuggest ($12/mo)
- SEO Minion (Chrome ext, free)
- Google Search Console (free)

**Instead of paid hosting:**
- Vercel/Netlify free tiers (ample)
- Railway free tier ($5 credit/mo)

**Instead of Figma Pro:**
- Excalidraw (free, diagrams)
- Canva free tier

**Instead of ConvertKit Pro:**
- Mailchimp free (up to 500 subs)
- Substack (free, but they own audience)

---

## Security Checklist

### Discord Bot:
- [ ] Token in environment variable (never commit)
- [ ] Rate limiting (don't hit API limits)
- [ ] Input validation (no SQL injection via commands)
- [ ] Error handling (don't leak sensitive info)

### Website:
- [ ] HTTPS (Vercel does this)
- [ ] CORS configured
- [ ] API rate limiting
- [ ] SQL injection prevention (use Prisma)
- [ ] XSS prevention (React handles this)

### SaaS:
- [ ] Stripe webhook signature verification
- [ ] User authentication (NextAuth.js)
- [ ] CSRF protection
- [ ] Payment PCI compliance (Stripe handles)

---

## Backup Strategy

### Code:
- **GitHub** (version controlled, redundant)

### Database:
- **Daily backups** (Supabase does this)
- **Weekly export** (download to local)

### User Data:
- **GDPR compliance:** Allow user export/delete
- **Retention:** Delete old/unused data

---

## Scaling Plan

### 100 customers:
- Current stack works fine
- No changes needed

### 1,000 customers:
- Upgrade server ($20/mo)
- Add Redis cache (optional)
- CDN for static assets (Cloudflare free)

### 10,000 customers:
- Dedicated server ($50-100/mo)
- Load balancer (if needed)
- Separate DB server
- Consider microservices (bot, API separate)

### 100,000+ customers:
- Multiple servers
- Database replication
- Hire DevOps help
- But this is a "good problem"

**Reality:** Most SaaS never hit 10k customers. Start simple.

---

## Development Workflow

### Feature Development:
1. Write spec (what does it do?)
2. Code (with Copilot assist)
3. Test locally
4. Deploy to staging (Vercel preview)
5. Test on staging
6. Merge to main (auto-deploy production)

### Bug Fixes:
1. User reports bug (Discord/email)
2. Reproduce locally
3. Fix + test
4. Deploy (same day if critical)

### Time Estimate:
- Simple feature: 2-4 hours
- Medium feature: 1-2 days
- Complex feature: 3-5 days

**Advantage of small codebase:** Fast iteration

---

## Tech Debt Management

**Rule:** Don't accumulate debt in early stage

**Good practices:**
- Write clean code from start (easier to maintain)
- Comment complex logic
- Use TypeScript (catch bugs early)
- Test critical paths (auth, payments)

**When to refactor:**
- Code becomes hard to understand
- Adding features takes too long
- Performance suffers

**When NOT to refactor:**
- No users yet (premature optimization)
- Just to use "better" tech (not worth it)

---

**Tech Stack Complete.** Modern, cost-effective, scalable. Total cost: $11/mo to start, scales with revenue.
