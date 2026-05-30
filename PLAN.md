# TagX — Fullstack MVP Plan

> **TagX**: Smart tracking tags for the real world. Find what matters.™  
> Pitch-ready MVP with AI features, built in 4 phases.

---

## Current State

| Area | Status |
|---|---|
| **Frontend** | Bare Vite + React 19 scaffold. `App.tsx` and `main.tsx` only. No routing, no styling, no components. |
| **Backend** | Empty `package.json` — no deps, no server, no structure. |
| **Design** | Nothing yet. Will follow frontend-design skill — bold, distinctive, production-grade. |
| **Infra** | No `.env`, no root-level `.gitignore`, no linting for backend. |

---

## Design Direction (Frontend-Design Skill)

> **Aesthetic**: **"Stealth-Luxury Tech"** — Think matte-black product shots floating in negative space, surgical precision typography, and mercury-like liquid animations. The vibe is Apple-meets-Dieter-Rams: obsessively minimal but magnetically premium.

**Differentiation**: A tag that does more than track — it _learns_ your habits and _predicts_ where you'll leave things behind. The AI angle is the hook that wins the panel.

| Token | Choice |
|---|---|
| **Theme** | Dark-mode dominant. `#0A0A0B` base, `#141416` surface, electric cyan `#00E5FF` accent, warm amber `#FFB347` secondary. |
| **Display Font** | **Clash Display** (Indian Type Foundry) — geometric, bold, editorial feel. |
| **Body Font** | **Satoshi** — clean, modern, excellent readability. |
| **Motion** | Framer Motion — page transitions, scroll-reveal, staggered card entrances, magnetic cursor effects on CTAs. |
| **Layout** | Asymmetric hero grids, full-bleed product sections, overlapping elements, diagonal flow for product showcase. |
| **Signature Detail** | A subtle animated **radar-ping** effect on CTAs and product cards — reinforcing "we help you find things." |
| **Backgrounds** | Gradient meshes + subtle noise grain. Product shot overlays with depth layers. Glassmorphism on nav/surfaces. |

> This design direction is intentionally opinionated per the frontend-design skill.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion |
| Routing | React Router v7 |
| State | Zustand (cart, auth, UI state) |
| Forms | React Hook Form + Zod validation |
| HTTP | Axios |
| Backend | Node.js + Express + TypeScript (ES modules) |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) + bcryptjs |
| AI | Groq SDK (LLaMA-based, free for testing) |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer (forgot-password OTP) |
| Deployment | Frontend → Vercel, Backend → Render, DB → MongoDB Atlas |

---

## Phase 1 — Project Scaffolding & Infrastructure

> Goal: Both frontend and backend properly structured, all deps installed, tooling configured, ready to build.

### Frontend (`/frontend`)

- [x] Vite + React + TypeScript scaffolded

#### Dependencies to Install

```
react-router-dom           # Client-side routing
framer-motion              # Animations & page transitions
zustand                    # Lightweight state management (cart, auth, UI)
react-hook-form            # Form handling
@hookform/resolvers        # Zod resolver for react-hook-form
zod                        # Schema validation
axios                      # HTTP client
lucide-react               # Icon library (shadcn default)
clsx                       # Conditional class utility
tailwind-merge             # Merge tailwind classes without conflicts
class-variance-authority   # Component variant management (shadcn pattern)
sonner                     # Toast notifications
@radix-ui/react-slot       # Slot primitive (shadcn foundation)
@tanstack/react-query      # Server state management
ai + @ai-sdk/groq          # AI SDK (Groq for testing/pitch)
```

**Dev Dependencies:**
```
tailwindcss@4              # Tailwind CSS v4
@tailwindcss/vite          # Vite plugin for Tailwind v4
autoprefixer               # CSS autoprefixer
```

#### Frontend Folder Structure

```
frontend/src/
├── assets/                  # Static images, fonts, SVGs
│   ├── fonts/
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/                  # shadcn/ui primitives (Button, Input, Card, etc.)
│   ├── common/              # Shared components (Logo, Loader, ErrorBoundary)
│   └── layout/              # Layout shells (Navbar, Footer, PageWrapper)
├── features/                # Feature-based modules
│   ├── auth/                # Login, Signup, ForgotPassword components
│   ├── home/                # Hero, Features, Testimonials, CTA sections
│   ├── products/            # ProductCard, ProductGrid, ProductDetail
│   ├── cart/                # CartDrawer, CartItem, CartSummary
│   ├── ai/                  # AI Chat widget, AI product recommendations
│   └── tracking/            # Live tracking demo/map component
├── hooks/                   # Custom React hooks (useAuth, useCart, useAI)
├── lib/
│   ├── utils.ts             # cn() helper, formatters
│   ├── api.ts               # Axios instance with interceptors
│   └── constants.ts         # App-wide constants
├── pages/                   # Route-level page components
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── DashboardPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── NotFoundPage.tsx
├── stores/                  # Zustand stores
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── uiStore.ts
├── styles/
│   └── globals.css          # Tailwind directives, CSS variables, font imports
├── types/                   # TypeScript type definitions
│   ├── auth.types.ts
│   ├── product.types.ts
│   ├── cart.types.ts
│   └── api.types.ts
├── App.tsx                  # Root component with router
├── main.tsx                 # Entry point
└── router.tsx               # Route definitions
```

#### Configuration Files

| File | Purpose |
|---|---|
| `frontend/.env.example` | Template: `VITE_API_URL`, `VITE_GROQ_API_KEY` |
| `frontend/.env.local` | Actual env values (gitignored) |
| `frontend/src/styles/globals.css` | Tailwind v4 imports, CSS custom properties, font-face declarations |

---

### Backend (`/backend`)

#### Dependencies to Install

**Dependencies:**
```
express                   # Web framework
mongoose                  # MongoDB ODM
jsonwebtoken              # JWT generation & verification
bcryptjs                  # Password hashing
cors                      # CORS middleware
dotenv                    # Environment variables
helmet                    # Security headers
morgan                    # HTTP request logging
express-rate-limit        # Rate limiting
express-validator         # Request validation
multer                    # File uploads
cloudinary                # Image hosting
nodemailer                # Email service (forgot password)
groq-sdk                  # Groq AI API
cookie-parser             # Parse cookies (refresh tokens)
```

**Dev Dependencies:**
```
typescript                # TypeScript compiler
tsx                       # TypeScript execution (dev)
@types/express
@types/cors
@types/jsonwebtoken
@types/bcryptjs
@types/morgan
@types/multer
@types/cookie-parser
@types/nodemailer
@types/node
nodemon                   # Auto-restart on changes
eslint                    # Linting
@typescript-eslint/parser
@typescript-eslint/eslint-plugin
```

#### Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── env.ts             # Validated env variables
│   │   ├── cloudinary.ts      # Cloudinary config
│   │   └── mail.ts            # Nodemailer transporter
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Cart.ts
│   │   ├── Review.ts
│   │   ├── TrackingDevice.ts  # User-registered tags
│   │   ├── AILog.ts           # AI prediction logs
│   │   └── OTP.ts             # For forgot-password flow
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── review.routes.ts
│   │   ├── tracking.routes.ts
│   │   ├── ai.routes.ts
│   │   └── index.ts           # Route aggregator
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── review.controller.ts
│   │   ├── tracking.controller.ts
│   │   └── ai.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── email.service.ts
│   │   ├── tracking.service.ts
│   │   └── ai.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   ├── admin.middleware.ts    # Admin role check
│   │   ├── validate.middleware.ts # Request validation (express-validator)
│   │   ├── error.middleware.ts    # Global error handler
│   │   └── upload.middleware.ts   # Multer config
│   ├── utils/
│   │   ├── ApiError.ts           # Custom error class
│   │   ├── ApiResponse.ts        # Standardized responses
│   │   ├── asyncHandler.ts       # Async route wrapper
│   │   └── tokens.ts             # JWT token utilities
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   └── order.validator.ts
│   ├── types/
│   │   └── index.ts              # Express req extensions, custom types
│   ├── seeds/
│   │   └── seed.ts               # Seed products, demo user
│   └── server.ts                 # Express app bootstrap
├── .env.example
├── .env
├── tsconfig.json
├── nodemon.json
├── .eslintrc.json
└── package.json
```

#### Root-Level Files

| File | Location | Purpose |
|---|---|---|
| `.gitignore` | `/TagX/.gitignore` | Root gitignore covering both frontend & backend |
| `.env.example` | `backend/.env.example` | Template for backend env vars |
| `README.md` | `/TagX/README.md` | Project overview with setup instructions |

**Root `.gitignore` contents:**
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
.vscode/
.idea/
```

#### Backend Environment Variables

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
GROQ_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
NODE_ENV=development
```

---

## Phase 2 — UI Component Library (Tailwind + shadcn/ui)

> Goal: A complete design system with all reusable components installed and themed to match the "Stealth-Luxury Tech" aesthetic.

### Step 2.1 — Tailwind v4 Setup

**`frontend/src/styles/globals.css`**
- Import Tailwind v4 via `@import "tailwindcss"`
- Define CSS custom properties for the TagX theme:
  ```css
  @theme {
    --color-tagx-bg: #0A0A0B;
    --color-tagx-surface: #141416;
    --color-tagx-border: #2A2A2E;
    --color-tagx-text: #EAEAEA;
    --color-tagx-muted: #8A8A8E;
    --color-tagx-accent: #00E5FF;
    --color-tagx-warm: #FFB347;
    --color-tagx-danger: #FF4757;
    --color-tagx-success: #2ED573;
    --font-display: 'Clash Display', sans-serif;
    --font-body: 'Satoshi', sans-serif;
  }
  ```
- Font-face declarations for Clash Display + Satoshi (from assets or CDN)
- Noise/grain texture as `::before` overlay on body

**`frontend/vite.config.ts`**
- Add `@tailwindcss/vite` plugin

### Step 2.2 — shadcn/ui Initialization

Run `npx shadcn@latest init` to bootstrap shadcn. Then install:

| Component | Use Case |
|---|---|
| `button` | CTAs, form submits, nav actions |
| `input` | Text fields, search bars |
| `label` | Form labels |
| `card` | Product cards, feature cards, testimonials |
| `dialog` | Modals (quick view, confirm delete) |
| `dropdown-menu` | User menu, sort options |
| `sheet` | Cart drawer (slide-in from right) |
| `avatar` | User profile pictures |
| `badge` | Product tags ("New", "Best Seller", "AI-Powered") |
| `separator` | Visual dividers |
| `skeleton` | Loading states |
| `sonner` | Toast notifications |
| `tabs` | Product detail tabs (Specs, Reviews, FAQ) |
| `accordion` | FAQ sections |
| `select` | Dropdowns (color picker, quantity) |
| `checkbox` | Filters, terms agreement |
| `form` | shadcn form wrapper with react-hook-form + zod |
| `scroll-area` | Custom scrollable regions |
| `navigation-menu` | Main navbar |
| `carousel` | Product image gallery |
| `tooltip` | Hover hints |
| `progress` | Order tracking steps |
| `slider` | Price range filter |

### Step 2.3 — Custom Common Components

**`components/common/`**

| Component | Description |
|---|---|
| `Logo.tsx` | TagX logo with radar-ping animation |
| `Loader.tsx` | Full-screen and inline loading spinners |
| `ErrorBoundary.tsx` | Graceful error handling wrapper |
| `SectionHeading.tsx` | Reusable section title with accent underline |
| `AnimatedCounter.tsx` | Number counter animation (for stats) |
| `RadarPing.tsx` | The signature animated radar effect |
| `GradientBlob.tsx` | Decorative background mesh gradient blobs |
| `ParallaxImage.tsx` | Scroll-aware parallax product image |

**`components/layout/`**

| Component | Description |
|---|---|
| `Navbar.tsx` | Sticky navbar with logo, links, cart badge, user menu. Glassmorphic blur on scroll. |
| `Footer.tsx` | Multi-column footer with links, newsletter signup, social icons. |
| `PageWrapper.tsx` | Wraps each page with enter/exit animations (Framer Motion `AnimatePresence`). |
| `Container.tsx` | Max-width content wrapper. |
| `MobileNav.tsx` | Sheet-based mobile navigation. |
| `DashboardLayout.tsx` | Sidebar + main content for user dashboard |

---

## Phase 3 — Backend Architecture

> Goal: Fully functional API with authentication, product CRUD, cart, orders, tracking devices, AI integration, and proper middleware pipeline.

### Step 3.1 — Database Schema (MongoDB/Mongoose)

#### User Model
```typescript
{
  name: string;
  email: string;           // unique, indexed
  password: string;        // bcrypt hashed
  role: 'user' | 'admin';
  avatar?: string;         // Cloudinary URL
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  refreshToken?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Product Model
```typescript
{
  name: string;             // "TagX Pro", "TagX Mini", "TagX Pet"
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];         // Cloudinary URLs
  category: 'personal' | 'pet' | 'vehicle' | 'luggage' | 'kids';
  colors: { name: string; hex: string; }[];
  features: string[];
  specs: {
    battery: string;
    range: string;
    waterproof: string;
    weight: string;
    dimensions: string;
    connectivity: string;
  };
  stock: number;
  rating: number;           // Computed average
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Order Model
```typescript
{
  user: ObjectId;           // ref: User
  items: [{
    product: ObjectId;      // ref: Product
    quantity: number;
    price: number;
    color: string;
  }];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Cart Model
```typescript
{
  user: ObjectId;           // ref: User (one cart per user)
  items: [{
    product: ObjectId;      // ref: Product
    quantity: number;
    color: string;
  }];
  updatedAt: Date;
}
```

#### Review Model
```typescript
{
  user: ObjectId;           // ref: User
  product: ObjectId;        // ref: Product
  rating: number;           // 1-5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
}
```

#### TrackingDevice Model
```typescript
{
  user: ObjectId;           // ref: User
  product: ObjectId;        // ref: Product
  serialNumber: string;     // unique
  nickname: string;
  color: string;
  isActive: boolean;
  lastKnownLocation: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### OTP Model
```typescript
{
  email: string;
  otp: string;              // 6-digit code, hashed
  expiresAt: Date;          // 10-minute expiry
  createdAt: Date;          // TTL index auto-delete
}
```

#### AILog Model
```typescript
{
  user: ObjectId;           // ref: User
  type: 'prediction' | 'recommendation' | 'anomaly' | 'chat';
  input: string;
  output: string;
  model: string;
  createdAt: Date;
}
```

### Step 3.2 — Middleware Pipeline

```
Request
  → helmet()                    // Security headers
  → cors()                     // CORS policy
  → express.json()             // Body parsing
  → cookieParser()             // Cookie parsing
  → morgan('dev')              // Request logging
  → rateLimiter()              // Rate limiting (100 req/15min)
  → routes
      → validate.middleware    // Request validation (express-validator)
      → auth.middleware        // JWT verification (protected routes)
      → admin.middleware       // Admin role check (admin routes)
      → controller
  → error.middleware           // Global error handler (catches ApiError)
```

### Step 3.3 — API Routes

#### Auth Routes (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ✗ | Create account |
| POST | `/login` | ✗ | Login, returns access + refresh token |
| POST | `/logout` | ✓ | Clear refresh token |
| POST | `/refresh-token` | ✗ | Get new access token |
| POST | `/forgot-password` | ✗ | Send OTP to email |
| POST | `/reset-password` | ✗ | Verify OTP & reset password |
| GET | `/me` | ✓ | Get current user profile |
| PUT | `/me` | ✓ | Update profile |

#### Product Routes (`/api/v1/products`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✗ | List all products (pagination, filters, search) |
| GET | `/:slug` | ✗ | Get single product by slug |
| GET | `/featured` | ✗ | Get featured products |
| GET | `/categories` | ✗ | Get available categories |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

#### Cart Routes (`/api/v1/cart`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✓ | Get user cart |
| POST | `/add` | ✓ | Add item to cart |
| PUT | `/update` | ✓ | Update item quantity |
| DELETE | `/remove/:productId` | ✓ | Remove item from cart |
| DELETE | `/clear` | ✓ | Clear entire cart |

#### Order Routes (`/api/v1/orders`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✓ | Place order (from cart) |
| GET | `/` | ✓ | Get user's orders |
| GET | `/:id` | ✓ | Get single order |
| PUT | `/:id/status` | Admin | Update order status |

#### Review Routes (`/api/v1/reviews`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/product/:productId` | ✗ | Get reviews for a product |
| POST | `/product/:productId` | ✓ | Add review |
| DELETE | `/:id` | ✓ | Delete own review |

#### Tracking Routes (`/api/v1/tracking`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ✓ | Register a TagX device to user |
| GET | `/` | ✓ | Get user's registered tags |
| PUT | `/:id/location` | ✓ | Update tag location |
| GET | `/:id/history` | ✓ | Get location history |

#### AI Routes (`/api/v1/ai`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/chat` | ✓ | Chat with TagX AI assistant |
| POST | `/predict` | ✓ | Predict where user might leave tag behind |
| POST | `/anomaly` | ✓ | Detect unusual tag movement patterns |
| POST | `/recommend` | ✗ | Get product recommendations based on use-case |

### Step 3.4 — AI Integration (Groq)

The AI features serve as the **key differentiator** for the pitch:

1. **Habit Prediction** — "Given user's tag location history, predict when/where they might misplace the tagged item." Uses Groq LLaMA with a system prompt analyzing location patterns.

2. **Anomaly Detection** — Detect unusual tag movement (e.g., tag stopped moving at an unfamiliar location → potential lost item alert).

3. **TagX AI Assistant** — Chatbot widget that answers product questions, helps users pick the right tracker, and provides setup guidance.

4. **Smart Recommendations** — User describes their use case → AI recommends the best TagX product with reasoning.

**Backend**: `ai.service.ts` wraps Groq SDK with TagX product catalog as system context.  
**Frontend**: Floating chat widget (bottom-right) with dark UI, typing indicators, quick-action chips.

### Step 3.5 — Seed Script

Create `seeds/seed.ts` to populate:
- 5–6 TagX product variants (TagX Pro, TagX Mini, TagX Pet, TagX Vehicle, TagX Luggage, TagX Kids)
- 1 admin user + 1 demo user
- Sample reviews
- Product images (Cloudinary or placeholder URLs)

---

## Phase 4 — Frontend Pages & Features

> Goal: All user-facing pages built, connected to API, polished with animations.

### Step 4.1 — Routing Setup

```
/                  → HomePage
/products          → ProductsPage
/products/:slug    → ProductDetailPage
/cart              → CartPage
/checkout          → CheckoutPage (protected)
/login             → LoginPage
/signup            → SignupPage
/forgot-password   → ForgotPasswordPage
/dashboard         → DashboardPage (protected)
/dashboard/tags    → MyTagsPage (protected)
/dashboard/orders  → MyOrdersPage (protected)
/dashboard/settings → SettingsPage (protected)
/admin             → AdminDashboard (admin only)
/admin/products    → AdminProducts (admin only)
/admin/orders      → AdminOrders (admin only)
/admin/users       → AdminUsers (admin only)
/about             → AboutPage
/contact           → ContactPage
*                  → NotFoundPage
```

### Step 4.2 — Auth Pages

#### LoginPage `/login`
- Split-screen: left = immersive product visual, right = form
- Email + password with Zod validation via react-hook-form
- "Remember me" toggle
- Links to signup and forgot-password
- Access + refresh token flow via Zustand auth store
- Framer Motion page transition on success

#### SignupPage `/signup`
- Same split-screen aesthetic
- Name, email, password, confirm password
- Password strength indicator (animated bar)
- Terms & conditions checkbox
- Auto-login after successful registration

#### ForgotPasswordPage `/forgot-password`
- Step 1: Enter email → OTP sent
- Step 2: Enter 6-digit OTP → verify
- Step 3: New password + confirm → reset
- Animated step transitions with progress indicator

### Step 4.3 — Home Page (The Hero Pitch)

This is the **showstopper** — the page that sells TagX to the panel.

| Section | Description |
|---|---|
| **Hero** | Full-viewport dark section. Floating 3D-style TagX product image with magnetic cursor parallax. Bold "Never Lose What Matters" headline in Clash Display. Animated radar-ping behind product. Dual CTAs: "Shop Now" (accent) and "See How It Works" (ghost). |
| **Stats Bar** | Animated counters: "50K+ Users", "99.9% Recovery Rate", "1 Year Battery", "300ft Range". Slide in on scroll via Framer Motion. |
| **Product Showcase** | Horizontal scroll carousel of TagX variants. Cards have hover-reveal specs, price, "Add to Cart" quick action. |
| **How It Works** | 3-step process: 1) Attach TagX → 2) Open App → 3) Track Anywhere. Scroll-triggered animations. |
| **Features Grid** | Bento-grid: Precision Finding, Crowd GPS Network, Water Resistant, Long Battery, Universal Compatibility, Privacy First. Each tile with icon + micro-animation. |
| **AI Demo** | Interactive section: "Tell us what you want to track" — user types use-case, AI instantly recommends a product. Live recommendation engine demo. |
| **Testimonials** | Carousel of customer reviews with star ratings, avatar, name. Auto-play with pause on hover. |
| **Newsletter CTA** | Full-width gradient section with email signup. "Get 10% off your first TagX." |

### Step 4.4 — Products Page `/products`

- Grid/list view toggle
- Sidebar filters: category, price range (slider), rating, sort by
- Product cards with: image (hover-zoom), name, price, rating stars, quick "Add to Cart", color swatches, badges
- Pagination
- Search bar with instant results

### Step 4.5 — Product Detail Page `/products/:slug`

- Large image gallery (carousel + thumbnail strip)
- Color selector with live image swap
- Quantity selector
- "Add to Cart" + "Buy Now" CTAs
- Tabbed content: Description | Specifications | Reviews (with add-review form)
- Related products section
- Scroll-triggered Framer Motion animations

### Step 4.6 — Cart & Checkout

- **Cart**: Sheet drawer (slide from right) + full `/cart` page
  - Item list with image, name, color, quantity +/-, remove, subtotal
  - Cart summary: subtotal, shipping, tax, total
  - "Proceed to Checkout" CTA
- **Checkout** (`/checkout`, protected): Multi-step form
  - Step 1: Shipping address (react-hook-form + zod)
  - Step 2: Order review
  - Step 3: Confirmation (mock payment)

### Step 4.7 — User Dashboard (Protected)

- **Overview**: Registered tags, recent activity, AI insight card ("Habit-based predictions")
- **My Tags**: List of registered tags with status, register new tag modal/form, mock location display
- **My Orders**: Order history with status badges, order detail view
- **Settings**: Profile edit, password change

### Step 4.8 — Admin Panel (Admin Only)

- **Dashboard**: Sales overview, order count, user count
- **Products**: CRUD table with image upload via Cloudinary
- **Orders**: Manage order status
- **Users**: View/manage users

### Step 4.9 — Other Pages

- **About**: Brand story, mission, tech innovation, team
- **Contact**: Contact form, support info
- **404**: Creative "lost tracker" theme with radar-ping animation

### Step 4.10 — AI Chat Widget

- Floating button (bottom-right) with pulse animation
- Expands into dark-themed chat panel
- Message bubbles with typing indicator
- Predefined quick-action chips: "Help me choose", "Predict where I'll lose my keys", "Setup guide"
- Connects to backend `/api/v1/ai/chat`

### Features Checklist

- [ ] **Auth Flow**: Sign in → access token (memory) + refresh token (httpOnly cookie) → auto-refresh → logout
- [ ] **Protected Routes**: React Router guards with redirect to login
- [ ] **AI Demo**: Habit prediction, anomaly alert, product recommendation, chat assistant
- [ ] **Cart / Checkout**: Add/remove/update items, multi-step checkout, mock payment
- [ ] **Loading States**: Skeleton loaders (shadcn), spinner for mutations
- [ ] **Error States**: Error boundaries, form validation errors, API error toasts
- [ ] **Empty States**: "No items in cart", "No orders yet", "No tags registered"
- [ ] **Responsive**: Mobile-first, tablet, desktop breakpoints
- [ ] **SEO**: Meta tags, semantic HTML, structured data (JSON-LD)
- [ ] **Animations**: Framer Motion page transitions, scroll-reveal, hover effects, stagger children

---

## Architecture Diagram

```
Browser (React SPA)
    │
    ├── Public Routes     ─── Layout (Navbar + Footer)
    ├── Auth Routes       ─── AuthLayout
    ├── Protected Routes  ─── DashboardLayout (requires JWT)
    └── Admin Routes      ─── AdminLayout (requires admin role)
            │
    ┌───────┴───────┐
    │   Axios Instance (with interceptors)
    │   - Attaches Bearer token from Zustand store
    │   - 401 → attempts refresh token → redirect to login
    └───────┬───────┘
            │
    Express API Server (v1)
    ├── Middlewares
    │   ├── helmet
    │   ├── cors
    │   ├── rateLimiter
    │   ├── auth (JWT verify)
    │   ├── admin (role check)
    │   ├── validate (express-validator)
    │   └── errorHandler
    ├── Controllers → Services → Models (Mongoose → MongoDB Atlas)
    ├── AI Service → Groq SDK (LLaMA)
    └── Email Service → Nodemailer
```

---

## Deployment Strategy

| Service | Target | Config |
|---|---|---|
| **Vercel** | Frontend | Auto-deploy from GitHub. Env: `VITE_API_URL` |
| **Render** | Backend | Node.js web service. Env: MongoDB URI, JWT secrets, Groq key, Cloudinary creds, SMTP creds |
| **MongoDB Atlas** | Database | Free tier (M0), cloud-hosted, IP whitelist for Render |
| **Cloudinary** | Images | Free tier, product image CDN |

---

## Verification Plan

| Phase | Verification |
|---|---|
| **Phase 1** | `npm run dev` starts both frontend and backend without errors. ESLint passes. TypeScript compiles. |
| **Phase 2** | All shadcn components render correctly. Tailwind classes apply. Theme tokens work. Fonts load. |
| **Phase 3** | All API endpoints tested via REST client. Auth flow works end-to-end (register → login → refresh → logout → forgot-password). Seed script populates DB. |
| **Phase 4** | Full user journey: Signup → Browse → Add to Cart → Checkout → Dashboard. Auth guards work. AI chat responds. Responsive on mobile. Build succeeds. |

### Build Commands
```bash
# Frontend
cd frontend && npm run build   # Should produce dist/ without errors

# Backend
cd backend && npx tsc --noEmit # Type check without errors
```

---

## Execution Order

```
Phase 1: Scaffold → Phase 2: UI Components → Phase 3: Backend API → Phase 4: Frontend Pages → Deploy
```

Each phase is a checkpoint — verify before moving to the next.

---

## Timeline Estimate

| Phase | Tasks | Est. Time |
|---|---|---|
| **Phase 1** | Scaffold frontend + backend, install all deps | 1 day |
| **Phase 2** | Tailwind v4 + shadcn setup, theme, common components | 1–2 days |
| **Phase 3** | All DB schemas, middleware, auth flow, API routes, AI service, seed script | 3–4 days |
| **Phase 4** | All pages, AI feature UI, dashboard, admin, cart/checkout, polish | 4–5 days |
| **Buffer** | Testing, bug fixes, deployment, pitch prep | 2 days |
| **Total** | | **~10–14 days** |

---

## Key Selling Points for Pitch

1. **AI-Powered Predictions** — Not just a tracker, it's a habit-aware assistant that predicts when/where you'll lose things
2. **Premium Design** — "Stealth-Luxury Tech" aesthetic that justifies premium pricing
3. **Complete E-Commerce MVP** — Real auth (access+refresh tokens), cart, checkout, order management
4. **Full Product Ecosystem** — Multiple TagX variants for different use cases (personal, pet, vehicle, luggage, kids)
5. **Scalable Architecture** — Modern stack (React 19 + Vite 8 + Node + MongoDB + TypeScript), ready for production
6. **Market Fit** — Lost keys/phone/pet is universal; AI prediction is the differentiator that no competitor has
