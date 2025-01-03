# Backend Structure

## Services

### 1. Authentication Service
- User management
- Session handling
- OAuth integration

### 2. Gear Service
- CRUD operations for gear items
- Image management
- Specification handling
- Service history tracking

### 3. AI Services
- Gear Parsing Service
  - Google Gemini integration
  - Case-insensitive response parsing
  - Fallback parsing mechanisms
  - Error handling and recovery
  - Environment-specific configuration
- Story Generation Service
  - Collection insights
  - Gear stories
  - Timeline analysis

### 4. Storage Service
- Image upload and management
- File organization
- Progress tracking

### 5. Timeline Service
- Event tracking
- History management
- Service records

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
}
```

### Gear Model
```typescript
interface Gear {
  id: string;
  userId: string;
  type: GearType;
  status: GearStatus;
  specs: GuitarSpecs;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  serviceHistory?: HistoryRecord[];
  make: string;
  model: string;
}
```

### Guitar Specifications
```typescript
interface GuitarSpecs {
  overview: {
    manufacturer: string;
    model: string;
    // ... other overview fields
  };
  top: {
    color: string;
    finish: string;
    // ... other top fields
  };
  body: {
    design: {
      // ... design fields
    };
    bracing: {
      // ... bracing fields
    };
    dimensions: {
      // ... dimension fields
    };
  };
  // ... other specification sections
}
```

## Firebase Configuration

### Security Rules
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /gear/{gearId} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.id == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
    match /gear/{gearId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## API Services
- Authentication Service
- Gear Service
  - CRUD operations
  - Image management
  - Specification updates
  - Service history
- AI Services
  - Specification parsing
  - Content generation
  - Analysis and insights
- Timeline Service
- Storage Service
- User Service

## Error Handling
- Standardized error responses
- Error logging and tracking
- User-friendly error messages
- Validation error handling
- API error recovery
- Fallback mechanisms
- Service-specific error handling

## Performance Optimization
- Query optimization
- Data caching
- Image optimization
- Batch operations
- Real-time updates
- Build size optimization
- Code splitting

## Security Measures
- Authentication checks
- Data validation
- Input sanitization
- Rate limiting
- API key management
- Environment security
- Access control

### Environment Configuration
- Development Environment
  - Local environment variables
  - Development API keys
  - Local Firebase configuration
- Staging Environment
  - Staging-specific variables
  - Staging API configuration
  - Staging Firebase setup
- Production Environment
  - Production variables
  - Production API keys
  - Production Firebase config

### Build and Deployment
- Development Build
  - `npm run dev`
  - Local environment
  - Hot module replacement
- Staging Build
  - `npm run build:staging`
  - Staging environment variables
  - Staging deployment target
- Production Build
  - `npm run build`
  - Production environment
  - Optimized assets 