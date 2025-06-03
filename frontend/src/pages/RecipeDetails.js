import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { recipeService } from '../services/api';

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getById(id);
        setRecipe(response.data);
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSaveRecipe = async () => {
    try {
      await recipeService.save(id);
      setRecipe({ ...recipe, saved: true });
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
    }
  };

  const handleUnsaveRecipe = async () => {
    try {
      await recipeService.unsave(id);
      setRecipe({ ...recipe, saved: false });
    } catch (err) {
      setError('Failed to unsave recipe. Please try again.');
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.delete(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete recipe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
            <p className="text-gray-200">{recipe.description}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            {user && (
              <>
                <button
                  onClick={() =>
                    recipe.saved ? handleUnsaveRecipe() : handleSaveRecipe()
                  }
                  className={`btn-secondary ${
                    recipe.saved ? 'bg-gray-200 text-gray-700' : ''
                  }`}
                >
                  {recipe.saved ? 'Saved' : 'Save Recipe'}
                </button>
                {user._id === recipe.author._id && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-recipe/${id}`)}
                      className="btn-secondary"
                    >
                      Edit Recipe
                    </button>
                    <button
                      onClick={handleDeleteRecipe}
                      className="btn-secondary bg-red-600 hover:bg-red-700"
                    >
                      Delete Recipe
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 