# Flamingo Devs - Landing Page

Modern, high-conversion landing page for Flamingo Devs, built with Next.js 14+, Tailwind CSS, and inspired by Linear.app's design aesthetic.

## Features

- **Multi-language Support**: English, Spanish, and Portuguese (using next-intl)
- **Modern Design**: Linear-inspired minimal aesthetic with clean typography
- **High Performance**: Static generation with Next.js App Router
- **Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, Open Graph, and hreflang support
- **Contact Form**: API route ready for integration with email services
- **Accessibility**: Focus states, semantic HTML, and keyboard navigation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Deployment**: Vercel-ready

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routing
│   │   ├── layout.tsx      # Root layout with i18n provider
│   │   ├── page.tsx        # Main landing page
│   │   └── not-found.tsx   # 404 page
│   ├── api/
│   │   └── contact/        # Contact form API
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── Services.tsx        # Services grid
│   ├── About.tsx           # About section
│   ├── Portfolio.tsx       # Portfolio showcase
│   ├── Trust.tsx           # Trust indicators
│   ├── Contact.tsx         # Contact form
│   ├── Footer.tsx          # Footer
│   └── LanguageSwitcher.tsx
├── i18n/
│   ├── config.ts           # Locale configuration
│   └── request.ts          # next-intl request config
├── middleware.ts           # Locale routing middleware
└── navigation.ts           # Typed navigation helpers
messages/
├── en.json                 # English translations
├── es.json                 # Spanish translations
└── pt.json                 # Portuguese translations
```

## Customization

### Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --flamingo: #ff6b9d;      /* Brand accent color */
  --accent: #5e6ad2;        /* Secondary accent */
  --background: #f4f5f8;    /* Page background */
  --foreground: #232326;    /* Text color */
}
```

### Content

Update translations in the `messages/` directory to customize text content for each language.

### Contact Form

The contact form API route (`src/app/api/contact/route.ts`) is ready for integration with:
- Email services (Resend, SendGrid, etc.)
- Webhooks
- CRM systems
- Databases

## Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import in Vercel
3. Deploy

Environment variables (optional):
- `CONTACT_WEBHOOK_URL`: Webhook URL for contact form submissions

## License

MIT
