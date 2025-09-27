# 🐱 Poppy Treats - Find Cat Food & Treats Near You

A beautiful, mobile-first web application to help you find Tiki Cat pate and Greenies treats for your feline friend at nearby pet stores.

## ✨ Features

- **Real-time Location**: Uses your device's GPS to find nearby pet stores
- **Google Places Integration**: Real pet store data with ratings, hours, and contact info
- **Product Availability**: Shows which stores likely have Greenies and Tiki Cat products
- **Mobile-First Design**: Optimized for iOS with native-like gestures and interactions
- **Interactive Map**: Google Maps integration with custom markers and info windows
- **Apple Maps Style UI**: Beautiful card-based interface inspired by Apple Maps

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Google Maps API key with the following APIs enabled:
  - Maps JavaScript API
  - Places API

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd PoppyTreats
   npm install
   ```

2. **Set up your Google Maps API key:**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. **Get your Google Maps API key:**
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a new project or select existing one
   - Enable the Maps JavaScript API and Places API
   - Create credentials (API key)
   - Add your domain to the API key restrictions for security

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Experience

The app is designed to feel like a native iOS app:

- **Safe Area Support**: Respects device safe areas (notches, home indicators)
- **Touch Optimized**: Large touch targets and gesture-friendly interactions
- **Smooth Animations**: Framer Motion powered animations
- **iOS-style Cards**: Bottom sheet style store listings
- **Haptic-like Feedback**: Visual feedback that mimics haptic responses

## 🗺️ How It Works

1. **Location Request**: The app asks for your location permission
2. **Store Search**: Uses Google Places API to find nearby pet stores
3. **Inventory Simulation**: Intelligently simulates product availability based on store type
4. **Interactive Results**: Tap stores on the map or in the list to see details

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Maps**: Google Maps JavaScript API & Places API
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component

## 🎨 Design System

The app uses a warm, playful color palette perfect for a pet-focused application:

- **Primary**: Orange tones (#f17316) - energetic and friendly
- **Secondary**: Blue tones (#0ea5e9) - trustworthy and calming  
- **Success**: Green for available products
- **Warning**: Amber for limited availability

## 📂 Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # Reusable UI components
├── contexts/           # React contexts (Google Maps)
├── services/           # API services (Google Places)
└── styles/            # Global styles
```

## 🔒 Privacy & Security

- Location data is only used locally for finding nearby stores
- No personal data is stored or transmitted
- API keys are properly secured with environment variables

## 🤝 Contributing

This is a personal project for finding treats for Poppy the cat! But if you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🚀 Deployment

### Digital Ocean App Platform

The app is ready for production deployment on Digital Ocean App Platform:

#### Deployment Steps:

1. **Push to GitHub** - Ensure all code is committed and pushed to your main branch
2. **Connect Repository** - Link your GitHub repository to Digital Ocean App Platform  
3. **Configure Environment Variables** in the Digital Ocean dashboard:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
4. **Deploy** - Digital Ocean will automatically:
   - Detect the `.do/app.yaml` configuration
   - Build the Next.js application
   - Deploy to production
   - Set up health checks at `/api/health`

#### Production Features:

- ✅ **Optimized build** with standalone output
- ✅ **Security headers** for production safety
- ✅ **Image optimization** with WebP/AVIF support  
- ✅ **Health check endpoint** for monitoring
- ✅ **Automatic deployments** on push to main branch
- ✅ **Environment variable management**

The app will be available at your Digital Ocean App Platform URL once deployed.

### Environment Variables Required

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key with Maps JavaScript API and Places API enabled

## 📄 License

This project is for personal use. The cat logo and branding are custom designed for Poppy.

---

Made with ❤️ for Poppy Bolt 🐱
