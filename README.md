# MyGearGarage

A modern web application for musicians to catalog and manage their gear collection. Built with React, TypeScript, and Firebase.

## Features

- **Intelligent Gear Parsing**:
  - Paste manufacturer specifications and let AI parse the details
  - Automatic categorization and organization
  - Support for multiple gear types (Guitars, Basses, etc.)

- **Comprehensive Gear Management**:
  - Track detailed specifications for each instrument
  - Manage ownership status (Own, Want, Sold)
  - Record modifications and service history
  - Price tracking and valuation

- **Image Management**:
  - Upload multiple photos per instrument
  - Support for drag-and-drop uploads
  - Image gallery with navigation
  - Delete unwanted images

- **Modern UI Components**:
  - Material UI integration for enhanced user interface
  - Responsive design with Tailwind CSS
  - Dynamic dialogs and overlays
  - Interactive image galleries

- **Search and Filter**:
  - Search across all gear specifications
  - Filter by ownership status
  - Quick access to your collection

## Technology Stack

- **Frontend**:
  - React 18
  - TypeScript 5
  - Tailwind CSS with animations
  - Vite 5 (build tool)
  - Material UI components
  - Lucide Icons
  - Radix UI primitives

- **AI Integration**:
  - Google Gemini Pro for specification parsing
  - Natural language processing for gear details

- **Backend & Services**:
  - Firebase Authentication
  - Firebase Firestore (database)
  - Firebase Storage (image storage)
  - Firebase Admin SDK
  - Google Cloud integration

- **Development Tools**:
  - ESLint with TypeScript support
  - PostCSS
  - Firebase Tools CLI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Google Cloud account (for Gemini API)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FAK1776/mygeargarage2.git
cd mygeargarage2
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and configure your environment variables:
   - Copy `.env.example` to `.env` in the root directory
   - Add your Firebase and Google Cloud configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_AI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run dev
```

### Firebase Configuration

1. Enable Authentication:
   - Go to Firebase Console
   - Set up Email/Password authentication

2. Set up Firestore:
   - Create a new Firestore database
   - Deploy security rules using `npm run deploy:rules`

3. Configure Storage:
   - Enable Firebase Storage
   - Configure CORS settings using the provided scripts
   - Deploy storage rules using `npm run deploy:rules`

## Development

### Project Structure

```
src/
├── components/         # React components
│   ├── gear/          # Gear-specific components
│   │   └── details/   # Detailed view components
│   ├── layout/        # Layout components
│   └── ui/            # Reusable UI components
├── config/            # Configuration files
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── pages/             # Page components
├── services/          # Service layer
├── styles/            # Global styles
├── types/             # TypeScript types
└── utils/             # Utility functions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to Firebase
- `npm run deploy:hosting` - Deploy only hosting
- `npm run deploy:rules` - Deploy Firestore and Storage rules

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/) and [Material UI](https://mui.com/)
- Icons from [Lucide](https://lucide.dev/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Powered by [Firebase](https://firebase.google.com/)
- AI features powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
