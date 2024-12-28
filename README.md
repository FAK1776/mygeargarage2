# MyGearGarage

A modern web application for musicians to manage their gear collection, track maintenance history, and plan future acquisitions.

## Features

- **Gear Management**
  - Add and manage musical instruments and equipment
  - Upload and manage gear photos
  - Track detailed specifications and history
  - Organize gear by status (Own, Want, Sold)
  - Load sample data for testing and demonstration
  - Flexible filtering and search capabilities

- **Status Management**
  - Global filtering to view All/Own/Want/Sold gear
  - Individual status toggles on each gear card
  - Visual status indicators with color coding
    - Green for Owned gear
    - Blue for Wanted gear
    - Gray for Sold gear

- **Profile and Analytics**
  - Comprehensive collection overview
  - Statistics by gear type and brand
  - AI-generated gear stories with multiple writing styles
  - Collection insights and analysis
  - Historical tracking of collection evolution

- **Search and Filter**
  - Comprehensive search across all specifications
  - Filter by gear status (All/Own/Want/Sold)
  - Real-time search results
  - Search through specifications and details

- **Smart Features**
  - AI-powered gear stories and insights
  - Multiple narrative styles (Casual, Technical, Historical, Humorous, Poetic)
  - Collection analysis and pattern recognition
  - Personalized gear journey narratives

- **User Experience**
  - Modern, responsive design
  - Intuitive gear card interface
  - Detailed gear overlay views
  - Real-time updates and feedback
  - Comprehensive FAQ and support resources

## Technology Stack

- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - Vite for build tooling
  - React Router for navigation

- **Backend & Services**
  - Firebase Authentication
  - Firebase Firestore for data storage
  - Firebase Storage for image handling
  - Google AI (Gemini Pro) for story generation and insights

- **Development & Deployment**
  - GitHub for version control
  - Firebase Hosting
  - Staging and production environments
  - Automated deployment workflows

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/mygeargarage2.git
cd mygeargarage2
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with the following variables:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

6. Deploy
```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy
```

## Testing and Development

1. Sample Data
The application includes a sample data feature that can be used to populate your collection with example guitars. This is useful for:
- Testing the application features
- Demonstrating the UI and functionality
- Development and debugging

To load sample data:
1. Log in to the application
2. Click the "Load Sample Data" button in the toolbar
3. Sample guitars will be added to your collection

The sample data includes a variety of guitars with detailed specifications:
- Electric guitars (Fender Stratocaster, Gibson Les Paul)
- Acoustic guitars (Martin D-28, Taylor 814ce)
- Semi-hollow/hollow body (Gretsch Nashville)

## Project Structure

```
src/
├── components/         # React components
│   ├── chat/          # Chat interface components
│   ├── common/        # Shared components
│   ├── gear/          # Gear-related components
│   ├── layout/        # Layout components (Navbar, Footer, FAQ)
│   └── ui/            # UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   ├── MyGear.tsx     # Main gear management page
│   ├── Profile.tsx    # User profile and analytics
│   └── AddGear.tsx    # Gear addition form
├── services/          # Service integrations
│   ├── gearService.ts # Gear data management
│   ├── storyService.ts# Story generation service
│   └── llmService.ts  # LLM integration service
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Recent Updates

- Added AI-powered gear story generation with multiple writing styles
- Implemented collection insights and analytics
- Added comprehensive FAQ section
- Enhanced profile page with collection statistics
- Improved footer with documentation links
- Added story saving functionality
- Enhanced status filtering with "All" option
- Improved component organization and reusability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
