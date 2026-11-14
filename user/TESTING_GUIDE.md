# Testing Guide - Authentication & Dashboard

## Prerequisites

1. **Node.js and npm installed** (v18+)
2. **Spring Boot backend running** on http://localhost:8080
3. **Angular dev server running** on http://localhost:4200

## Setup Instructions

### 1. Install Dependencies
```bash
cd user
npm install
```

### 2. Start Development Server
```bash
npm start
# Application will be available at http://localhost:4200
```

### 3. Ensure Backend is Running
```bash
# In separate terminal, from project root
cd library-management-system
mvn spring-boot:run
# Backend should be running on http://localhost:8080
```

## Testing Scenarios

### Test 1: Signup Flow

**Steps**:
1. Navigate to `http://localhost:4200/auth/signup`
2. Fill in form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Phone: `+1234567890` (optional)
   - Password: `SecurePass123!@`
   - Confirm: `SecurePass123!@`
3. Watch password strength meter (should be GREEN)
4. Click "Create Account"

**Expected Results**:
- Form validates all fields
- No errors display
- Loading spinner shows during submission
- Redirects to dashboard after success
- User is logged in (navbar shows user's name)

**Test Password Strength**:
- Try weak password: `short` → RED
- Try medium: `password123` → YELLOW
- Try strong: `SecurePass123!@` → GREEN

---

### Test 2: Login Flow

**Steps**:
1. Navigate to `http://localhost:4200/auth/login`
2. Enter credentials:
   - Email: `john.doe@example.com`
   - Password: `SecurePass123!@`
3. Toggle password visibility (click eye icon)
4. Check "Remember me"
5. Click "Login"

**Expected Results**:
- Password toggle shows/hides password
- Form submits successfully
- Redirects to dashboard
- User name appears in navbar
- User menu shows user's name

**Test Error Handling**:
- Try wrong password → Error message "Invalid credentials"
- Try non-existent email → Error message
- Try invalid email format → Field error "Please enter a valid email"

---

### Test 3: Dashboard Data Loading

**Steps**:
1. Login successfully
2. Wait for dashboard to load
3. Check all displayed data

**Expected Results**:
- Welcome message with user's first name
- Greeting changes based on time (morning/afternoon/evening)
- Active Subscription card shows:
  - Current plan name (if subscribed)
  - Expiry date
  - Status badge (ACTIVE/EXPIRED)
- Borrowed Books card shows:
  - Count of books
  - Max allowed from subscription
- Overdue Books card shows:
  - Count of overdue (red if > 0, green if 0)
- Due Soon card shows count within 7 days
- Currently Borrowed list shows up to 5 books with:
  - Book title
  - Author
  - Dates
  - Days remaining

**Verify No Hardcoded Data**:
- Sign in as different user
- Dashboard should show different data
- User name, subscription, loans should differ

---

### Test 4: Forgot Password Flow

**Steps**:
1. Navigate to `http://localhost:4200/auth/forgot-password`
2. Enter email: `john.doe@example.com`
3. Click "Send Reset Link"

**Expected Results**:
- Loading spinner shows
- Success message displays: "Password reset link sent!"
- Info box shows: "Check spam folder"
- Auto-redirects to login after 4 seconds
- Email received with reset link (check email account or backend logs)

---

### Test 5: Reset Password Flow

**Steps**:
1. Get reset token from email
2. Construct URL: `http://localhost:4200/auth/reset-password/{token}`
3. Enter new password: `NewSecurePass456!@`
4. Confirm: `NewSecurePass456!@`
5. Click "Reset Password"

**Expected Results**:
- Password strength meter shows progress
- Form validates passwords match
- Success message: "Password reset successfully!"
- Auto-redirects to login
- Can login with new password: `NewSecurePass456!@`

**Test Edge Cases**:
- Try mismatched passwords → Error "Passwords do not match"
- Try weak password (< 8 chars) → Error "Min 8 characters"
- Try invalid token → Error "Invalid reset link"

---

### Test 6: Responsive Design

#### Mobile (< 768px)
1. Open DevTools (F12)
2. Click device toggle (mobile)
3. Select iPhone 12 or similar

**Verify**:
- Logo visible
- Hamburger menu appears (3 lines icon)
- Navigation links hidden
- Navbar dropdown accessible
- Dashboard cards stack vertically
- Text readable without horizontal scroll
- Buttons have good touch targets (44px minimum)

#### Tablet (768-1024px)
1. Select iPad or similar

**Verify**:
- Logo + app name visible
- Navigation links appear
- Cards in 2-column grid
- Hamburger menu hidden
- Sidebar for search hidden

#### Desktop (> 1024px)
1. Full browser window

**Verify**:
- All features visible
- 4-column stats grid
- Search bar visible
- Full width navigation
- Professional layout

---

### Test 7: Logout Functionality

**Steps**:
1. Click user name/avatar in navbar
2. Click "Logout"
3. Confirm logout

**Expected Results**:
- Confirmation dialog appears
- After confirming, redirected to login page
- Token removed from localStorage
- Cannot access dashboard without logging in

---

### Test 8: Protected Routes

**Steps**:
1. Logout
2. Try to directly access: `http://localhost:4200/dashboard`

**Expected Results**:
- Automatically redirected to login page
- Message: "Please login to continue"
- Cannot access protected routes without token

---

### Test 9: Token Expiration

**Steps**:
1. Login successfully
2. In browser console, manually delete token:
   ```javascript
   localStorage.removeItem('library_user_token')
   ```
3. Try to load data or navigate

**Expected Results**:
- API calls receive 401 error
- Auth interceptor detects 401
- Automatic logout triggered
- Redirected to login page

---

### Test 10: Error Handling

#### API Failure Scenarios

**Server Down**:
1. Stop Spring Boot backend
2. Try to login
3. Expected: "Failed to connect to server" or timeout error

**Invalid Credentials**:
1. Login with wrong password
2. Expected: "Invalid email or password" error

**Missing Fields**:
1. Try to submit form with empty fields
2. Expected: Field-level error messages

**Network Error**:
1. Go offline (disable network)
2. Try to perform action
3. Expected: Error message with retry option

---

## Form Validation Tests

### Signup Validation

| Field | Invalid Input | Expected Error |
|-------|---|---|
| First Name | Empty | "First name required" |
| First Name | `J` | "Min 2 characters" |
| Last Name | Empty | "Last name required" |
| Email | `invalid` | "Please enter a valid email" |
| Email | Empty | "Email is required" |
| Password | `short` | "Min 8 characters" |
| Password | Empty | "Password is required" |
| Confirm | Different | "Passwords do not match" |

### Login Validation

| Field | Invalid Input | Expected Error |
|-------|---|---|
| Email | Empty | "Email is required" |
| Email | `invalid` | "Please enter a valid email" |
| Password | Empty | "Password is required" |

---

## Performance Tests

### Load Time Check
1. Open DevTools → Network tab
2. Navigate to login page
3. Check:
   - Page load: < 2 seconds
   - Bundle size: < 500KB (initially)
   - No 404 errors

### API Response Time
1. DevTools → Network tab
2. Login
3. Check:
   - `/auth/login` response: < 1 second
   - `/users/profile` response: < 1 second
   - `/subscriptions/user/active` response: < 1 second

### Dashboard Data Load
1. Check dashboard loads with multiple API calls
2. Expected: All 3 API calls complete within 3 seconds total

---

## Accessibility Tests

### Keyboard Navigation
1. Press `Tab` key repeatedly
2. Verify focus order is logical:
   - Email input → Password input → Login button → Links
3. Can submit form with `Enter` key
4. Can toggle password with `Space` or `Enter`

### Screen Reader (NVDA/JAWS on Windows)
1. All buttons have labels
2. Form labels associated with inputs
3. Error messages announced
4. Status badges read properly

### Color Contrast
1. Use Chrome DevTools → Accessibility
2. Check color contrast ratios:
   - Normal text: >= 4.5:1
   - Large text: >= 3:1
   - Verify WCAG AA compliance

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

Expected: Works identically on all browsers

---

## Local Storage Verification

### Check Token Storage
```javascript
// In browser console
localStorage.getItem('library_user_token')
// Should show JWT token after login
// Should be null after logout
```

### Check Token Format
```javascript
// JWT has 3 parts separated by dots
const token = localStorage.getItem('library_user_token')
token.split('.').length === 3  // Should be true
```

---

## API Integration Checklist

- [ ] POST `/api/auth/login` works
- [ ] POST `/api/auth/signup` works
- [ ] POST `/api/auth/forgot-password` works
- [ ] POST `/api/auth/reset-password` works
- [ ] GET `/api/users/profile` requires JWT
- [ ] GET `/api/subscriptions/user/active` returns subscription
- [ ] GET `/api/book-loans/my` returns user's loans
- [ ] 401 errors trigger logout
- [ ] 400 errors show messages
- [ ] 500 errors handled gracefully

---

## Quick Testing Checklist

Before deployment, verify:

- [ ] Can signup with new user
- [ ] Can login with credentials
- [ ] Can see dashboard with real data
- [ ] Can toggle password visibility
- [ ] Can reset password via email
- [ ] Navbar responsive on mobile
- [ ] Can logout successfully
- [ ] Dashboard data refreshes on each login
- [ ] Error messages display properly
- [ ] No console errors
- [ ] No TypeScript compilation errors
- [ ] All APIs integrated working
- [ ] Responsive design tested on 3+ devices

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` and restart dev server

### Issue: Login doesn't work
**Solution**: 
- Check backend is running on :8080
- Check credentials are correct
- Check browser console for errors

### Issue: Dashboard shows no data
**Solution**:
- Check user has active subscription
- Check user has borrowed books
- Check API responses in Network tab
- Check browser console for errors

### Issue: Password strength meter not working
**Solution**: Verify strength calculation is running (check console)

### Issue: CORS errors
**Solution**: Backend CORS must allow localhost:4200

### Issue: Token not stored
**Solution**: Check localStorage is enabled in browser

---

## Support

For issues:
1. Check browser console (F12) for errors
2. Check Network tab for API failures
3. Check Spring Boot backend logs
4. Verify both servers are running
5. Try clearing cache (Ctrl+Shift+Delete)

---

## Next Testing

Once auth & dashboard are verified:

1. Implement Books Browse module
2. Implement Subscriptions module
3. Implement Book Loans module
4. Implement Profile module
5. Implement Payments/Razorpay

Each should follow same testing patterns:
- Form validation
- API integration
- Error handling
- Responsive design
- Accessibility
