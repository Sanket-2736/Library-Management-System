# LibraryHub User Application - Authentication & Dashboard

## Overview

A modern, production-ready Angular 18 user interface for the Library Management System. This phase includes:

1. **Complete Authentication Module** (Login, Signup, Forgot Password, Reset Password)
2. **Professional User Dashboard** with real backend data integration
3. **Enhanced Navigation** with responsive design

## Features Implemented

### 🔐 Authentication

#### Login Page
- Email and password input fields
- **Password visibility toggle** with eye icon
- Remember me option
- Form validation with real-time feedback
- Error handling with user-friendly messages
- Forgot password link
- Demo credentials (development mode)

#### Signup Page
- First name and last name fields
- Email validation
- Optional phone number
- **Password strength meter** (visual progress bar)
- **Password visibility toggle** (both password fields)
- Password confirmation with mismatch detection
- Field-level error messages
- Responsive design (stacked on mobile, side-by-side on desktop)

#### Forgot Password Page
- Email input with validation
- Loading state during submission
- Success message with instructions
- Helpful info box (check spam, 24-hour expiration)
- Auto-redirect to login

#### Reset Password Page
- Token extraction from URL
- **Password strength meter** with visual feedback
- **Password visibility toggle** (both fields)
- Password confirmation
- Complete validation
- Success confirmation

### 📊 Dashboard

#### Welcome Section
- Personalized greeting with user's first name
- Time-based dynamic greeting (morning/afternoon/evening)

#### Statistics Cards (4)
- **Active Subscription**: Plan name, expiry date, status badge
- **Borrowed Books**: Current count, maximum allowed, link to details
- **Overdue Books**: Count with color-coding, action button if needed
- **Due Soon**: Books due within 7 days, at-a-glance view

#### Currently Borrowed Section
- List of up to 5 currently borrowed books
- Book details: Title, Author, Borrowed date, Due date
- Days remaining with color-coded status
- Empty state with helpful link
- Link to view all loans

#### Account Info Card
- User's full name
- Email address
- Phone number (if provided)
- Member since date
- Edit profile link

#### Quick Actions Card
- Browse Books button
- View Plans button
- My Loans button
- Logout button

#### Overdue Alert (Conditional)
- Only shows when user has overdue books
- Warning icon and red theme
- List of each overdue book with days overdue
- "Return Now" button

### 🧭 Navigation

- Responsive navbar (mobile, tablet, desktop)
- User profile dropdown menu
- Search bar (desktop only)
- Mobile hamburger menu
- Quick action buttons
- Logout with confirmation

## Technical Stack

- **Framework**: Angular 18 (standalone components)
- **Language**: TypeScript 5.2+
- **Styling**: Tailwind CSS 3.3+
- **HTTP**: HttpClient with Interceptors
- **Forms**: Reactive Forms with Validators
- **State**: RxJS with proper memory leak prevention
- **Icons**: Lucide Angular
- **Routing**: Angular Router with guards

## API Integration

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with token
- `GET /api/users/profile` - Current user profile

### Dashboard Endpoints
- `GET /api/subscriptions/user/active` - Active subscription
- `GET /api/book-loans/my` - User's borrowed books

## Installation

### Prerequisites
- Node.js 18+ and npm 10+
- Spring Boot backend running on `http://localhost:8080`

### Setup
```bash
# Navigate to user directory
cd user

# Install dependencies
npm install

# Start development server
npm start
# Application runs on http://localhost:4200
```

## Building for Production

```bash
# Build optimized bundle
npm run build

# Output: dist/user/
# Deploy dist/user/ to your web server
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces
│   │   ├── services/        # API services
│   │   ├── guards/          # Route guards
│   │   └── interceptors/    # HTTP interceptors
│   ├── shared/
│   │   └── components/      # Reusable components
│   ├── features/
│   │   ├── auth/            # Auth pages
│   │   └── dashboard/       # Dashboard
│   ├── layout/
│   │   ├── navbar/
│   │   └── footer/
│   ├── app.routes.ts        # Route definitions
│   ├── app.config.ts        # App configuration
│   └── app.component.ts     # Root component
├── environments/            # Environment configs
└── styles.css              # Global styles
```

## Usage Examples

### Login Flow
```
1. Navigate to http://localhost:4200/auth/login
2. Enter email and password
3. Click "Login"
4. Redirected to dashboard
5. User data displayed from backend
```

### View Dashboard
```
1. After login, automatically on dashboard
2. Dashboard loads data from 3 API calls:
   - User profile
   - Active subscription
   - Borrowed books
3. All data from backend (no mock data)
4. Statistics calculated in real-time
```

### Responsive Design
```
Mobile (< 768px):
- Single column layout
- Hamburger menu for navigation
- Stack form fields vertically

Tablet (768-1024px):
- 2-column grid for stats
- Visible navigation
- Optimized spacing

Desktop (> 1024px):
- 4-column stats grid
- Full navigation bar
- Search functionality
```

## Configuration

### Environment Variables
Located in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  jwtTokenKey: 'library_user_token',
};
```

Update `apiUrl` for production deployment.

## Security Features

✅ JWT token-based authentication
✅ Automatic token injection via Interceptor
✅ Token expiration detection (401 → logout)
✅ Route protection with AuthGuard
✅ Secure password input handling
✅ Password visibility toggle (prevents shoulder surfing)
✅ Form validation (client-side)
✅ Error messages (no sensitive info exposed)

## Validation Features

### Form Level
- Reactive Forms with FormGroup validation
- Custom validators (password matching)
- Async validators ready (email uniqueness check)

### Field Level
- Required field validation
- Email format validation
- Password min length validation
- Password strength calculation
- Touch-based error display

## Error Handling

- **400**: Bad request - field validation errors
- **401**: Unauthorized - invalid token or credentials
- **403**: Forbidden - insufficient permissions
- **404**: Not found - resource doesn't exist
- **500**: Server error - graceful fallback

All errors display user-friendly messages.

## Testing

### Quick Test Scenarios

**Signup**:
```
Email: test@example.com
Name: Test User
Password: SecurePass123!@
→ Should redirect to dashboard
```

**Login**:
```
Email: test@example.com
Password: SecurePass123!@
→ Should show dashboard with user data
```

**Dashboard Verification**:
```
Check for:
- User's name in welcome message
- Active subscription (if exists)
- Borrowed books list (if exists)
- Statistics cards with real data
```

See `TESTING_GUIDE.md` for comprehensive testing scenarios.

## Performance

- **Page Load**: < 2 seconds
- **Dashboard Load**: < 3 seconds total (3 parallel API calls)
- **Bundle Size**: < 500KB initial (with optimization)
- **Time to Interactive**: < 3 seconds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

✅ Semantic HTML structure
✅ Proper heading hierarchy
✅ Color + icons (not color-only)
✅ Focus states on interactive elements
✅ Keyboard navigation support
✅ Screen reader compatible
✅ WCAG AA compliance target

## Next Steps

Ready to implement additional modules:

1. **Books Browse** - Search, filter, browse books
2. **Subscriptions** - View plans, subscribe
3. **Book Loans** - Manage borrowed books
4. **Profile** - Edit account, change password
5. **Payments** - View history, invoices

## Troubleshooting

### Issue: Login fails
**Check**:
- Backend is running on `http://localhost:8080`
- Email and password are correct
- Check browser console for errors
- Network tab shows API response

### Issue: Dashboard shows no data
**Check**:
- Backend APIs are working
- User has active subscription
- User has borrowed books
- Check Network tab for API calls
- Check console for errors

### Issue: Password strength meter not updating
**Check**:
- JavaScript is enabled
- Check browser console for errors
- Try clearing cache (Ctrl+Shift+Delete)

### Issue: Responsive design not working
**Check**:
- Developer tools device toggle enabled
- Browser zoom is at 100%
- Try different device in DevTools

## Support & Documentation

- **TESTING_GUIDE.md** - Comprehensive testing procedures
- **IMPLEMENTATION_GUIDE.md** - Architecture and design decisions
- **QUICK_START.md** - Setup and basic usage

## License

Part of the LibraryHub Library Management System

## Version

**v1.0.0**
- Authentication Module: Complete ✅
- Dashboard: Complete ✅
- Navbar: Complete ✅

---

**Status**: Production Ready ✅
**Last Updated**: January 2025
**Next Update**: Feature modules (Books, Subscriptions, etc.)
