# Leli Rentals Mobile App

A React Native Expo mobile application that mirrors the Leli Rentals website functionality. This app provides a modern, user-friendly interface for browsing and renting various items including vehicles, homes, equipment, and more.

## Features

### 🏠 Home Screen
- Hero section with search functionality
- Popular categories display
- Why choose us section with key features
- Call-to-action sections

### 📱 Categories Screen
- Grid layout of all rental categories
- Category cards with images and descriptions
- Quick stats display
- Popular badges for trending categories

### 🔍 Search Screen
- Real-time search functionality
- Popular searches suggestions
- Filtered results display
- Search history (coming soon)

### 👤 Profile Screen
- User profile information
- Account statistics
- Menu items for different sections
- Theme toggle (Light/Dark mode)
- Sign out functionality

### 📋 Listings Screen
- Browse all available listings
- Category filters
- Search functionality
- Owner information display
- Rating and review system

### 📄 Listing Detail Screen
- Detailed listing information
- Image gallery
- Owner contact information
- Feature highlights
- Availability calendar
- Book now functionality

### 🔐 Authentication
- Login screen with email/password
- Signup screen with form validation
- Secure authentication flow
- User session management

## Technical Features

### 🎨 UI/UX
- Modern, clean design
- Dark/Light theme support
- Responsive layout
- Smooth animations and transitions
- Intuitive navigation

### 🏗️ Architecture
- React Native with Expo
- TypeScript for type safety
- Context API for state management
- React Navigation for routing
- Modular component structure

### 📱 Navigation
- Bottom tab navigation
- Stack navigation for detailed screens
- Modal presentations
- Deep linking support

### 🎯 State Management
- AuthContext for user authentication
- ThemeContext for theme management
- Local storage with AsyncStorage
- Real-time state updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leli-rentals-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Project Structure

```
leli-rentals-mobile/
├── App.tsx                 # Main app component
├── index.ts               # App entry point
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ListingsScreen.tsx
│   │   ├── ListingDetailScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── context/          # Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── components/       # Reusable components
│   └── utils/           # Utility functions
└── assets/              # Images and static assets
```

## Key Components

### Navigation Structure
- **Auth Stack**: Login and Signup screens
- **Main Stack**: Main app screens with listings and details
- **Tab Navigator**: Bottom tabs for main sections
- **Stack Navigator**: Nested navigation for detailed views

### Context Providers
- **AuthProvider**: Manages user authentication state
- **ThemeProvider**: Handles dark/light theme switching

### Screen Components
Each screen is designed to be:
- Fully responsive
- Accessible
- Performance optimized
- Easy to maintain

## Customization

### Themes
The app supports both light and dark themes. Theme settings are persisted using AsyncStorage and can be toggled from the profile screen.

### Styling
Styles are defined using React Native's StyleSheet API with support for:
- Dynamic theming
- Responsive design
- Platform-specific styling
- Consistent design system

### Configuration
App configuration is managed through:
- `app.json` for Expo settings
- Environment variables for API endpoints
- Context providers for runtime configuration

## Future Enhancements

### Planned Features
- Push notifications
- Real-time chat functionality
- Payment integration
- Advanced filtering options
- Offline support
- Social features
- Multi-language support

### Performance Optimizations
- Image caching and optimization
- Lazy loading for large lists
- Memory management improvements
- Bundle size optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: lelirentalsmail@gmail.com
- Phone: +254112081866

---

Built with ❤️ using React Native and Expo
