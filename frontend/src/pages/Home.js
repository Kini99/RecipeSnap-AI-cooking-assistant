import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { recipeService } from '../services/api';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await recipeService.getAll();
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSaveRecipe = async (recipeId) => {
    try {
      await recipeService.save(recipeId);
      setRecipes(recipes.map(recipe =>
        recipe._id === recipeId
          ? { ...recipe, saved: true }
          : recipe
      ));
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
    }
  };

  const handleUnsaveRecipe = async (recipeId) => {
    try {
      await recipeService.unsave(recipeId);
      setRecipes(recipes.map(recipe =>
        recipe._id === recipeId
          ? { ...recipe, saved: false }
          : recipe
      ));
    } catch (err) {
      setError('Failed to unsave recipe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Recipes</h1>
        {user && (
          <Link
            to="/create-recipe"
            className="btn-primary"
          >
            Create Recipe
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="card">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/recipe/${recipe._id}`}
                  className="btn-secondary"
                >
                  View Recipe
                </Link>
                {user && (
                  <button
                    onClick={() =>
                      recipe.saved
                        ? handleUnsaveRecipe(recipe._id)
                        : handleSaveRecipe(recipe._id)
                    }
                    className={`btn-secondary ${
                      recipe.saved ? 'bg-gray-200 text-gray-700' : ''
                    }`}
                  >
                    {recipe.saved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No recipes found.</p>
          {user && (
            <Link to="/create-recipe" className="btn-primary mt-4 inline-block">
              Create Your First Recipe
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 