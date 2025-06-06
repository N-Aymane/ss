# SALESUCRE CO. E-commerce Website

A modern, full-stack e-commerce website built with Next.js 15, featuring a complete backend with database, authentication, and admin panel.

## 🚀 Features

- **Modern Frontend**: Built with Next.js 15, React 19, and Tailwind CSS
- **Complete Backend**: Database-driven with Prisma ORM and SQLite
- **Authentication**: JWT-based auth with secure password hashing
- **Admin Panel**: Full product and order management
- **Shopping Cart**: Real-time cart functionality
- **Product Drops**: Timed product releases and collections
- **Responsive Design**: Mobile-first design approach
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd clothing-ecommerce
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

*Note: We use `--legacy-peer-deps` due to React 19 compatibility with some packages.*

### Step 3: Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create `.env` manually with:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Admin credentials (for initial setup)
ADMIN_EMAIL="admin@salesucre.com"
ADMIN_PASSWORD="admin123"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Create and setup database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: `admin@salesucre.com`
- **Password**: `admin123`

### Admin Panel URLs
- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard` - Product management
- **Drops Management**: `/admin/drops` - Create and manage product drops
- **Site Settings**: `/admin/site-settings` - Configure site mode and featured drops

## 📁 Project Structure

```
clothing-ecommerce/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   │   ├── dashboard/     # Product management
│   │   ├── drops/         # Drop management
│   │   ├── login/         # Admin authentication
│   │   └── site-settings/ # Site configuration
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product CRUD operations
│   │   ├── drops/         # Drop CRUD operations
│   │   ├── cart/          # Shopping cart operations
│   │   └── orders/        # Order management
│   ├── shop/              # Public shop pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── admin/            # Admin-specific components
├── lib/                   # Utility functions
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication utilities
│   ├── products.ts       # Product functions
│   ├── drops.ts          # Drop functions
│   ├── cart.ts           # Cart utilities
│   └── toast.ts          # Toast notification system
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Database schema
├── scripts/              # Utility scripts
│   └── seed.ts          # Database seeding
└── public/              # Static assets
```

## 🗄️ Database Schema

The application uses the following main models:

- **Product**: Store products with variants (colors, sizes, categories)
- **Drop**: Product collections with release dates
- **User**: Customer and admin accounts with authentication
- **Cart**: Real-time shopping cart functionality
- **Order**: Complete order management system
- **SiteSettings**: Global site configuration (closed mode, featured drops)

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed database with sample data
npm run db:studio      # Open Prisma Studio

# Other
npm run lint           # Run ESLint
```

## ✨ Features

### 🛍️ E-commerce Features
- **Product Catalog**: Browse products with categories, colors, and sizes
- **Shopping Cart**: Add/remove items with real-time updates
- **Product Variants**: Multiple colors and sizes per product
- **Order Management**: Complete checkout and order tracking
- **Product Drops**: Timed product releases with countdown

### 🔧 Admin Features
- **Product Management**: Full CRUD operations with image upload
- **Drop Management**: Create and schedule product releases
- **Site Settings**: Toggle between normal and closed mode
- **User Management**: Admin authentication and access control
- **Real-time Updates**: Instant feedback with toast notifications

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean, professional design
- **Scrollable Dialogs**: Smooth scrolling for long forms
- **Toast Notifications**: Real-time feedback for all actions
- **Loading States**: Visual feedback during operations

## 🚀 Deployment

### Preparing for Production

1. **Update Environment Variables**:
   ```env
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-secure-jwt-secret-min-32-chars"
   NEXTAUTH_SECRET="your-secure-nextauth-secret"
   NEXTAUTH_URL="https://your-domain.com"
   ```

2. **Change Admin Credentials**:
   Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

3. **Build the Application**:
   ```bash
   npm run build
   ```

### Deployment Options

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Database Options for Production

- **PostgreSQL** (Recommended)
- **MySQL**
- **PlanetScale**
- **Supabase**

## 📤 Pushing to GitHub

### Step 1: Initialize Git Repository

```bash
git init
```

### Step 2: Create .gitignore

Ensure your `.gitignore` includes:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
/build
/.next/
/out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.db-journal

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### Step 3: Add and Commit Files

```bash
git add .
git commit -m "Initial commit: SALESUCRE CO. e-commerce website with complete backend"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it (e.g., "salesucre-ecommerce")
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### Step 5: Push to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/yourusername/salesucre-ecommerce.git

# Push to main branch
git branch -M main
git push -u origin main
```

## 🔒 Security Considerations

- Change default admin credentials before production
- Use strong JWT secrets (minimum 32 characters)
- Enable HTTPS in production
- Regularly update dependencies
- Use environment variables for sensitive data

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: The app will automatically try the next available port
2. **Database connection issues**: Ensure the database file has proper permissions
3. **Prisma client issues**: Run `npm run db:generate` to regenerate the client
4. **Authentication errors**: Check JWT_SECRET is set correctly
5. **Build errors**: Try deleting `.next` folder and rebuilding

### Getting Help

- Check the console for error messages
- Ensure all environment variables are set correctly
- Verify database is properly seeded
- Check that all dependencies are installed

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Drop Endpoints
- `GET /api/drops` - Get all drops
- `POST /api/drops` - Create drop (admin only)
- `PUT /api/drops/[id]` - Update drop (admin only)
- `DELETE /api/drops/[id]` - Delete drop (admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update cart item quantity
- `DELETE /api/cart/[itemId]` - Remove item from cart

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order from cart

## 🧪 Testing

### Manual Testing Checklist

- [ ] Admin login with correct credentials
- [ ] Create, edit, and delete products
- [ ] Create, edit, and delete drops
- [ ] Add products to cart
- [ ] Complete checkout process
- [ ] Toggle site settings
- [ ] Test responsive design on mobile

### Running Tests

```bash
# Add your test commands here when implemented
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database with [Prisma](https://prisma.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ using Next.js, Prisma, and modern web technologies.**

## 📈 Roadmap

### Planned Features
- [ ] Payment processing (Stripe/PayPal)
- [ ] Email notifications
- [ ] Inventory management
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Social media integration
- [ ] SEO optimization
