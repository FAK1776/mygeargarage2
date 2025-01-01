# Frontend Development Guidelines

## Code Structure

### 1. Component Organization
- Components stored in `src/components/`
- Feature-based directory structure
- Shared components in `ui` directory
- Clear component naming conventions

### 2. Form Handling Guidelines
- Keep form state local until explicit save action
- Avoid real-time API updates during typing
- Use controlled components for form inputs
- Implement clear save/cancel actions
- Maintain form state independently of API state
- Consider form validation requirements
- Handle unsaved changes appropriately

### 3. TypeScript Guidelines
- Use strict type checking
- Define interfaces for all props
- Avoid `any` type
- Use type inference when obvious
- Export types from dedicated files

### 4. React Best Practices
- Functional components with hooks
- Custom hooks for shared logic
- Memoization for expensive operations
- Proper state management
- Event handler naming conventions
- Clear separation of local and API state
- Explicit user actions for data persistence

### 5. Styling Guidelines
- TailwindCSS for styling
- Consistent color palette
- Responsive design patterns
- Mobile-first approach
- Component-specific styles when needed

### 6. File Structure
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

### 7. Component Template
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

### 8. State Management
- Local state with useState
- Complex state with useReducer
- Global state with context
- Proper state initialization
- State update best practices

### 9. Performance Guidelines
- Lazy loading for routes
- Image optimization
- Code splitting
- Bundle size monitoring
- Performance monitoring

### 10. Testing Guidelines
- Component unit tests
- Integration testing
- E2E testing when needed
- Test naming conventions
- Test coverage goals

### 11. Documentation
- Component documentation
- Props documentation
- Function documentation
- Code comments
- README maintenance 