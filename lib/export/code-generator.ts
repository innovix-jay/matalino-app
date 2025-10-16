import { Project, Page, Component } from '@/types/project';

/**
 * Code Generation Engine for JcalAI
 * 
 * Converts visual project structures into production-ready code
 */

export class CodeGenerator {
  /**
   * Generates a complete Next.js project structure
   */
  async generateProject(
    project: Project,
    pages: Page[],
    components: Component[]
  ): Promise<{
    files: Record<string, string>;
    structure: string[];
  }> {
    const files: Record<string, string> = {};
    const structure: string[] = [];

    // Generate package.json
    files['package.json'] = this.generatePackageJson(project);
    structure.push('package.json');

    // Generate Next.js config
    files['next.config.js'] = this.generateNextConfig(project);
    structure.push('next.config.js');

    // Generate Tailwind config
    files['tailwind.config.js'] = this.generateTailwindConfig();
    structure.push('tailwind.config.js');

    // Generate TypeScript config
    files['tsconfig.json'] = this.generateTsConfig();
    structure.push('tsconfig.json');

    // Generate environment file template
    files['.env.example'] = this.generateEnvTemplate(project);
    structure.push('.env.example');

    // Generate README
    files['README.md'] = this.generateReadme(project);
    structure.push('README.md');

    // Generate pages
    for (const page of pages) {
      const pagePath = this.getPagePath(page);
      files[pagePath] = this.generatePageCode(page, components);
      structure.push(pagePath);
    }

    // Generate components
    for (const component of components) {
      const componentPath = `components/${component.name}.tsx`;
      files[componentPath] = this.generateComponentCode(component);
      structure.push(componentPath);
    }

    // Generate app layout
    files['app/layout.tsx'] = this.generateLayout(project);
    structure.push('app/layout.tsx');

    // Generate globals.css
    files['app/globals.css'] = this.generateGlobalStyles();
    structure.push('app/globals.css');

    // Generate lib/utils.ts
    files['lib/utils.ts'] = this.generateUtils();
    structure.push('lib/utils.ts');

    return { files, structure };
  }

  private generatePackageJson(project: Project): string {
    const config = project.config;
    
    return JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: `${project.version}.0.0`,
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        'next': '^14.2.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        ...(config.styling === 'tailwindcss' && {
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.16',
          'postcss': '^8.4.32',
        }),
        ...(config.database === 'supabase' && {
          '@supabase/supabase-js': '^2.39.0',
          '@supabase/ssr': '^0.1.0',
        }),
        'clsx': '^2.0.0',
        'tailwind-merge': '^2.2.0',
      },
      devDependencies: {
        '@types/node': '^20.10.0',
        '@types/react': '^18.2.45',
        '@types/react-dom': '^18.2.18',
        'typescript': '^5.3.3',
        'eslint': '^8.56.0',
        'eslint-config-next': '^14.0.4',
      },
    }, null, 2);
  }

  private generateNextConfig(project: Project): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
`;
  }

  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
  }

  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        jsx: 'preserve',
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        allowJs: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2);
  }

  private generateEnvTemplate(project: Project): string {
    let env = '# Environment Variables\n\n';

    if (project.config.database === 'supabase') {
      env += `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

`;
    }

    return env;
  }

  private generateReadme(project: Project): string {
    return `# ${project.name}

${project.description || 'A Next.js application built with JcalAI'}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your values
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: ${project.config.framework}
- **Styling**: ${project.config.styling}
- **Database**: ${project.config.database}
- **Authentication**: ${project.config.auth ? 'Enabled' : 'Disabled'}

## Deployment

This project can be deployed to Vercel, Netlify, or any platform that supports Next.js.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## Built with JcalAI

This project was generated using [JcalAI](https://jcalai.com), an AI-powered no-code platform by Innovix Dynamix.

## License

MIT
`;
  }

  private getPagePath(page: Page): string {
    if (page.is_home) {
      return 'app/page.tsx';
    }

    return `app${page.path}/page.tsx`;
  }

  private generatePageCode(page: Page, components: Component[]): string {
    return `export default function ${this.toPascalCase(page.name)}Page() {
  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold">${page.title || page.name}</h1>
      {/* Generated page content */}
    </main>
  );
}
`;
  }

  private generateComponentCode(component: Component): string {
    return `export interface ${component.name}Props {
  // Add props here
}

export function ${component.name}(props: ${component.name}Props) {
  return (
    <div>
      {/* ${component.description || component.name} */}
    </div>
  );
}
`;
  }

  private generateLayout(project: Project): string {
    return `import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.description || 'Built with JcalAI'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`;
  }

  private generateGlobalStyles(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
`;
  }

  private generateUtils(): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Exports project as a ZIP file
   */
  async exportAsZip(
    project: Project,
    pages: Page[],
    components: Component[]
  ): Promise<Blob> {
    // This would use a library like JSZip in a real implementation
    throw new Error('ZIP export not yet implemented');
  }

  /**
   * Exports project to a GitHub repository
   */
  async exportToGitHub(
    project: Project,
    pages: Page[],
    components: Component[],
    githubToken: string,
    repoName: string
  ): Promise<string> {
    // This would use GitHub API to create a repo and push code
    throw new Error('GitHub export not yet implemented');
  }
}

export const codeGenerator = new CodeGenerator();

