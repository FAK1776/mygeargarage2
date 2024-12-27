# MyGearGarage

A modern web application for musicians to manage their gear collection, track maintenance history, and plan future acquisitions.

## Features

- **Gear Management**
  - Add and manage musical instruments and equipment
  - Upload and manage gear photos
  - Track detailed specifications and history
  - Organize gear by status (owned, wanted, sold)

- **Service History**
  - Log maintenance records and modifications
  - Track service dates, providers, and costs
  - Support for relative date inputs (e.g., "last Monday")
  - Categorize entries as service, modification, or ownership changes

- **Smart Features**
  - AI-powered gear specification parser
  - Intelligent service history logging
  - "My Gear Guru" - AI chat assistant for collection insights
  - Natural language processing for maintenance records

- **User Experience**
  - Modern, responsive design
  - Intuitive gear card interface
  - Detailed gear overlay views
  - Real-time updates and feedback

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
  - Google AI (Gemini Pro) for natural language processing

- **Development & Deployment**
  - GitHub for version control
  - Firebase Hosting
  - Staging and production environments

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

## Project Structure

```
src/
├── components/         # React components
│   ├── chat/          # Chat interface components
│   ├── common/        # Shared components
│   └── gear/          # Gear-related components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # Service integrations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
