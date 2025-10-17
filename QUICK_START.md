# JcalAI - Quick Start Guide

Get up and running with JcalAI in 5 minutes! ⚡

---

## 🚀 5-Minute Setup

### Step 1: Prerequisites (1 min)

Make sure you have:
- ✅ Node.js 18+ installed
- ✅ A Supabase account (free at [supabase.com](https://supabase.com))
- ✅ Git installed

### Step 2: Clone & Install (2 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd jcalai

# Install dependencies
npm install
```

### Step 3: Supabase Setup (2 min)

**Create Project:**
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "jcalai" (or anything you like)
4. Set a database password
5. Choose your region
6. Wait ~2 minutes for project creation

**Get Credentials:**
1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc...
```

**Run Migrations:**
1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy content from `supabase/migrations/001_initial_schema.sql`
4. Click "RUN"
5. Repeat for `002_rls_policies.sql`
6. Repeat for `003_jcalai_platform_schema.sql`

### Step 4: Environment Setup (30 sec)

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Step 5: Run! (30 sec)

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🎯 First App in 60 Seconds

### 1. Sign Up (10 sec)
- Go to http://localhost:3000
- Click "Get Started"
- Sign up with email

### 2. Create with AI (30 sec)
- Click "Create with AI"
- Choose app type (e.g., "Web App")
- Enter prompt:
  ```
  Build a simple task management app with a list of todos,
  add/delete functionality, and a clean modern design
  ```
- Click "Generate My App"
- Wait ~10 seconds

### 3. Customize (20 sec)
- Click "Open in Builder"
- Drag components from left sidebar
- Click components to edit properties
- Save your changes

**That's it! You just built an app with AI.** 🚀

---

## 📚 What You Can Build

### Instant Prompts to Try

**Dashboard App:**
```
Build an analytics dashboard with charts showing sales,
revenue, and user metrics. Include a sidebar navigation
and clean modern design with blue color scheme.
```

**E-commerce Store:**
```
Create an online store for handmade crafts. Include
product listings, shopping cart, checkout with Stripe,
and order management.
```

**SaaS Landing Page:**
```
Build a landing page for a SaaS product with hero section,
features, pricing table, and testimonials. Modern gradient
design with call-to-action buttons.
```

**Task Manager:**
```
Create a Trello-style task board with drag-and-drop cards,
multiple lists, team collaboration, and progress tracking.
```

**Blog Platform:**
```
Build a blog with post listings, individual post pages,
categories, tags, author profiles, and comment system.
```

---

## 🎨 Using the Visual Builder

### Drag & Drop Components

**From the Left Sidebar:**
1. **Layouts**: Container, Grid, Card
2. **Content**: Text, Image, Hero
3. **Forms**: Input, Button, Form
4. **Navigation**: Navbar, Footer

**To Use:**
- Drag component onto canvas
- Drop where you want it
- Click to select
- Edit properties on right

### Edit Text
- Double-click any text to edit inline
- Or use the properties panel

### Change Styles
- Click component
- Use settings panel on right
- Adjust colors, sizes, spacing

### Multiple Viewports
- Toggle Desktop/Tablet/Mobile at top
- Design for all screen sizes

### Save & Export
- Click "Save" (top right)
- Click "Export" to download code
- Click "Deploy" to go live

---

## 🗄️ Database Designer

### Create Tables Visually

1. Go to project settings
2. Click "Database"
3. Click "Add Table"
4. Name your table (e.g., "tasks")
5. Add columns:
   - `id` (UUID, Primary Key) - auto-added
   - `title` (Text)
   - `completed` (Boolean)
   - `created_at` (Timestamp) - auto-added

6. Click "Generate SQL"
7. Click "Apply Migration"

**Your database is ready!** 🎉

---

## 📝 Templates

### Use Pre-Built Templates

1. Go to "Templates" in dashboard
2. Browse categories:
   - SaaS Starter
   - E-commerce Store
   - Admin Dashboard
   - Landing Page
   - Blog Platform

3. Click "Use Template"
4. Customize in builder
5. Deploy!

---

## 🚀 Deploy Your App

### Option 1: One-Click Deploy

1. In builder, click "Deploy"
2. Choose platform (Vercel recommended)
3. Connect GitHub (first time)
4. Click "Deploy"
5. Wait ~2 minutes
6. Get live URL!

### Option 2: Export Code

1. Click "Export" in builder
2. Download ZIP file
3. Extract and deploy anywhere:
   - Vercel
   - Netlify
   - AWS
   - Your own server

---

## 🔧 Common Tasks

### Add Authentication
```
In project settings:
→ Enable "Authentication"
→ Auto-generates login/signup pages
```

### Add Payments
```
In project settings:
→ Enable "Payments"
→ Add Stripe keys
→ Auto-generates checkout flow
```

### Add Database
```
In database designer:
→ Create tables visually
→ Generate SQL
→ Apply migration
→ Use in your app
```

### Add API Endpoints
```
In API builder:
→ Create endpoint (e.g., /api/tasks)
→ Define method (GET/POST/etc.)
→ Add logic visually
→ Test and deploy
```

---

## 🐛 Troubleshooting

### Can't Connect to Database
```bash
# Check environment variables
cat .env.local

# Verify Supabase URL and keys are correct
# Make sure there are no extra spaces
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

### Auth Not Working
```
1. Check Supabase URL is correct
2. Verify auth is enabled in Supabase dashboard
3. Check email settings in Supabase Auth
```

### Visual Builder Not Loading
```
1. Check browser console for errors
2. Clear browser cache
3. Try incognito mode
4. Restart dev server
```

---

## 📖 Learn More

### Documentation
- **README.md** - Full platform overview
- **ARCHITECTURE.md** - Technical details
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **PROJECT_SUMMARY.md** - Feature overview

### Key Concepts

**Projects** = Your apps
**Pages** = Individual screens in your app
**Components** = Reusable UI elements
**Templates** = Pre-built starting points
**Scaffolding** = AI-generated project structure

### Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + S` - Save
- `Delete` - Delete selected component

---

## 💡 Pro Tips

### 1. Start with Templates
Don't build from scratch - customize a template!

### 2. Be Specific with AI
More detail = better results:
```
❌ "Build a website"
✅ "Build a SaaS landing page with pricing table, 
    testimonials, blue gradient design, and signup form"
```

### 3. Use the Component Library
All components are production-ready and customizable

### 4. Save Often
Auto-save is coming, but click Save frequently for now

### 5. Test Responsiveness
Always check mobile view before deploying

### 6. Export Your Code
You own everything - export and customize further

---

## 🎓 Next Steps

### Beginner
1. ✅ Complete Quick Start
2. 📝 Create first app with AI
3. 🎨 Customize in visual builder
4. 🚀 Deploy to Vercel

### Intermediate
1. 🗄️ Design custom database
2. 🔌 Add API endpoints
3. 💳 Integrate Stripe payments
4. 👥 Add user authentication

### Advanced
1. 📦 Create custom components
2. 🔄 Build complex workflows
3. 🌐 Deploy to custom domain
4. 🤝 Collaborate with team

---

## 🆘 Get Help

### Resources
- **Documentation** - Check docs in project
- **GitHub Issues** - Report bugs
- **Community** - Coming soon
- **Email** - support@jcalai.com (if available)

### Common Questions

**Q: Is this free?**
A: Yes! Open source and free to use.

**Q: Can I export the code?**
A: Absolutely! Full code ownership.

**Q: What tech stack does it use?**
A: Next.js, React, TypeScript, Tailwind, Supabase

**Q: Can I deploy anywhere?**
A: Yes - Vercel, Netlify, AWS, your own server

**Q: Do I need to code?**
A: Nope! Fully no-code. But you can extend with code if you want.

---

## 🎉 You're Ready!

You now know how to:
- ✅ Set up JcalAI locally
- ✅ Create apps with AI
- ✅ Use the visual builder
- ✅ Deploy to production
- ✅ Customize everything

**Start building something amazing!** 🚀

---

**Questions?** Check the docs or create an issue on GitHub.

**Built with ❤️ by Innovix Dynamix**


