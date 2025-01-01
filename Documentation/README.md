# My Gear Garage

A web application for musicians to track their gear collection, including purchases, sales, service history, and maintenance records.

## Features

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
- AI-powered service record parsing
- Chronological timeline view of all events

### Timeline View
- Chronological display of all gear-related events (newest first)
- Filter by event type (purchases, sales, service, maintenance)
- Visual timeline with year markers
- Image display for purchase and sale events
- Narrative format for event descriptions

### Profile & Insights
- Collection statistics and overview
- Gear distribution by type and brand
- AI-generated collection insights
- Custom gear stories in various styles

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
# Add your Firebase and Google AI API keys
```

4. Start development server
```bash
npm run dev
```

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

## License

MIT License - See LICENSE file for details 