# My Gear Garage

A web application for musicians to track their gear collection, including purchases, sales, service history, and maintenance records.

## Features

### My Gear (Home)
- Comprehensive gear collection overview
- Quick actions for common tasks
- Smart filtering and sorting capabilities
- Dynamic grid layout with responsive design
- Instant search functionality
- Collection statistics at a glance

### Add Gear
- Streamlined gear addition process
- Specification parser for automatic data entry
- Real-time form validation and feedback
- Progressive image upload with status indicators
- Smart field validation and formatting
- Automatic navigation after successful submission

### Timeline View
- Chronological display of all gear-related events
- Smart filtering system:
  - Event type filtering (purchases, sales, service)
  - Instrument-specific filtering
  - Full-text search across all fields
- Visual timeline with year grouping
- Consistent event card layout
- Direct access to gear details

### Profile & Settings
- User preferences management
- Collection statistics and insights
- Account settings and customization
- Theme preferences
- Notification settings

### Collection Management
- Add and track musical instruments and equipment
- Upload and manage multiple images per item
- Track purchase and sale prices
- Record ownership dates and status (Own/Want/Sold)
- Filter and sort gear by various criteria
- Comprehensive gear specifications structure:
  - Overview (manufacturer, model, basic specs)
  - Top specifications
  - Body details (design, bracing, dimensions)
  - Neck & Headstock specifications
  - Electronics configuration
  - Hardware components
  - Additional specifications
- Dynamic field rendering based on data presence
- Smart category/subcategory display
- Support for boolean and text field types

### Service History
- Log maintenance and service records
- Track service providers and costs
- Categorize service types (maintenance, repairs, modifications)
- AI-powered features:
  - Natural language service record parsing
  - Intelligent date recognition (including relative dates)
  - Automatic cost extraction and formatting
  - Smart provider detection
  - Automatic tag categorization
  - Ownership status tracking
- Chronological timeline view of all events
- Interactive chat interface for:
  - Querying service history
  - Adding new records
  - Getting insights about maintenance
  - Tracking ownership changes
- Real-time updates and synchronization
- Comprehensive filtering and sorting options

## Documentation

### 1. [Project Requirements Document (PRD)](./PRD.md)
- Project overview
- Core requirements
- Success metrics
- Feature specifications

### 2. [App Flow Documentation](./AppFlow.md)
- User journey
- Navigation flow
- Feature workflows
- Error handling

### 3. [Frontend Guidelines](./FrontendGuidelines.md)
- Code structure
- Component organization
- TypeScript guidelines
- Styling conventions
- Testing practices

### 4. [Backend Structure](./BackendStructure.md)
- Firebase services
- Database schema
- Security rules
- API services
- Cloud functions

### 5. [Technology Stack](./TechStack.md)
- Core technologies
- Development tools
- Dependencies
- Infrastructure
- Monitoring & analytics

### 6. [File Structure](./FileStructure.md)
- Project organization
- Key file descriptions
- Naming conventions
- Directory structure

## Development Setup

### Prerequisites
- Node.js
- npm or yarn
- Firebase CLI
- Java Runtime Environment (JRE) for Firebase Emulators

### Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/mygeargarage.git
cd mygeargarage
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your Firebase and Google AI (Gemini) API keys:
# - VITE_FIREBASE_API_KEY
# - VITE_FIREBASE_AUTH_DOMAIN
# - VITE_FIREBASE_PROJECT_ID
# - VITE_FIREBASE_STORAGE_BUCKET
# - VITE_FIREBASE_MESSAGING_SENDER_ID
# - VITE_FIREBASE_APP_ID
# - VITE_GEMINI_API_KEY
```

4. Initialize Firebase Emulators
```bash
firebase init emulators
# Select the following emulators:
# - Authentication
# - Firestore
# - Storage
# - Hosting
# - Extensions
# Enable the Emulator UI when prompted
```

5. Start the development environment
```bash
# Terminal 1: Start Firebase emulators
firebase emulators:start

# Terminal 2: Start the development server
npm run dev
```

The application will be available at:
- Web App: http://localhost:5173
- Firebase Emulator UI: http://localhost:4040

### Local Development Features
- Full Firebase emulation (Auth, Firestore, Storage)
- Real-time data updates
- AI-powered chat functionality using Gemini API
- Service history parsing and tracking
- Local image upload and storage

## Deployment

The application is deployed to Firebase Hosting with two environments:

- Production: [my-gear-garage.web.app](https://my-gear-garage.web.app)
- Staging: [staging-my-gear-garage.web.app](https://staging-my-gear-garage.web.app)

To deploy:
```bash
# Deploy to staging
npm run build && firebase deploy --only hosting:staging

# Deploy to production
npm run build && firebase deploy --only hosting:production
```

## Contributing
- Review the [Frontend Guidelines](./FrontendGuidelines.md)
- Follow the code style guide
- Submit pull requests with tests
- Update documentation as needed

## Support

For additional support or questions:
1. Review the documentation
2. Check existing issues
3. Create a new issue
4. Contact the development team

## Recent Updates

- Enhanced navigation structure with improved user flow
- Standardized layout with consistent padding (28px top)
- Improved form control alignment and sizing
- Enhanced visual feedback during user actions
- Optimized timeline view with smart filtering
- Added loading states and progress indicators
- Standardized component spacing and alignment
- Improved responsive design implementation
- Enhanced form submission feedback
- Optimized navigation bar layout
- Implemented comprehensive guitar specifications structure
- Enhanced GearDetailsOverlay with dynamic field rendering
- Added smart category/subcategory display logic
- Improved header updates and state management
- Enhanced component organization and reusability
- Added support for boolean fields with checkbox inputs
- Improved form handling with local state management
- Enhanced visual hierarchy and consistency
- Optimized specification storage and retrieval
- Added proper type support for all specification fields
- Enhanced chat functionality with Gemini AI integration
- Improved service history parsing and date handling
- Added support for relative dates in service records
- Enhanced cost parsing with proper number formatting
- Improved provider and tag detection in service records
- Added local development environment with Firebase emulators
- Fixed date handling in service history records
- Enhanced error handling in chat components
- Improved service history display and sorting
- Added support for ownership status tracking

## License

MIT License - See LICENSE file for details 