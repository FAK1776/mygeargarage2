# My Gear Garage - App Flow Documentation

## User Journey

### 1. Authentication Flow
1. User arrives at landing page
2. Signs up/logs in via Firebase Authentication
3. Redirected to home dashboard

### 2. Main Navigation Flow
Primary navigation order:
- My Gear (Home)
  - Full gear collection view
  - Filtering and sorting options
  - Quick actions
- Add Gear
  - Specification parser
  - Manual gear entry
  - Form submission feedback
- Gear Timeline
  - Chronological event display
  - Event filtering and search
  - Instrument filtering
- Profile & Settings

### 3. Gear Management Flow
1. Adding New Gear
   - Specification parser for automatic data entry
   - Manual form input with live feedback
   - Loading states during submission
   - Automatic navigation after success
   - Image upload with progress tracking
   - Comprehensive specifications input:
     - Overview section (manufacturer, model, etc.)
     - Top specifications
     - Body details (design, bracing, dimensions)
     - Neck & Headstock details
     - Electronics configuration
     - Hardware components
     - Additional specifications
   - Purchase details
   - Boolean and text field support
   
2. Viewing Gear Details
   - Dynamic image gallery
   - Smart specifications display:
     - Shows only populated fields
     - Organized by categories
     - Collapsible sections
   - Service history timeline
   - Edit mode with full field access
   - Combined manufacturer/model header

3. Updating Gear Status
   - Mark as sold
   - Update condition
   - Add service records
   - Edit specifications
   - Local state management
   - Explicit save actions

### 4. Service History Flow
1. Adding Service Records
   - Service type selection
   - Provider details
   - Cost information
   - Date recording
   
2. Viewing Service History
   - Timeline integration
   - Filter by service type
   - Cost tracking
   - Service provider history

### 5. Timeline Integration
1. Event Creation
   - Purchase events with standardized manufacturer names
   - Sale events with buyer information
   - Service records with proper type mapping
   - Maintenance logs with provider details
   
2. Timeline View
   - Chronological ordering with year grouping
   - Color-coded event types matching gear details
   - Smart event filtering:
     - By event type (ownership, maintenance, etc.)
     - By instrument with standardized names
     - By text search across descriptions and providers
   - Consistent event card layout:
     - Event type badges
     - Instrument details
     - Cost information
     - Provider information
   - Image display for ownership events
   - Direct access to gear details

3. Event Type Management
   - Consistent type mapping with gear history
   - Color-coded event categories:
     - Ownership (blue)
     - Maintenance (green)
     - Modification (purple)
     - Repairs (orange)
   - Smart filtering based on event types
   - Proper type inheritance from service history

### 6. Data Management Flow
1. Data Entry
   - Smart form validation
   - Progressive image upload
   - Data sanitization
   - Local state management
   - Explicit save actions
   
2. Data Storage
   - Firestore database
   - Cloud storage for images
   - Optimized update frequency
   - State consistency checks

### 7. Error Handling Flow
- Form validation errors
- API error responses
- Image upload issues
- Authentication failures
- State recovery procedures
- User-friendly error messages 

# Application Flow

## User Interactions

### My Gear Guru Chat Bot
1. **Access**
   - Chat bot is available as a floating element on the My Gear page
   - Users can toggle the chat interface with the message icon
   - Chat persists while navigating within the My Gear page

2. **Interaction Flow**
   - User opens chat bot
   - System displays welcome message
   - User enters question about their gear
   - System processes query through Gemini API
   - System accesses user's gear data including:
     - Gear inventory
     - Service history
     - Specifications
     - Purchase/sale information
   - System provides contextual response
   - User can continue conversation or close chat

3. **Data Flow**
   ```mermaid
   sequenceDiagram
     participant U as User
     participant C as Chat UI
     participant G as GearGuruService
     participant F as Firestore
     participant A as Gemini API

     U->>C: Opens chat
     C->>C: Display welcome
     U->>C: Sends question
     C->>G: Process query
     G->>F: Fetch gear data
     F-->>G: Return gear data
     G->>A: Generate response
     A-->>G: Return response
     G-->>C: Display response
     C-->>U: Show message
   ``` 