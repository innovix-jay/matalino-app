# JcalAI Architecture Documentation

## Overview

JcalAI is a comprehensive AI-powered no-code platform built to enable rapid application development through visual editing and intelligent AI scaffolding. The platform transforms natural language prompts into production-ready applications.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      JcalAI Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Frontend   │  │   AI Engine  │  │   Backend    │     │
│  │   Next.js    │◄─┤  Scaffolding │◄─┤   Supabase   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                   │             │
│         ├─────────────────┼───────────────────┘             │
│         │                 │                                 │
│  ┌──────▼──────┐   ┌─────▼──────┐   ┌──────────────┐     │
│  │   Visual    │   │   Code     │   │  Deployment  │     │
│  │   Builder   │   │  Generator │   │   Manager    │     │
│  │ (Craft.js)  │   │            │   │              │     │
│  └─────────────┘   └────────────┘   └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Frontend Layer (Next.js 14 + React 18)

#### Pages Structure
```
app/
├── page.tsx                    # Landing page
├── dashboard/
│   ├── page.tsx               # Main dashboard
│   ├── projects/
│   │   ├── page.tsx           # Projects list
│   │   └── new/
│   │       └── page.tsx       # AI project creator
│   └── templates/
│       └── page.tsx           # Template marketplace
├── builder/
│   └── [projectId]/
│       └── page.tsx           # Visual builder
└── auth/
    ├── login/page.tsx
    └── signup/page.tsx
```

#### Component Architecture
```
components/
├── builder/                    # Visual editor components
│   ├── editor-canvas.tsx      # Main canvas wrapper
│   ├── toolbox.tsx            # Component library sidebar
│   ├── settings-panel.tsx     # Property editor
│   ├── layers-panel.tsx       # Layer hierarchy
│   ├── editor-header.tsx      # Editor toolbar
│   └── components/            # Drag-and-drop components
│       ├── container.tsx
│       ├── text.tsx
│       ├── button.tsx
│       ├── image.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── grid.tsx
│       ├── navbar.tsx
│       ├── footer.tsx
│       ├── hero.tsx
│       └── form.tsx
├── database-designer/         # Visual database tools
│   └── schema-canvas.tsx
├── ai/                        # AI-related components
└── ui/                        # Base UI components (Shadcn)
```

### 2. AI Scaffolding Engine

#### Prompt Analysis Pipeline
```typescript
User Prompt
    ↓
Analyze Intent & Features
    ↓
Detect App Type
    ↓
Select Technology Stack
    ↓
Generate Project Structure
    ↓
Create Pages & Components
    ↓
Design Database Schema
    ↓
Define API Endpoints
    ↓
Configure Integrations
    ↓
Return Complete Scaffold
```

#### Key Classes
- **`ProjectScaffoldingEngine`**: Main orchestrator for AI-powered generation
- **`ImageRoutingEngine`**: Routes image generation to optimal AI models
- **`CodeGenerator`**: Converts visual structures to production code
- **`DeploymentManager`**: Handles deployment to various platforms

### 3. Visual Builder (Craft.js)

#### Editor State Management
```typescript
EditorState {
  nodes: {
    [nodeId]: {
      type: ComponentType
      props: ComponentProps
      nodes: childNodeIds[]
      parent: parentNodeId
    }
  }
  events: {
    selected: Set<nodeId>
    dragged: Set<nodeId>
    hovered: Set<nodeId>
  }
}
```

#### Component System
Each builder component implements:
- **Render**: Visual representation
- **Props**: Configurable properties
- **Settings**: Property editor UI
- **Rules**: Drag/drop/placement rules
- **Craft Config**: Craft.js metadata

Example:
```typescript
export const Button = ({ text, variant, size }) => {
  const { connectors, selected } = useNode();
  return <button ref={connectors.connect}>{text}</button>;
};

Button.craft = {
  displayName: 'Button',
  props: { text: 'Button', variant: 'primary' },
  rules: { canDrag: true, canDrop: false },
  related: { toolbar: ButtonSettings },
};
```

### 4. Database Layer (Supabase/PostgreSQL)

#### Core Tables

**Projects & Apps**
- `projects` - Main app metadata
- `pages` - Individual pages with Craft.js structures
- `components` - Reusable components
- `database_schemas` - Visual database designs
- `api_endpoints` - API endpoint definitions
- `integrations` - Third-party service configs

**Templates & Assets**
- `templates` - Pre-built project templates
- `deployments` - Deployment history
- `ai_generations` - AI generation tracking

**Collaboration**
- `project_collaborators` - Team access control
- `project_activity` - Audit logs

#### Data Flow
```
User Action
    ↓
Next.js Server Action
    ↓
Supabase Client (Server-side)
    ↓
PostgreSQL Database
    ↓
Row Level Security (RLS)
    ↓
Return Authorized Data
```

### 5. Code Generation Pipeline

```typescript
Visual Structure (Craft.js JSON)
    ↓
Parse Component Tree
    ↓
Generate React Components
    ↓
Add Type Definitions
    ↓
Generate Styles (Tailwind)
    ↓
Create Page Files
    ↓
Generate Config Files
    ↓
Bundle as Next.js Project
```

Output Structure:
```
generated-project/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── [pages]/
├── components/
│   └── [generated-components]/
├── lib/
│   └── utils.ts
└── README.md
```

### 6. Deployment System

#### Supported Platforms
- **Vercel**: Primary deployment target
- **Netlify**: Alternative platform
- **Custom**: Self-hosted options

#### Deployment Flow
```
Export Project Code
    ↓
Generate Platform Config
    ↓
Create Deployment Record
    ↓
Upload to Platform
    ↓
Build & Deploy
    ↓
Monitor Status
    ↓
Return Live URL
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI + Shadcn/ui
- **Visual Editor**: Craft.js
- **Drag & Drop**: @dnd-kit
- **State**: React Hooks + Server Actions

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (planned)
- **API**: Next.js API Routes + Server Actions

### AI & Code Generation
- **AI Routing**: Custom engine for LLM selection
- **Code Generation**: Custom TypeScript-based generator
- **Templates**: JSON-based template system

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Sentry (configured)
- **Analytics**: PostHog (configured)

---

## Key Design Patterns

### 1. Server Actions Pattern
```typescript
// app/actions/projects.ts
'use server';

export async function createProject(data: ProjectData) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  // Server-side logic
  return project;
}
```

### 2. Component Builder Pattern
```typescript
// Draggable, configurable component
export const Component = (props) => {
  const { connectors, selected } = useNode();
  return <div ref={connectors.connect}>{/* content */}</div>;
};

Component.craft = { /* Craft.js config */ };
```

### 3. AI Scaffolding Pattern
```typescript
// Prompt → Analysis → Generation → Output
const scaffold = await scaffoldingEngine.scaffold({
  prompt: "Build a task management app",
  appType: "web",
});
// Returns complete project structure
```

---

## Security Architecture

### Authentication
- Supabase Auth with JWT tokens
- Server-side session validation
- Secure cookie management

### Authorization
- Row Level Security (RLS) policies
- User-scoped data access
- Role-based permissions (planned)

### Data Protection
- Encrypted API keys (in production)
- Environment variable management
- HTTPS-only in production

---

## Performance Optimizations

### Frontend
- React Server Components
- Dynamic imports for heavy components
- Image optimization (Next.js Image)
- Code splitting by route

### Database
- Indexed foreign keys
- Optimized queries with select()
- Connection pooling via Supabase

### Caching
- Redis caching layer (configured)
- Static page generation where possible
- CDN for static assets

---

## Scalability Considerations

### Horizontal Scaling
- Stateless Next.js instances
- Supabase managed scaling
- CDN distribution

### Database Scaling
- Read replicas (Supabase Pro)
- Query optimization
- Partitioning for large tables (future)

### Code Generation
- Async processing for large projects
- Queue system for deployments (planned)
- Background jobs (planned)

---

## Monitoring & Observability

### Error Tracking
- Sentry integration
- Custom error boundaries
- Detailed error logs

### Analytics
- PostHog event tracking
- User behavior analysis
- Performance metrics

### Health Checks
- API health endpoint
- Database connection monitoring
- Service status dashboard (planned)

---

## Development Workflow

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Run migrations
# Use Supabase CLI or Studio

# 4. Start dev server
npm run dev
```

### Code Organization
- Feature-based structure
- Separation of concerns
- Type safety throughout
- Comprehensive comments

---

## Future Architecture Plans

### Phase 1 (Current)
- ✅ Core visual builder
- ✅ AI scaffolding
- ✅ Template system
- ✅ Code export

### Phase 2 (Q1 2025)
- 🔄 Real-time collaboration
- 🔄 Advanced database designer
- 🔄 API workflow builder
- 🔄 Mobile app builder

### Phase 3 (Q2 2025)
- 📅 Multi-tenant architecture
- 📅 Plugin system
- 📅 Marketplace
- 📅 White-label options

---

## Contributing Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component documentation
- Type definitions for all exports

### Git Workflow
- Feature branches
- PR reviews required
- Semantic commit messages
- Automated testing (planned)

---

## API Documentation

### Server Actions
All server actions are in `lib/actions/`:
- `projects.ts` - Project CRUD operations
- `templates.ts` - Template management
- `deployment.ts` - Deployment operations

### Database Schema
See `supabase/migrations/` for full schema

---

## Troubleshooting

### Common Issues
1. **Auth errors**: Check Supabase keys in `.env.local`
2. **Build errors**: Clear `.next` and reinstall dependencies
3. **Database errors**: Verify migrations are applied

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm run dev
```

---

**Last Updated**: October 2024
**Version**: 1.0.0
**Maintained By**: Innovix Dynamix


