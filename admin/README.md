# Library Management System - Admin Panel

A modern, production-ready Angular admin dashboard for managing a library system. Built with Angular 18+, Tailwind CSS, and Lucide Icons.

## 🚀 Features

- **Authentication**: Login/Signup with JWT token management
- **Dashboard**: Real-time statistics and overview
- **Books Management**: Create, read, update, delete books
- **Genre Management**: Manage book categories and subcategories
- **User Management**: View all registered users
- **Loans Management**: Track book checkouts and returns
- **Subscriptions**: Manage user subscriptions and plans
- **Payments**: Monitor payment transactions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-Based Access**: Admin guard for protected routes
- **Modern UI**: Built with Tailwind CSS and Lucide Icons

## 📋 Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── guards/          # Route guards (auth, admin)
│   │   ├── interceptors/    # JWT interceptor
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # API services
│   ├── shared/              # Shared components and pipes
│   ├── features/            # Feature modules
│   │   ├── auth/            # Login/Signup
│   │   ├── dashboard/       # Dashboard
│   │   ├── users/           # User management
│   │   ├── books/           # Books management
│   │   ├── genres/          # Genres management
│   │   ├── loans/           # Book loans
│   │   ├── subscriptions/   # Subscriptions
│   │   ├── subscription-plans/ # Plans
│   │   └── payments/        # Payments
│   ├── layout/              # Layout components
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   └── footer/
│   ├── app.component.ts
│   └── app.routes.ts        # Main routing
├── environments/            # Environment configs
├── main.ts                  # Bootstrap
├── index.html
└── styles.css              # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Configure Environment
Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // Your backend URL
  jwtTokenKey: 'library_admin_token',
};
```

### 3. Install Tailwind CSS (if not already done)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Start Development Server
```bash
npm start
```

The application will run on `http://localhost:4200`

## 📦 Dependencies

### Main Dependencies
- **@angular/core**: v18.x - Core Angular framework
- **@angular/router**: v18.x - Routing
- **@angular/forms**: v18.x - Reactive forms
- **@angular/common**: v18.x - Common utilities
- **rxjs**: v7.8.x - Reactive programming
- **tailwindcss**: v3.4.x - Utility-first CSS
- **lucide-angular**: v1.0.x - Icons

### Dev Dependencies
- **@angular/cli**: v18.x - CLI
- **typescript**: v5.4.x - TypeScript
- **jasmine**: Testing framework
- **karma**: Test runner

## 🔐 Authentication

### JWT Token
- Tokens are automatically added to all requests via the JWT interceptor
- Stored in localStorage under the key defined in `environment.jwtTokenKey`
- Extracted from `AuthResponse.jwt` on login/signup

### Route Guards
- **AuthGuard**: Protects routes requiring authentication
- **AdminGuard**: Protects admin-only routes (checks for ROLE_ADMIN)

## 📡 API Integration

### Base URL
All API calls use the base URL from `environment.apiUrl`.

### Services
Located in `src/app/core/services/`:

- **AuthService**: Authentication (login, signup, logout)
- **BookService**: Book CRUD operations
- **GenreService**: Genre management
- **BookLoanService**: Loan operations
- **SubscriptionService**: Subscription management
- **PaymentService**: Payment tracking
- **UserService**: User management

### Interceptors
- **JWT Interceptor**: Automatically adds authorization header to requests

## 🎨 Styling

### Tailwind CSS
- Configured in `tailwind.config.js`
- Global styles in `src/styles.css`
- Utility-first approach for responsive design

### Custom CSS Classes
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.form-input`, `.form-select`, `.form-label`, `.form-error`
- `.card`, `.card-header`, `.card-body`, `.card-footer`
- `.badge`, `.badge-success`, `.badge-error`, `.badge-warning`
- `.alert`, `.alert-success`, `.alert-error`, `.alert-warning`
- `.table` for table styling

## 🚀 Build & Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

Output will be in `dist/library-admin/`.

### Deploy to Server
```bash
# Copy dist folder to your web server
# Update environment.prod.ts with production API URL
npm run build -- --configuration production
```

## 📝 Key Features in Detail

### 1. Dashboard
- Real-time statistics (active books, genres, users)
- Quick overview of system health

### 2. Books Management
- View all books with pagination
- Create new books
- Update book details
- Soft/hard delete books
- Bulk import books

### 3. Genres Management
- Create categories
- Parent/child genre relationships
- View book count per genre

### 4. User Management
- View all registered users
- Track last login
- View user roles

### 5. Loans Management
- Monitor all book checkouts
- Track overdue books
- View loan history

### 6. Subscriptions
- Manage user subscriptions
- Track subscription status
- View subscription plans

### 7. Payments
- Monitor payment transactions
- Track payment status
- View payment history

## 🔄 Data Flow

```
UI Component
    ↓
Reactive Form / Service Call
    ↓
HTTP Interceptor (adds JWT token)
    ↓
Backend API (Spring Boot)
    ↓
Response → Service → Component
    ↓
Update State / UI
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test -- --code-coverage
```

## 📚 Common Tasks

### Add a New Feature Module
1. Create folder in `src/app/features/`
2. Create component with routes
3. Add route to main routing
4. Add navigation item to sidebar

### Create a New Service
1. Create `.service.ts` in `src/app/core/services/`
2. Inject HttpClient
3. Create methods for API calls
4. Export from `services/index.ts`

### Add Global Styling
1. Edit `src/styles.css`
2. Use Tailwind utility classes
3. Follow BEM naming for custom classes

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, ensure your backend has CORS enabled:
- Check `application.properties` for CORS configuration
- Verify `apiUrl` in `environment.ts` matches your backend

### JWT Token Expired
- Tokens are stored in localStorage
- On expiration, user will be redirected to login
- Clear localStorage if needed: `localStorage.clear()`

### Build Errors
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Update Angular CLI: `npm install -g @angular/cli@latest`

## 📖 Documentation

For more information:
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [RxJS Documentation](https://rxjs.dev/)

## 🤝 Contributing

1. Follow Angular style guide
2. Use meaningful commit messages
3. Test changes before committing
4. Update documentation as needed

## 📄 License

This project is part of the Library Management System.

## 👨‍💻 Author

Created as a comprehensive admin dashboard for the Library Management System.

---

**Note**: Ensure your Spring Boot backend is running on the configured API URL before starting the Angular application.
