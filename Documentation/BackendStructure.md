# Backend Structure Documentation

## Firebase Services

### 1. Authentication
- Firebase Authentication
  - Email/password authentication
  - Google OAuth integration
  - User session management
  - Security rules

### 2. Firestore Database Structure
```
collections/
├── users/
│   └── userId/
│       ├── profile
│       └── settings
├── gear/
│   └── gearId/
│       ├── details
│       ├── images
│       └── history
├── services/
│   └── serviceId/
│       ├── details
│       └── provider
└── timeline/
    └── eventId/
        ├── type
        └── details
```

### 3. Cloud Storage
- Structure:
  ```
  storage/
  ├── users/
  │   └── userId/
  │       └── profile/
  └── gear/
      └── gearId/
          └── images/
  ```
- Image optimization
- Access control
- Folder organization

### 4. Security Rules
```
// Firestore Rules
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /gear/{gearId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}

// Storage Rules
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

### 5. API Services
- Authentication Service
- Gear Service
- Timeline Service
- Storage Service
- User Service

### 6. Data Models
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
}

interface Gear {
  id: string;
  userId: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  purchaseDate: Timestamp;
  purchasePrice: number;
  status: 'Own' | 'Want' | 'Sold';
  images: string[];
}

interface Service {
  id: string;
  gearId: string;
  type: string;
  date: Timestamp;
  provider: string;
  cost: number;
  notes: string;
}
```

### 7. Cloud Functions
- Image processing
- Notification handling
- Data aggregation
- Backup functions
- Cleanup tasks

### 8. Performance Considerations
- Indexing strategy
- Query optimization
- Caching implementation
- Rate limiting
- Cost optimization

### 9. Monitoring
- Error tracking
- Performance monitoring
- Usage analytics
- Cost tracking
- Security alerts 