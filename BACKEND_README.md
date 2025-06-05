# E-commerce Backend Documentation

## Overview

This is a complete backend implementation for the SALESUCRE CO. e-commerce website built with:

- **Next.js 15** - Full-stack React framework
- **Prisma** - Database ORM
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety

## Database Schema

### Core Models

- **Product** - Store products with variants (colors, sizes)
- **Drop** - Product collections with release dates
- **User** - Customer and admin accounts
- **Cart** - Shopping cart functionality
- **Order** - Order management
- **SiteSettings** - Global site configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update cart item quantity
- `DELETE /api/cart/[itemId]` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order from cart

## Setup Instructions

### 1. Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ADMIN_EMAIL="admin@salesucre.com"
ADMIN_PASSWORD="admin123"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 3. Development

```bash
# Start development server
npm run dev

# View database in Prisma Studio
npm run db:studio
```

## Admin Access

Default admin credentials:
- Email: `admin@salesucre.com`
- Password: `admin123`

## Features Implemented

### ✅ Core E-commerce Features
- Product catalog with variants
- Shopping cart functionality
- Order management
- User authentication
- Admin panel integration

### ✅ Advanced Features
- Drop/collection management
- Site settings (closed mode)
- Proper data relationships
- Type-safe API endpoints
- Password hashing
- JWT authentication

### ✅ Database Features
- Relational data modeling
- Proper foreign keys
- Cascade deletes
- Unique constraints
- JSON field storage for arrays

## Database Migrations

To modify the database schema:

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Run `npm run db:generate` to update Prisma client

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-secure-jwt-secret"
NEXTAUTH_SECRET="your-secure-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Database Options

The current setup uses SQLite for development. For production, consider:

- **PostgreSQL** (recommended)
- **MySQL**
- **PlanetScale**
- **Supabase**

Simply change the `DATABASE_URL` and update the `provider` in `prisma/schema.prisma`.

## API Usage Examples

### Adding to Cart

```javascript
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product-id',
    quantity: 1,
    size: 'M',
    color: 'black'
  })
})
```

### Creating an Order

```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shippingName: 'John Doe',
    shippingEmail: 'john@example.com',
    shippingAddress: '123 Main St, City, State 12345'
  })
})
```

## Security Features

- HTTP-only cookies for JWT tokens
- Password hashing with bcrypt
- Admin-only endpoints protection
- Input validation
- SQL injection prevention (Prisma)

## Next Steps

Consider implementing:
- Payment processing (Stripe/PayPal)
- Email notifications
- Inventory management
- Product reviews
- Wishlist functionality
- Advanced search/filtering
- Image upload handling
