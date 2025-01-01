# Frontend Development Guidelines

## Code Structure

### 1. Component Organization
- Components stored in `src/components/`
- Feature-based directory structure
- Shared components in `ui` directory
- Clear component naming conventions
- Modular component structure:
  - Separate display and edit modes
  - Smart conditional rendering
  - Category-based organization

### 2. Form Handling Guidelines
- Keep form state local until explicit save action
- Avoid real-time API updates during typing
- Use controlled components for form inputs
- Implement clear save/cancel actions
- Maintain form state independently of API state
- Consider form validation requirements
- Handle unsaved changes appropriately
- Support multiple field types (text, boolean)
- Implement smart field rendering
- Hide empty fields in view mode

### 3. TypeScript Guidelines
- Use strict type checking
- Define interfaces for all props
- Avoid `any` type
- Use type inference when obvious
- Export types from dedicated files
- Comprehensive type definitions for specifications
- Proper typing for nested objects
- Type safety in data transformations

### 4. React Best Practices
- Functional components with hooks
- Custom hooks for shared logic
- Memoization for expensive operations
- Proper state management
- Event handler naming conventions
- Clear separation of local and API state
- Explicit user actions for data persistence
- Smart conditional rendering
- Component composition for complex UIs
- Efficient prop drilling management

### 5. Styling Guidelines
- TailwindCSS for styling
- Consistent color palette
- Responsive design patterns
- Mobile-first approach
- Component-specific styles when needed
- Visual hierarchy in forms
- Clear category separation
- Consistent spacing and alignment
- Smart use of whitespace

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

## Image Handling Guidelines

### State Management
- Use local state for immediate UI feedback
- Maintain consistency between Firestore and Storage operations
- Handle race conditions in concurrent operations
- Implement proper error recovery and state rollback
- Use progress tracking for long-running operations

### User Experience
- Provide clear visual feedback during operations
- Show individual progress for multiple file uploads
- Implement smooth loading states and transitions
- Handle empty states gracefully
- Display user-friendly error messages

### Performance
- Compress images before upload
- Implement proper cleanup procedures
- Use efficient state updates
- Avoid unnecessary re-renders
- Cache images when appropriate

### Error Handling
- Implement comprehensive error handling
- Provide clear error messages to users
- Log errors for debugging
- Recover gracefully from failures
- Maintain data consistency

### Best Practices
1. Always validate files before upload
2. Use proper loading indicators
3. Implement proper cleanup on component unmount
4. Handle all possible error states
5. Maintain proper type safety
6. Use proper logging for debugging 