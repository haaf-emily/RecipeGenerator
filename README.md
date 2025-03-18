# Ernährungsplan App

A personalized recipe recommendation application that suggests daily meals based on personal preferences, nutritional needs, and current weather conditions at your location.

## Features

- 🍽️ Personalized meal planning (breakfast, lunch, dinner) based on your dietary needs
- 🌡️ Weather-based recipe recommendations that adapt to the current temperature
- 📊 Personalized calorie requirements calculation using health metrics
- 🧮 User data collection through a step-by-step questionnaire
- 📍 Location-based personalization with automatic geolocation support
- 🌙 Dark mode support for comfortable usage at any time of day
- 🔄 Recipe regeneration option to get new meal suggestions
- 💾 Local caching of meal plans for quick access
- 🔍 Detailed recipe information with ingredients and nutritional data

## Project Structure

The application consists of two main components:

### Frontend

- **Framework**: Vue 3 with Composition API
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **State Management**: Custom stores using Vue's Reactivity API
- **HTTP Client**: Axios

### Backend

- **Server**: Node.js with Express
- **Caching**: node-cache for efficient data retrieval
- **API Documentation**: Swagger UI
- **External Data**: Integration with multiple third-party APIs for geocoding, weather, nutrition, and recipes

## Prerequisites

- Node.js (version 20.17.0+ recommended)
- npm or yarn
- API keys for third-party services:
  - Google Geocode API
  - API Ninjas (for weather data)
  - RapidAPI (for calorie calculation and recipe data)

## Getting Started

### Local Development

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ernaehrungsplan-app
   ```

2. Set up environment variables:
   Create a `.env` file in the project root with:

   ```
   GOOGLE_GEOCODE_API_KEY=your_key_here
   NINJA_API_KEY=your_key_here
   CALORIERAPIDAPI_KEY=your_key_here
   RAPIDAPI_KEY=your_key_here
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

5. Start the backend server:

   ```bash
   # From the root directory
   npm start
   ```

6. Start the frontend development server:

   ```bash
   # From the frontend directory
   npm run dev
   ```

7. The application will be available at:
   - Frontend: `http://localhost:5173` (or the port shown in your terminal)
   - Backend API: `http://localhost:8000`
   - API documentation: `http://localhost:8000/api-docs`

### Production Build

1. Build the frontend:

   ```bash
   # From the frontend directory
   npm run build
   ```

2. Deploy the built files to your server or use the Docker setup below

## Docker Setup

The application can be run with Docker for both development and production:

### Using Docker Compose

1. Ensure you have Docker and Docker Compose installed

2. Set up environment variables for the backend:
   Create a `.env` file in the project root with the required API keys (see above)

3. Start the application:

   ```bash
   docker compose up --build
   ```

4. The application will be available at:
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:8000`
   - API documentation: `http://localhost:8000/api-docs`

### Building Individual Docker Images

For the frontend:

```bash
docker build -t ernaehrungsplan-frontend -f Dockerfile.frontend .
```

For the backend:

```bash
docker build -t ernaehrungsplan-backend -f Dockerfile.backend .
```

For different CPU architectures:

```bash
docker build --platform=linux/amd64 -t ernaehrungsplan-app .
```

## Application Workflow

1. **User Data Collection**:

   - User selects gender (male/female)
   - User enters physical details (age, height, weight) via intuitive sliders
   - User selects activity level (from sedentary to extra active)
   - User enters location (optional, with geolocation support)

2. **Recipe Generation**:

   - System calculates personalized calorie requirements based on user metrics
   - System determines appropriate meal types based on the current temperature at the user's location
   - System fetches and displays suitable recipes that meet the calorie target

3. **Recipe Management**:
   - User can view recipe overview with calorie information for each meal
   - User can access detailed recipe information including ingredients and preparation instructions
   - User can regenerate the meal plan to get new recipe suggestions
   - User can view original recipe source via external links

## API Endpoints

The backend provides the following API endpoints:

### User Data Management

- `POST /api/user-data`: Store user information (gender, age, height, weight, activity level, location)
- `GET /api/user-data`: Retrieve user information
- `POST /api/clear-cache`: Clear all cached data (coordinates, temperatures, calories, recipes)

### Meal Planning

- `GET /get_meal_plan`: Generate a personalized meal plan based on user data and location

### System Management

- `GET /health`: Check if the server is running
- `GET /api-docs`: Access Swagger API documentation

The backend integrates with external APIs for:

- Geocoding (to convert location names to coordinates)
- Weather information (to determine temperature at the user's location)
- Calorie calculation (to determine daily caloric needs)
- Recipe retrieval (to find appropriate recipes based on temperature and calories)

## Project Structure

```
ernaehrungsplan-app/
├── backend/                  # Node.js backend code
│   ├── meal_server.js        # Main server file with API endpoints
│   ├── swagger.js            # Swagger configuration for API documentation
│   └── package.json          # Backend dependencies
├── frontend/                 # Vue.js frontend application
│   ├── src/
│   │   ├── components/       # Vue components for recipes and UI elements
│   │   ├── stores/           # State management using Vue's Reactivity API
│   │   ├── views/            # View components for the questionnaire screens
│   │   ├── router/           # Vue Router configuration
│   │   └── assets/           # Static assets and styles
│   ├── public/               # Public static files
│   └── package.json          # Frontend dependencies
├── docker-compose.yaml       # Docker Compose configuration
├── Dockerfile.backend        # Docker configuration for the backend
├── Dockerfile.frontend       # Docker configuration for the frontend
└── nginx.conf                # Nginx configuration for production deployment
```

## Future Enhancements

Potential future enhancements for this project:

- User accounts and authentication
- Saved favorite recipes
- Dietary restriction filters (vegetarian, vegan, gluten-free, etc.)
- Weekly meal planning
- Shopping list generation
- Mobile app version
- Recipe rating system
- Social sharing features

## Acknowledgements

- Created by Emily Haaf, Iliana Schotter, Roxanne Collett and Theresia Deubert
- Recipe data provided via third-party APIs
- Weather and geocoding services provided by external APIs
- Built with Vue.js, Express, Node.js, and Tailwind CSS
