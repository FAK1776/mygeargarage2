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

#### UI Components
##### GuitarQuotes
A dynamic quote rotation component used on the login page:
- Located in `src/components/ui/GuitarQuotes.tsx`
- Features:
  - 6-second display time per quote
  - Smooth fade transitions (1-second duration)
  - Fixed-height container (160px) to prevent layout shifts
  - Centered content with overflow handling
  - Semi-transparent backdrop with blur effect
  - Responsive text sizing
  - Guitar-related quotes from famous musicians

### 2. Form Handling Guidelines
- Keep form state local until explicit save action
- Implement loading states during form submission
- Provide visual feedback for user actions
- Handle navigation after successful submission
- Avoid real-time API updates during typing
- Use controlled components for form inputs
- Implement clear save/cancel actions
- Maintain form state independently of API state
- Consider form validation requirements
- Handle unsaved changes appropriately
- Support multiple field types (text, boolean)
- Implement smart field rendering
- Hide empty fields in view mode

### 3. Layout Guidelines
- Consistent page padding (28 units from top)
- Proper spacing between elements
- Responsive layout considerations:
  - Mobile-first approach
  - Smart control sizing
  - Flexible layouts
- Form control alignment:
  - Proper width constraints
  - Aligned form elements
  - Consistent spacing
- Navigation consistency:
  - Standard header height
  - Proper content padding
  - No content overlap

### 4. Styling Guidelines
- TailwindCSS for styling
- Consistent color palette:
  - Primary: #EE5430
  - Text: gray-600 to gray-900
  - Borders: gray-200
- Component states:
  - Loading states with spinners
  - Disabled states with reduced opacity
  - Hover and focus states
- Visual feedback:
  - Button state changes
  - Loading indicators
  - Success/error states
- Responsive design patterns
- Component-specific styles when needed
- Visual hierarchy in forms
- Clear category separation
- Consistent spacing and alignment
- Smart use of whitespace

### 5. TypeScript Guidelines
- Use strict type checking
- Define interfaces for all props
- Avoid `any` type
- Use type inference when obvious
- Export types from dedicated files
- Comprehensive type definitions for specifications
- Proper typing for nested objects
- Type safety in data transformations

### 6. React Best Practices
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

### 7. File Structure
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

### 8. Component Template
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

### 9. State Management
- Local state with useState
- Complex state with useReducer
- Global state with context
- Proper state initialization
- State update best practices

### 10. Performance Guidelines
- Lazy loading for routes
- Image optimization
- Code splitting
- Bundle size monitoring
- Performance monitoring

### 11. Testing Guidelines
- Component unit tests
- Integration testing
- E2E testing when needed
- Test naming conventions
- Test coverage goals

### 12. Documentation
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

## Component Patterns

### Floating Elements
When implementing floating elements (like the My Gear Guru chat bot):
- Use fixed positioning with proper z-index management
- Ensure proper stacking context with overlays
- Implement click-outside handling for dismissal
- Add proper spacing from viewport edges
- Consider mobile responsiveness

Example:
```tsx
<div className="fixed bottom-4 right-4 z-50">
  {/* Floating content */}
</div>
```

### Chat Components
When implementing chat interfaces:
1. **Structure**
   - Use a container with fixed height and overflow
   - Implement proper message grouping
   - Add auto-scrolling behavior for new messages
   - Include loading states and typing indicators

2. **State Management**
   - Maintain message history in state
   - Handle loading states for responses
   - Implement proper error handling
   - Consider message persistence

3. **Accessibility**
   - Ensure keyboard navigation
   - Add proper ARIA labels
   - Implement focus management
   - Consider screen reader support

Example Chat Component Pattern:
```tsx
const ChatComponent = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto">
        {messages.map(message => (
          <MessageComponent key={message.id} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSubmit={handleSubmit} disabled={loading} />
    </div>
  );
};
``` 