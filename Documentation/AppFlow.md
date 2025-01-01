# My Gear Garage - App Flow Documentation

## User Journey

### 1. Authentication Flow
1. User arrives at landing page
2. Signs up/logs in via Firebase Authentication
3. Redirected to home dashboard

### 2. Main Navigation Flow
- Home Dashboard
  - Quick overview of collection
  - Recent activity
  - Quick actions
- My Gear Collection
  - Full gear list view
  - Filtering and sorting options
  - Add new gear button
- Timeline View
  - Chronological event display
  - Event filtering options
- Profile & Settings

### 3. Gear Management Flow
1. Adding New Gear
   - Basic information entry
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