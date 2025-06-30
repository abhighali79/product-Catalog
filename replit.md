# Sai Infotech Product Catalog

## Overview

This is a full-stack product catalog web application for "Sai Infotech," a computer and electronics service shop. The application allows public users to browse products without authentication, while providing admin users with complete CRUD operations through a secure admin panel. The system includes image uploading via Cloudinary and integrates WhatsApp contact functionality for customer inquiries.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build tool
- **UI Library**: shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL (configured for Neon hosting)
- **ORM**: Drizzle ORM with type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload**: Multer for handling multipart/form-data with Cloudinary integration

### Project Structure
- `client/` - Frontend React application
- `server/` - Backend Express.js API
- `shared/` - Shared types and schemas between frontend and backend
- `migrations/` - Database migration files

## Key Components

### Database Schema
- **Users Table**: Stores admin user credentials with bcrypt-hashed passwords
- **Products Table**: Contains product information including name, description, price, category, images array, status (in_stock/low_stock/out_of_stock), and featured flag

### Authentication System
- JWT token-based authentication for admin access
- Token stored in localStorage with automatic header injection
- Protected routes with authentication middleware
- Admin setup endpoint for initial user creation

### Product Management
- **Public Interface**: Product browsing with search and category filtering
- **Admin Interface**: Full CRUD operations with product form modal
- **Image Upload**: Multiple image support via Cloudinary integration
- **Status Management**: Inventory status tracking (in stock, low stock, out of stock)

### Image Handling
- Cloudinary integration for image storage and optimization
- Multer middleware for handling file uploads
- Support for multiple images per product
- Image URL storage in database arrays

## Data Flow

1. **Public Product Browsing**:
   - Frontend fetches products via GET `/api/products`
   - Optional search and category query parameters
   - No authentication required

2. **Admin Authentication**:
   - Login form submits credentials to POST `/api/auth/login`
   - Server validates credentials and returns JWT token
   - Token stored in localStorage for subsequent requests

3. **Product Management**:
   - Admin creates/updates products via POST/PUT `/api/admin/products`
   - Images uploaded separately to `/api/upload` endpoint
   - Cloudinary URLs stored in product records

4. **WhatsApp Integration**:
   - Product cards include pre-filled WhatsApp contact links
   - Phone number: +91 7411180528
   - Dynamic product-specific messages

## External Dependencies

### Core Framework Dependencies
- React ecosystem: `react`, `@vitejs/plugin-react`, `vite`
- UI Components: `@radix-ui/*` suite for accessible primitives
- Form handling: `react-hook-form`, `@hookform/resolvers`, `zod`
- HTTP client: `@tanstack/react-query`
- Routing: `wouter`

### Backend Dependencies
- Express.js server framework
- Database: `@neondatabase/serverless`, `drizzle-orm`
- Authentication: `jsonwebtoken`, `bcrypt`
- File upload: `multer`, `cloudinary`
- Development: `tsx` for TypeScript execution

### Styling and Utilities
- Tailwind CSS with PostCSS
- `class-variance-authority` for component variants
- `clsx` and `tailwind-merge` for conditional classes

## Deployment Strategy

### Environment Configuration
- Database URL for Neon PostgreSQL connection
- Cloudinary credentials (cloud name, API key, API secret)
- JWT secret for token signing
- Environment variables for both development and production

### Build Process
- Frontend: Vite build to `dist/public`
- Backend: esbuild compilation to `dist/`
- Shared schemas accessible to both environments
- TypeScript compilation checking

### Database Management
- Drizzle migrations in `migrations/` directory
- Schema definitions in `shared/schema.ts`
- Database push command: `npm run db:push`

## Recent Changes
- June 30, 2025: Complete application implementation with all requested features
  - Product detailed page with image gallery and multiple image support
  - Mobile-optimized layout (2 products per row on mobile, responsive grid)
  - Shop location section added before footer with contact information
  - Performance optimizations: lazy loading, image optimization, reduced bundle size
  - Authentication system fully functional with JWT tokens
  - Cloudinary integration working for image uploads
  - WhatsApp integration with pre-filled messages
  - Deploy-ready configuration for Render platform
  - Database schema finalized with products and admin tables

## Deployment Configuration
- Render.yaml configured for production deployment
- Environment variables: DATABASE_URL, CLOUDINARY credentials
- Build scripts optimized for production
- Performance enhancements: 5-minute cache, error retry logic
- Mobile-first responsive design implementation

## User Preferences

Preferred communication style: Simple, everyday language.