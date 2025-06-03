# RecipeSnap - AI Cooking Assistant

RecipeSnap is an intelligent cooking assistant that helps users discover recipes based on ingredients they have in their fridge. Simply take a picture of your ingredients, and let AI suggest delicious recipes you can make!

## Features

- 📸 Upload or capture images of ingredients
- 🔍 AI-powered ingredient detection and recognition
- 📝 Automatic recipe suggestions based on available ingredients
- 🍳 Detailed cooking instructions and ingredient lists
- 💾 Save favorite recipes for later

## Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB for database
- Mongoose for ODM

### AI/ML Models
- Image Captioning: nlpconnect/vit-gpt2-image-captioning
- Object Detection: facebook/detr-resnet-50
- Recipe Generation: mistralai/Mistral-7B-Instruct (local Hugging Face model)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Python 3.8+ (for ML models)
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RecipeSnap.git
cd RecipeSnap
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Create `.env` file in the backend directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_uri
     PORT=5000
     JWT_SECRET=your_jwt_secret
     ```

5. Start the development servers:
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend
     npm start
     ```

## Project Structure

```
RecipeSnap/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
├── backend/              # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
└── ml_models/           # Python scripts for ML models
    ├── image_captioning/
    └── object_detection/
```

## API Endpoints

- `POST /api/upload` - Upload ingredient image
- `GET /api/recipes` - Get recipe suggestions
- `POST /api/recipes/save` - Save favorite recipe
- `GET /api/recipes/saved` - Get saved recipes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.