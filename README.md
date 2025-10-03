
# Oceanus - AI-Driven Marine Data Platform

A comprehensive React-based frontend for oceanographic, fisheries, and molecular biodiversity data analysis with role-based authentication and AI-powered insights.

## 🌊 Features

### Authentication & Authorization
- **Role-based access control** with 4 user types:
  - `admin` - Full system access and user management
  - `researcher` - Data upload, analysis, and full dashboard access
  - `policy_user` - Data visualization and reporting
  - `guest` - Read-only data exploration
- **Secure login** with session management and auto-logout
- **Route protection** with unauthorized access handling

### Core Functionality
- **Dashboard** - Real-time metrics, recent uploads, and quick actions
- **Data Upload** - Multi-format upload with drag/drop for Ocean Data, Fish Data, Otoliths, and eDNA
- **Data Explorer** - Advanced filtering, search, and paginated data browsing
- **Interactive Visualizations** - Maps with sample points, charts, and layer controls
- **AI Tools** - Species prediction, 3D otolith viewer, and DNA sequence matching
- **Taxonomy Browser** - Hierarchical species classification with detailed profiles
- **Report Generation** - Custom reports with PDF/CSV export
- **Admin Panel** - User management, dataset approvals, and activity logs
- **User Profile** - Settings, API key management, and preferences

### Technical Features
- **Dark theme** as default with light mode toggle
- **Responsive design** for all screen sizes
- **Real-time notifications** with toast system
- **Session management** with expiry handling
- **Mock API integration** ready for backend replacement
- **Accessible UI** with ARIA labels and keyboard navigation

## 🚀 Quick Start

### Development (Replit)

This project is optimized for Replit development:

1. **Fork this Repl** or import the repository
2. **Run the project**:
   ```bash
   npm run dev
   ```
3. **Access the application** at the provided Replit URL
4. **Login with demo credentials** (see below)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd oceanus
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npm install --save-dev cross-env
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5000`

## 🔐 Demo Credentials

Use these credentials to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@oceanus` | `password` | Full system access, user management |
| **Researcher** | `res@oceanus` | `password` | Data upload, analysis, dashboard |
| **Policy User** | `policy@oceanus` | `password` | Visualizations, reports |
| **Guest** | `guest@oceanus` | `password` | Read-only data exploration |

## 🧪 Testing Session Expiry

To test the session management and auto-logout functionality:

1. **Login** with any demo account
2. **Open browser dev tools** → Application/Storage → Local Storage
3. **Find the key** `oceanus-auth` 
4. **Modify the token** to an invalid value or delete it
5. **Navigate to any page** - you should be redirected to login
6. **Or wait** - sessions are configured to expire (can be modified in auth store)

## 🔌 API Integration

### Mock API Endpoints

The application includes comprehensive mock APIs that simulate real backend behavior:

- **Authentication**: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`
- **Dashboard**: `/api/dashboard/summary`
- **Data Management**: `/api/datasets`, `/api/upload`
- **AI Services**: `/api/ai/species-predict`, `/api/ai/dna-match`
- **Taxonomy**: `/api/taxonomy/tree`

### Replacing with Real Backend

To connect to a real backend:

1. **Update API endpoints** in `client/src/lib/queryClient.ts`
2. **Configure authentication** in `client/src/lib/auth.ts`
3. **Set environment variables**:
   ```bash
   VITE_API_BASE_URL=https://your-api-url.com
   VITE_ENABLE_MOCK_API=false
   ```
4. **Update data types** in `shared/schema.ts` to match your API

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_MOCK_API=true

# External Services (when available)
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_WEATHER_API_KEY=your_weather_api_key

# Development
VITE_LOG_LEVEL=debug
>>>>>>> c03591e (Add comprehensive README and base UI components for the Oceanus platform)
