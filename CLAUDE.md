# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for Flávia Guedes, featuring a multi-language e-commerce site with gift card purchasing functionality. The application uses TypeScript, Tailwind CSS, and integrates with Stripe for payments and Firebase for authentication.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (includes Prisma generation)
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Run Prisma migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## Architecture and Project Structure

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom theme colors (gold, graphite, grayMedium)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe integration
- **Authentication**: Firebase Auth
- **Internationalization**: next-intl with 'en' and 'pt' locales
- **Animations**: GSAP and Framer Motion

### Directory Structure
- `src/app/`: Next.js app router pages and API routes
  - `[locale]/`: Internationalized pages (success, cancel)
  - `adm/`: Admin dashboard
  - `api/`: API endpoints for gift cards and Stripe checkout
- `src/components/`: React components (Hero, Gallery, About, etc.)
  - `ui/`: Reusable UI components
- `src/i18n/`: Internationalization configuration
- `messages/`: Translation JSON files for each locale
- `prisma/`: Database schema and migrations

### Key Patterns

1. **Internationalization**: All user-facing pages use the `[locale]` dynamic segment pattern with next-intl
2. **API Routes**: Located in `src/app/api/` following Next.js App Router conventions
3. **Database**: Uses Prisma with PostgreSQL, GiftCard model for tracking purchases
4. **Styling**: Tailwind CSS with custom theme configuration, uses CSS-in-JS for complex animations
5. **Path Aliases**: Uses `@/*` to reference `src/*` directory

### Environment Variables Required
- `POSTGRES_URL`: PostgreSQL connection string
- Firebase configuration variables
- Stripe API keys

### Important Notes
- The build process requires Prisma client generation before Next.js build
- Application supports English and Portuguese languages with automatic locale detection
- Custom color scheme: background (#0A0A0A), foreground (#EDEDED), gold (#C8A04B)
- Uses Work Sans and Merriweather fonts

## Git Commit Rules

### CRITICAL: Simple and Direct Commit Messages

**ALWAYS use short commits without extra metadata:**

✅ **CORRECT:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation issue"
git commit -m "refactor: simplify payment logic"
```

❌ **AVOID:**
- Unnecessary multi-line messages
- Tool metadata (Co-Authored-By, Generated with, etc)
- Emojis or special formatting
- AI tool references

### Conventional Commits Format

**Format:** `<type>(<optional scope>): <description>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code restructuring without functional change
- `perf`: Performance improvement
- `test`: Adding/fixing tests
- `chore`: Maintenance, dependencies
- `build`: Build system changes

### Commit Rules
1. **Always in English**
2. **Concise message (50-72 characters)**
3. **Use imperative mood** ("add" not "added" or "adding")
4. **Be specific** (not "fix bug" or "update files")
5. **NEVER add automatic attributions or metadata**
6. **NEVER use HEREDOC or complex formatting**

### Examples:
```bash
git commit -m "feat: add password recovery"
git commit -m "fix: prevent form double submission"
git commit -m "refactor: extract shared modal logic"
git commit -m "style: improve button spacing"
git commit -m "docs: update setup instructions"
```

### IMPORTANT: GitHub Trigger
**When the user types "github"**: EXECUTE a git commit immediately with the recent changes, don't explain the rules. Just run:
1. `git status` to check changes
2. `git add .` or specific files
3. `git commit -m "type: description"` following the rules above
4. Report the commit was made