# File Structure Documentation

## Project Root Structure
```
mygeargarage/
├── src/
├── public/
├── Documentation/
├── scripts/
├── tests/
└── config/
```

## Source Code Structure
```
src/
├── components/
│   ├── gear/
│   │   ├── details/
│   │   │   ├── GearImageGallery.tsx
│   │   │   └── GearSpecifications.tsx
│   │   ├── GearCard.tsx
│   │   ├── GearList.tsx
│   │   └── GearDetailsOverlay.tsx
│   ├── timeline/
│   │   ├── TimelineView.tsx
│   │   ├── TimelineEvent.tsx
│   │   └── TimelineFilters.tsx
│   ├── service/
│   │   ├── ServiceForm.tsx
│   │   └── ServiceHistory.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Timeline.tsx
├── pages/
│   ├── Home.tsx
│   ├── MyGear.tsx
│   ├── Timeline.tsx
│   └── Profile.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useGear.ts
│   └── useTimeline.ts
├── services/
│   ├── authService.ts
│   ├── gearService.ts
│   ├── timelineService.ts
│   └── aiService.ts
├── types/
│   ├── gear.ts
│   ├── service.ts
│   └── timeline.ts
├── utils/
│   ├── dateUtils.ts
│   ├── imageUtils.ts
│   └── formatters.ts
├── config/
│   ├── firebase.ts
│   └── constants.ts
└── App.tsx
```

## Configuration Files
```
config/
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── firebase.json
```

## Public Assets
```
public/
├── images/
│   ├── logo.svg
│   └── icons/
├── fonts/
└── data/
```

## Documentation
```
Documentation/
├── PRD.md
├── AppFlow.md
├── FrontendGuidelines.md
├── BackendStructure.md
├── TechStack.md
├── FileStructure.md
└── README.md
```

## Scripts
```
scripts/
├── deploy.sh
├── test.sh
└── setCors.js
```

## Testing Structure
```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
└── e2e/
```

## Key File Descriptions

### 1. Component Files
- **GearCard.tsx**: Individual gear item display
- **TimelineView.tsx**: Main timeline component
- **ServiceForm.tsx**: Service record form

### 2. Service Files
- **gearService.ts**: Gear CRUD operations
- **timelineService.ts**: Timeline management
- **aiService.ts**: AI integration

### 3. Configuration Files
- **.env**: Environment variables
- **firebase.json**: Firebase configuration
- **tsconfig.json**: TypeScript settings

### 4. Type Definition Files
- **gear.ts**: Gear-related types
- **service.ts**: Service-related types
- **timeline.ts**: Timeline-related types

### 5. Utility Files
- **dateUtils.ts**: Date manipulation
- **imageUtils.ts**: Image processing
- **formatters.ts**: Data formatting

## File Naming Conventions

### 1. Components
- PascalCase for component files
- `.tsx` extension for components
- Descriptive, feature-based names

### 2. Utilities
- camelCase for utility files
- `.ts` extension
- Function-focused names

### 3. Types
- camelCase for type files
- `.ts` extension
- Domain-specific names

### 4. Tests
- Same name as source file
- `.test.ts` or `.spec.ts` extension 