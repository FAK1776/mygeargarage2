# My Gear Garage

A web application for musicians to track their gear collection, including purchases, sales, service history, and maintenance records.

## Features

- **Gear Management**
  - Add and track musical instruments and equipment
  - Upload and manage multiple images per item
  - Track purchase and sale prices
  - Record ownership dates

- **Service History**
  - Log maintenance and service records
  - Track service providers and costs
  - Categorize service types (maintenance, repairs, modifications)
  - AI-powered service record parsing

- **Timeline View**
  - Chronological view of all gear-related events
  - Filter by instrument or event type (purchases, sales, service, maintenance)
  - Visual timeline with year markers
  - Image display for purchase and sale events

- **Modern UI**
  - Responsive design for all devices
  - Clean, intuitive interface
  - Real-time updates
  - Dark mode support

## Technology Stack

- React + TypeScript
- Vite for build tooling
- Firebase (Authentication, Firestore, Storage, Hosting)
- TailwindCSS for styling
- Google AI (Gemini) for natural language processing

## Development

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

## Recent Updates

- Enhanced timeline UI with chronological ordering (newest to oldest)
- Added main gear images to purchase and sale events
- Improved date handling for various formats
- Added proper event filtering with toggle buttons
- Standardized text sizes and colors for better readability
- Fixed service history integration in timeline
- Added responsive design improvements

## License

MIT License - See LICENSE file for details
