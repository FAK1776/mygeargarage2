# My Gear Garage - Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project access with appropriate permissions
- Google Cloud Console access (for API management)
- Access to environment variables and secrets

## Environment Setup

### Environment Files
The project uses three environment files:
- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Required environment variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Staging Deployment

### First-Time Setup

1. Login to Firebase:
```bash
firebase login
```

2. Select project:
```bash
firebase use staging
```

3. Verify environment configuration:
   - Check `.env.staging` exists
   - Verify Firebase project settings
   - Confirm Gemini API access

### Deployment Process

1. Build and deploy to staging:
```bash
npm run deploy:staging
```

This command:
- Uses staging environment variables
- Builds optimized assets
- Deploys to staging Firebase hosting
- URL: staging-my-gear-garage.web.app

### Staging Verification

1. Check deployment status:
```bash
firebase hosting:channel:list
```

2. Verify functionality:
   - Test user authentication
   - Verify image uploads
   - Check Gemini API integration
   - Test service history parsing
   - Confirm environment variables

## Production Deployment

### Pre-deployment Checklist

1. Code Review
   - All PRs merged and approved
   - No outstanding issues
   - Tests passing
   - Build size optimized

2. Environment Check
   - Production environment variables set
   - API keys verified
   - Firebase configuration correct

### Deployment Process

1. Switch to production project:
```bash
firebase use production
```

2. Build and deploy:
```bash
npm run deploy:production
```

This command:
- Uses production environment variables
- Creates optimized production build
- Deploys to production hosting
- URL: my-gear-garage.web.app

### Post-deployment Verification

1. Smoke Tests
   - User authentication
   - Image upload/management
   - Gear specification parsing
   - Service history functionality
   - Timeline features

2. Performance Checks
   - Load times (<3s target)
   - Image loading performance
   - API response times
   - Error handling

## Rollback Procedures

### Staging Rollback

1. List previous deployments:
```bash
firebase hosting:releases list
```

2. Rollback to previous version:
```bash
firebase hosting:rollback
```

### Production Rollback

1. Immediate rollback:
```bash
firebase hosting:rollback --only hosting:production
```

2. Verify rollback:
   - Check application functionality
   - Monitor error rates
   - Verify API integrations

## Monitoring and Maintenance

### Firebase Console
- Monitor hosting status
- Check authentication metrics
- Review storage usage
- Track API usage

### Google Cloud Console
- Monitor Gemini API usage
- Check API quotas
- Review error logs

### Application Monitoring
- Check error rates
- Monitor performance metrics
- Review user feedback

## Troubleshooting

### Common Issues

1. Build Failures
   - Verify environment variables
   - Check dependency versions
   - Review build logs

2. Deployment Failures
   - Confirm Firebase CLI login
   - Check project permissions
   - Verify hosting configuration

3. API Issues
   - Verify API keys
   - Check service status
   - Review quota usage

### Support Resources
- Firebase Documentation
- Google Cloud Support
- Project Documentation
- Technical Team Contacts

## Security Considerations

1. Environment Variables
   - Never commit .env files
   - Rotate API keys regularly
   - Use separate keys per environment

2. Access Control
   - Manage Firebase IAM carefully
   - Review security rules
   - Monitor access logs

3. API Security
   - Implement rate limiting
   - Monitor for unusual activity
   - Regular security audits
``` 