# Local Development Guide

## Initial Setup

1. Create a `.env.development` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_development_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_development_auth_domain
VITE_FIREBASE_PROJECT_ID=your_development_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_development_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_development_sender_id
VITE_FIREBASE_APP_ID=your_development_app_id
VITE_GEMINI_API_KEY=your_development_gemini_api_key
```

2. Set up Firebase Local Emulator:
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

## What Works Locally

### Fully Functional Without External Dependencies:
- React components and UI
- Routing
- Form validation
- Local state management
- CSS and styling
- Component interactions

### Requires Configuration but Can Work Locally:
1. **Firebase Services** (using emulators):
   - Authentication
   - Firestore database
   - Storage
   - Security rules testing

2. **Gemini API**:
   - Requires a development API key
   - Can use the same API as staging/production
   - Rate limits apply to your development key

## Running the Application Locally

1. Start the development server:
```bash
npm run dev
```

2. Start Firebase emulators (in a separate terminal):
```bash
firebase emulators:start
```

The application will be available at `http://localhost:5173`

## Testing Different Features

### 1. User Authentication
- Works with Firebase Auth emulator
- Test user creation and login
- No real emails are sent in emulator mode

### 2. Database Operations
- Use Firebase Firestore emulator
- Data persists only during emulator session
- Access emulator UI at `http://localhost:4000`

### 3. File Storage
- Use Firebase Storage emulator
- Files are stored locally
- Cleared when emulator stops

### 4. Gemini API Integration
- Uses the same API key as staging/production
- Full access to API functionality locally
- Enables testing of actual API responses
- Provides consistent behavior across environments

## Development Best Practices

1. **Use Emulators When Possible**
   - Prevents accidental production data access
   - Faster development cycle
   - No cost for Firebase operations

2. **API Keys Management**
   - Use staging/production Gemini API key for consistent behavior
   - Store key in `.env.development`
   - Never commit `.env` files

3. **Testing Workflow**
   1. Test with emulators first
   2. Test with real APIs if necessary
   3. Deploy to staging
   4. Deploy to production

## Troubleshooting

### Common Issues

1. **Emulator Connection Issues**
```javascript
// In your Firebase initialization, add:
if (import.meta.env.DEV) {
  connectFirebaseEmulator(auth, "localhost", 9099);
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
```

2. **Gemini API Issues**
   - Verify API key in `.env.development` matches staging
   - Check API response status codes
   - Review API request/response in browser dev tools

3. **Build Issues**
   - Clear `node_modules` and reinstall
   - Check for TypeScript errors
   - Verify environment variables

## Switching Between Environments

Your local development environment is completely isolated from staging and production. You can:
- Use different Firebase projects
- Use different API keys
- Test destructive operations safely
- Experiment with new features

## Local Development vs Staging

| Feature | Local | Staging |
|---------|-------|---------|
| Database | Emulator | Real Firebase |
| Storage | Emulator | Real Storage |
| Auth | Emulator | Real Auth |
| Gemini API | Real (same key) | Real |
| Data Persistence | Temporary | Persistent |
| Cost | Free* | Pay per use |

*Except for Gemini API calls 