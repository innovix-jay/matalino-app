# JcalAI - AI-Powered No-Code App Builder

**By Innovix Dynamix**

Transform ideas into production-ready applications in minutes with the power of AI. JcalAI is a comprehensive no-code platform that rivals Replit, Cursor, Lovable, Bolt, and Base44—combining intuitive visual editing with intelligent AI scaffolding to deliver complete, customizable digital products.

---

## 🌟 Vision

JcalAI empowers users to:
- **Prompt for ideas** and receive working MVPs or prototypes
- **Build web and mobile applications** without writing code
- **Create automations, AI tools, and integrations** visually
- **Deploy anywhere** with full code ownership

---

## 🚀 Core Features

### 1. **AI-Powered Project Scaffolding**
- Describe your app in natural language
- AI analyzes requirements and generates complete project structure
- Automatic page, component, database, and API generation
- Smart technology stack selection (Next.js, Supabase, Tailwind, etc.)
- Production-ready code from day one

### 2. **Visual Drag & Drop Builder**
- Real-time visual editor powered by Craft.js
- Comprehensive component library (layouts, forms, data displays, navigation)
- Live preview with desktop/tablet/mobile viewports
- Layer management and component settings
- Undo/redo functionality

### 3. **Component Library**
Built-in components include:
- **Layouts**: Container, Grid, Card
- **Content**: Text (with inline editing), Image, Hero sections
- **Navigation**: Navbar, Footer
- **Forms**: Input fields, Form containers, Buttons
- **Custom**: Extensible component system

### 4. **Database Designer** (Coming Soon)
- Visual database schema builder
- Relationship mapping (one-to-one, one-to-many, many-to-many)
- Auto-generated SQL migrations
- Integration with Supabase/PostgreSQL

### 5. **API Builder** (Coming Soon)
- Visual API endpoint creation
- Request/response schema definition
- Authentication and rate limiting
- Visual workflow builder or custom code

### 6. **Integration Hub** (Coming Soon)
- Pre-built integrations (Stripe, SendGrid, Twilio, etc.)
- Custom API connectors
- Webhook automation

### 7. **Template System** (Coming Soon)
- 100+ pre-built templates
- Categories: Dashboard, E-commerce, SaaS, Landing Pages, Blogs
- Industry-specific templates
- Fully customizable

### 8. **Deployment & Export**
- One-click deployment to Vercel, Netlify, AWS
- Custom domain support
- Export full source code
- CI/CD integration

### 9. **Real-time Collaboration** (Coming Soon)
- Multi-user editing
- Role-based permissions (Owner, Editor, Viewer)
- Activity tracking and version history

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS-in-JS
- **UI Components**: Radix UI, Shadcn/ui
- **Visual Editor**: Craft.js
- **Drag & Drop**: @dnd-kit
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Custom routing engine for multiple LLMs
- **Deployment**: Vercel (primary), Netlify, AWS (optional)

### Database Schema
The platform uses a comprehensive PostgreSQL schema with:
- **projects**: App/project metadata and configuration
- **pages**: Individual pages within projects
- **components**: Reusable UI components
- **database_schemas**: Visual database designs
- **api_endpoints**: API endpoint definitions
- **integrations**: Third-party service connections
- **templates**: Pre-built project templates
- **deployments**: Deployment history and status
- **ai_generations**: AI generation tracking
- **project_collaborators**: Team collaboration
- **project_activity**: Audit logs

---

## 📖 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Optional: API keys for AI services (OpenAI, Anthropic, Google)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd jcalai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services (optional)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

4. **Run database migrations**
```bash
# Use Supabase CLI or run migrations in Supabase Studio
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see JcalAI in action!

---

## 🎯 Usage

### Creating Your First App

1. **Sign Up/Login** at `/auth/signup`
2. **Navigate to Projects** at `/dashboard/projects`
3. **Click "Create with AI"**
4. **Choose an app type** (Web App, E-commerce, SaaS, etc.)
5. **Describe your app** in natural language:
   ```
   Build a modern task management app with team collaboration,
   time tracking, and project boards. Include user authentication,
   email notifications, and a clean dashboard with analytics.
   Use a blue and white color scheme.
   ```
6. **Generate** and watch AI build your app in seconds
7. **Customize** in the visual builder
8. **Deploy** with one click

### Using the Visual Builder

1. **Drag & drop components** from the left sidebar
2. **Click to select** and edit properties in the right panel
3. **Double-click text** to edit inline
4. **Use layers panel** to manage component hierarchy
5. **Switch viewports** to test responsiveness
6. **Save** your changes frequently
7. **Preview** in a new tab
8. **Export** code or deploy

---

## 🏆 Competitive Advantages

### vs. Replit
- **Faster**: AI-powered scaffolding creates complete projects in seconds
- **Visual-first**: No-code interface with drag & drop
- **Smarter**: Automatic technology stack selection

### vs. Lovable
- **More Powerful**: Full database design, API integrations, complex logic
- **Deeper**: Backend logic, not just UI
- **Extensible**: Export and own your code

### vs. Bolt
- **Smarter**: Advanced AI routing and cost optimization
- **Better Architecture**: Intelligent framework selection
- **More Features**: Built-in integrations and deployment

### vs. Cursor
- **More Accessible**: No coding required
- **Faster**: Visual building vs. text editing
- **Flexible**: Export anywhere, deploy anywhere

### vs. Base44
- **AI-Powered**: Intelligent scaffolding and component generation
- **Open**: Export full source code
- **Scalable**: From MVP to production

---

## 🛣️ Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Rebrand to JcalAI
- [x] Database schema for no-code platform
- [x] Visual editor with Craft.js
- [x] Core component library
- [x] AI scaffolding engine
- [x] Project management

### 🚧 Phase 2: Enhancement (In Progress)
- [ ] Complete visual database designer
- [ ] API builder with visual workflows
- [ ] Template marketplace
- [ ] Enhanced AI assistant
- [ ] Code export functionality

### 📅 Phase 3: Scale (Q2 2025)
- [ ] Real-time collaboration
- [ ] Mobile app builder
- [ ] Automation workflows
- [ ] Integration marketplace
- [ ] White-label options

### 🔮 Phase 4: Innovation (Q3 2025)
- [ ] Voice-to-UI generation
- [ ] Multi-platform publishing
- [ ] Agent-based automation
- [ ] Custom AI model training
- [ ] Enterprise features

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

---

## 📄 License

Proprietary - © 2025 Innovix Dynamix. All rights reserved.

---

## 🌐 Links

- **Website**: https://jcalai.com
- **Parent Company**: Innovix Dynamix
- **Documentation**: Coming soon
- **Community**: Coming soon

---

## 💡 Philosophy

At JcalAI, we believe that:
- **Everyone should be able to build software**
- **AI should empower, not replace, human creativity**
- **Code ownership matters** - you should own what you build
- **Speed and quality aren't mutually exclusive**
- **The best tools are invisible** - they just work

---

## 🎨 Design Principles

1. **Beautiful by Default**: Every generated app looks professional
2. **Intuitive First**: No manual needed, just build
3. **Fast Iteration**: Changes in real-time, deploy in seconds
4. **Production-Ready**: From MVP to scale without rebuilding
5. **User-Centric**: Designed for creators, by creators

---

## 📞 Support

- **Email**: support@jcalai.com
- **Discord**: Coming soon
- **Twitter**: @jcalai

---

**Built with ❤️ by Innovix Dynamix**

*Empowering the next generation of builders*
