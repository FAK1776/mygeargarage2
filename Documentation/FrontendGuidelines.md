# Frontend Development Guidelines

## Code Structure

### 1. Component Organization
- Components stored in `src/components/`
- Feature-based directory structure
- Shared components in `ui` directory
- Clear component naming conventions

### 2. TypeScript Guidelines
- Use strict type checking
- Define interfaces for all props
- Avoid `any` type
- Use type inference when obvious
- Export types from dedicated files

### 3. React Best Practices
- Functional components with hooks
- Custom hooks for shared logic
- Memoization for expensive operations
- Proper state management
- Event handler naming conventions

### 4. Styling Guidelines
- TailwindCSS for styling
- Consistent color palette
- Responsive design patterns
- Mobile-first approach
- Component-specific styles when needed

### 5. File Structure
```
src/
├── components/
│   ├── gear/
│   ├── timeline/
│   ├── service/
│   └── ui/
├── pages/
├── hooks/
├── services/
├── types/
├── utils/
└── config/
```

### 6. Component Template
```tsx
import React from 'react';
import { ComponentProps } from '../types';

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hook declarations
  
  // Event handlers
  
  // Render logic
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### 7. State Management
- Local state with useState
- Complex state with useReducer
- Global state with context
- Proper state initialization
- State update best practices

### 8. Performance Guidelines
- Lazy loading for routes
- Image optimization
- Code splitting
- Bundle size monitoring
- Performance monitoring

### 9. Testing Guidelines
- Component unit tests
- Integration testing
- E2E testing when needed
- Test naming conventions
- Test coverage goals

### 10. Documentation
- Component documentation
- Props documentation
- Function documentation
- Code comments
- README maintenance 