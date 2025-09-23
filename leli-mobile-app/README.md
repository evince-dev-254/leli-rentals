# Leli Rentals Mobile App

A React Native mobile application for the Leli Rentals platform, built with Expo and TypeScript.

## Features

- 🔐 **Authentication**: Firebase Auth with email/password and social login
- 🏠 **Listings**: Browse and search rental listings
- 📱 **Responsive Design**: Optimized for mobile devices
- 🎨 **Modern UI**: Material Design 3 with custom theming
- 🌙 **Dark Mode**: Light and dark theme support
- 📍 **Location Services**: GPS integration for location-based features
- 🔔 **Notifications**: Push notifications and in-app alerts
- 💳 **Payments**: Integrated payment processing
- 📸 **Camera**: Image capture and upload functionality

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Firebase** for backend services
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Expo Vector Icons** for icons
- **React Hook Form** for form handling
- **AsyncStorage** for local storage

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and external services
├── contexts/           # React contexts (Auth, Theme, etc.)
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # App constants and theme
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leli-mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Copy your Firebase configuration to `src/services/firebase.ts`
   - Update the config object with your project details

4. Start the development server:
```bash
npm start
```

5. Run on device/simulator:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication, Firestore, and Storage
3. Update the configuration in `src/services/firebase.ts`

### Environment Variables

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## Building for Production

### Android

```bash
expo build:android
```

### iOS

```bash
expo build:ios
```

## Features Implementation Status

- ✅ Project setup and configuration
- ✅ Authentication system
- ✅ Navigation structure
- ✅ Theme system
- ✅ Basic UI components
- 🔄 Listings management
- 🔄 Booking system
- 🔄 Payment integration
- 🔄 Push notifications
- 🔄 Image upload
- 🔄 Location services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@leli-rentals.com or join our Discord community.
