# Trip-sonality

A personalized travel planning application designed for solo travelers based on MBTI personality types, travel preferences, and budget constraints.
[Demo Videos of out Project Here](https://youtu.be/ZaacbkefUq0)

## About Trip-sonality

Trip-sonality is a unique travel planning platform that goes beyond generic itineraries to create deeply personalized solo travel experiences. We believe that the way you travel should reflect who you are - your personality, preferences, and how you experience the world.

### Key Features

- **MBTI-Based Recommendations**: Tailored suggestions based on your personality type
- **Budget-Conscious Planning**: All recommendations respect your financial parameters
- **Themed Journeys**: Currently supporting movie-themed trips with more themes coming soon
- **Interactive Maps**: Visualize your journey with an intuitive map interface
- **AI-Powered Personalization**: Seven specialized AI agents collaborate to craft your perfect itinerary
- **Calendar Integration**: Easily add your trip to your personal calendar
- **Explore Community Trips**: Browse publicly shared itineraries for inspiration

## Getting Started

### Prerequisites

- Next.js (v16+)
- Python (v3.8+)
- MongoDB
- Google Places API Key
- OpenAI API Key
- Tavily API Key

### Environment Variables

#### Backend (.env file)

```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=trip_agent
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

#### Frontend (.env file)

```
VITE_GOOGLE_MAPS_API_KEY=your_google_places_api_key
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/trip-sonality.git
cd trip-sonality
```

2. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server

```bash
cd backend
uvicorn app:app --reload
```

2. In a new terminal, start the frontend development server

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## System Architecture

Trip-sonality uses a collaborative AI agent system to create personalized itineraries:

1. **Summarize Agent**: Analyzes MBTI traits and preferences
2. **Search Agent**: Gathers destination information
3. **Web Content Agent**: Collects detailed POI data
4. **POI Activity Agent**: Identifies personality-matching places and activities
5. **Plan Agent**: Creates coherent day-by-day itineraries
6. **Critic Agent**: Reviews for consistency with user preferences
7. **Format Agent**: Produces the final polished itinerary

Our multi-agent architecture is inspired by the [AutoGen MagentiCone design pattern](https://github.com/Azure-Samples/python-ai-agent-frameworks-demos/blob/main/autogen_magenticone.py) from Azure Samples' AI agent frameworks. This pattern enables sophisticated group chat interactions between specialized agents, allowing them to collaborate on complex tasks while maintaining distinct roles and responsibilities.

## Usage Guide

1. **Select your MBTI personality type** - This helps us understand your travel style
2. **Set your budget** - Ensures recommendations match your financial parameters
3. **Choose a theme** - Currently supporting movie-themed trips
4. **Select your destination** - Where would you like to explore?
5. **Define trip duration** - How many days will you be traveling?
6. **Chat about your preferences** - Tell us what you like and dislike
7. **Generate your itinerary** - Our AI agents will create your personalized plan
8. **Explore and refine** - Browse your recommendations and provide feedback
9. **Share or save to calendar** - Export your final itinerary

## The Story Behind Trip-sonality

Trip-sonality was born from our team member Emma's frustrating experience with mainstream travel planners. As an INFJ who values meaningful cultural experiences over tourist hotspots, she found existing platforms created generic, impersonal itineraries that didn't account for her introvert energy levels or respect her budget constraints.

We built Trip-sonality to solve these pain points by creating deeply personalized travel experiences that reflect not just where you want to go, but how you prefer to experience the world.

## Contributing

We welcome contributions to Trip-sonality!

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to our beta testers for their valuable feedback
- OpenAI for powering our AI agents
- Google Maps for location services
- [Azure-Samples/python-ai-agent-frameworks-demos](https://github.com/Azure-Samples/python-ai-agent-frameworks-demos) for inspiration on our multi-agent architecture, specifically the AutoGen MagentiCone pattern
