# Trips App

A Next.js application for trip planning and management, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Home Page**: Welcome landing page with navigation to trips and admin
- **Trips**: Dynamic route for individual trip pages (`/trips/[slug]`)
- **Admin Dashboard**: Administrative interface with shadcn/ui components
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deployment**: Netlify with Next.js runtime

## Prerequisites

- Node.js 18.18.0 or higher (Next.js 15 requires Node.js ^18.18.0 || ^19.8.0 || >= 20.0.0)
- npm or yarn package manager

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chrisaug-trips-app/nextjs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Routes

- `/` - Home page with navigation
- `/trips/[slug]` - Individual trip pages (dynamic routing)
- `/admin` - Admin dashboard with shadcn/ui components

## Building for Production

```bash
npm run build
```

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Connect your repository to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
3. **Deploy**

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build and deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

### Option 3: Deploy via Git push (Auto-deploy)

1. **Set up auto-deploy in Netlify**
2. **Push to your main branch**
3. **Netlify will automatically build and deploy**

## Environment Variables

No environment variables are required for basic functionality. If you need to add API keys or other sensitive data later, create a `.env.local` file:

```bash
# .env.local
NEXT_PUBLIC_API_URL=your_api_url
```

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── admin/            # Admin dashboard
│   ├── trips/[slug]/     # Dynamic trip routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
└── lib/                  # Utility functions
    └── utils.ts          # shadcn/ui utilities
```

## Customization

### Adding New shadcn/ui Components

1. **Install the component**
   ```bash
   npx shadcn@latest add <component-name>
   ```

2. **Import and use in your pages**
   ```tsx
   import { ComponentName } from "@/components/ui/component-name"
   ```

### Styling

- **Tailwind CSS**: All styling is done through Tailwind utility classes
- **Custom CSS**: Add custom styles in `src/app/globals.css`
- **Component variants**: Use shadcn/ui's built-in variants for consistent theming

## Troubleshooting

### Common Issues

1. **Node version compatibility**
   - Ensure you're using Node.js 18.18.0 or higher
   - Next.js 15 requires Node.js ^18.18.0 || ^19.8.0 || >= 20.0.0
   - Update Node.js if needed: [nodejs.org](https://nodejs.org)
   - Current Node.js version: `node --version`

2. **Build errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Netlify deployment issues**
   - Check build logs in Netlify dashboard
   - Verify `netlify.toml` configuration
   - Ensure all dependencies are in `package.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
