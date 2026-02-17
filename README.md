# Nexus SaaS - Multi-Tenant Business Management Platform

A production-ready, multi-tenant SaaS platform for deploying customized business websites and management tools. Built with Next.js 16, Prisma, PostgreSQL, and TypeScript.

## 📌 Current Project Status Docs

- Session context: `README_CHAT_CONTEXT.md`
- Work completed and pending backlog: `README_WORK_DONE_PENDING.md`

## ✅ Current Status

- `npm run lint`: passing
- `npm run type-check`: passing
- `npm run build`: passing
- Note: webhook idempotency now depends on the `WebhookEvent` table migration.

## 🌟 Features

### Multi-Tenancy Architecture
- **Schema-based isolation** using PostgreSQL and Prisma
- **Subdomain routing** (`tenant.yourdomain.com`)
- **Custom domain mapping** support
- **Feature flags** for granular tenant control
- **Role-based access control (RBAC)** with 50+ permissions

### Core Modules
- 🌐 **Website Builder** - Drag-and-drop page builder with templates
- 💰 **Finance** - Invoicing, expenses, and financial reporting
- 👥 **HR & Employees** - Employee management, payroll, and attendance
- 📦 **Inventory** - Product tracking and stock management
- 🤝 **CRM** - Customer and lead management
- 📊 **Analytics** - Business insights and metrics
- 📋 **Projects & Tasks** - Project management tools
- ⚡ **Automation** - Workflow automation

### Admin Features
- **Super Admin Panel** - Tenant management and provisioning
- **Feature Management** - Toggle features per tenant
- **Subscription Management** - Plan and billing tracking
- **Audit Logging** - Comprehensive activity tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nexus-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/nexus_saas"
   
   # NextAuth
   AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
   
   # App URL
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Seed permissions (optional)**
   ```bash
   node prisma/seed-permissions.mjs
   ```

6. **Create default tenant (optional)**
   ```bash
   npm run dev
   # Navigate to /admin and create a tenant with slug "default"
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Architecture

### Multi-Tenancy Model

Nexus SaaS uses a **hybrid multi-tenancy approach**:

- **Shared Infrastructure**: All tenants share the same Next.js application and database instance
- **Data Isolation**: Each tenant's data is isolated via `tenantId` foreign keys
- **Tenant Resolution**: Subdomain-based routing identifies the active tenant
- **Feature Flags**: Granular control over enabled features per tenant

### Database Schema

The database is organized into three layers:

1. **Platform Layer** - Cross-tenant data (users, tenants, subscriptions)
2. **Tenant Layer** - Tenant-specific data (contacts, invoices, employees)
3. **Permission Layer** - RBAC permissions and role assignments

Key models:
- `Tenant` - Tenant configuration and metadata
- `TenantUser` - User-to-tenant memberships
- `TenantFeature` - Feature flags per tenant
- `Permission` & `RolePermission` - RBAC system

### Authentication & Authorization

- **Authentication**: NextAuth v5 with credentials provider
- **Session Management**: JWT-based sessions
- **Tenant Context**: Resolved from subdomain or custom domain
- **Authorization**: 
  - Super Admin: Platform owner with full access
  - Tenant Admin: Full access within their tenant
  - Tenant User: Role-based permissions

## 🛠️ Development

### Project Structure

```
nexus-saas/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration history
│   └── seed-permissions.mjs    # Permission seeder
├── src/
│   ├── actions/                # Server actions
│   │   ├── tenants.ts          # Tenant management
│   │   ├── features.ts         # Feature flags
│   │   ├── site.ts             # Website builder
│   │   └── ...
│   ├── app/                    # Next.js app routes
│   │   ├── admin/              # Super admin panel
│   │   ├── builder/            # Website builder
│   │   ├── finance/            # Finance module
│   │   ├── hr/                 # HR module
│   │   └── ...
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utilities
│   │   ├── prisma.ts           # Prisma client
│   │   ├── tenant.ts           # Tenant resolution
│   │   ├── features.ts         # Feature flags helpers
│   │   └── tenant-auth.ts      # Auth utilities
│   ├── auth.ts                 # NextAuth configuration
│   └── proxy.ts               # Next.js 16 request proxy
├── templates/                  # Website templates
│   ├── restaurant.json
│   ├── salon.json
│   └── portfolio.json
└── .github/
    └── workflows/
        └── ci.yml              # CI/CD pipeline
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # Run TypeScript checks
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev --name <name>  # Create migration
```

### Adding a New Module

1. Create database models in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_module`
3. Create UI page in `src/app/module-name/page.tsx`
4. Create server actions in `src/actions/module-name.ts`
5. Add feature flag in `src/lib/features.ts`
6. Add permissions in `prisma/seed-permissions.mjs`

## 🔐 Security

### Implemented Protections
- ✅ SQL Injection: Prisma parameterized queries
- ✅ XSS: React automatic escaping
- ✅ CSRF: NextAuth CSRF tokens
- ✅ Authentication: Secure password hashing (bcrypt)
- ✅ Tenant Isolation: Row-level filtering
- ✅ Audit Logging: All critical actions tracked

### Recommended Additions
- [ ] Rate limiting (Upstash Redis)
- [ ] Input sanitization (DOMPurify)
- [ ] 2FA for admin accounts
- [ ] Security headers (CSP, HSTS)

## 🎨 UI/UX

- **Design System**: Shadcn UI + Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theme
- **Color Scheme**: Indigo/Purple gradients with dark mode
- **Animations**: Framer Motion for micro-interactions
- **Icons**: Lucide React

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Options
- **Neon**: Serverless PostgreSQL with connection pooling
- **Supabase**: PostgreSQL with built-in auth (disable if using NextAuth)
- **Railway**: Simple PostgreSQL hosting

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="random-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create tenant as super admin
- [ ] Login as tenant user
- [ ] Verify data isolation between tenants
- [ ] Test feature flags (disable/enable modules)
- [ ] Apply website template
- [ ] Create records in each module
- [ ] Check audit logs

### CI/CD Pipeline

GitHub Actions workflow runs on every push:
- ESLint checks
- TypeScript type checks
- Prisma schema validation
- Production build test

## 📄 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using Next.js, Prisma, and PostgreSQL**
