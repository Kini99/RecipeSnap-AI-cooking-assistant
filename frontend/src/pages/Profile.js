import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { recipeService } from '../services/api';

export default function Profile() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [savedResponse, userResponse] = await Promise.all([
          recipeService.getSaved(),
          recipeService.getUserRecipes(),
        ]);
        setSavedRecipes(savedResponse.data);
        setUserRecipes(userResponse.data);
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUnsaveRecipe = async (recipeId) => {
    try {
      await recipeService.unsave(recipeId);
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      setError('Failed to unsave recipe. Please try again.');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.delete(recipeId);
      setUserRecipes(userRecipes.filter(recipe => recipe._id !== recipeId));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('saved')}
                className={`${
                  activeTab === 'saved'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Saved Recipes
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`${
                  activeTab === 'created'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Recipes
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'saved' ? (
            savedRecipes.length > 0 ? (
              savedRecipes.map((recipe) => (
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
                      <button
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                        className="btn-secondary"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={() => handleUnsaveRecipe(recipe._id)}
                        className="btn-secondary bg-gray-200 text-gray-700"
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No saved recipes yet.</p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary mt-4"
                >
                  Browse Recipes
                </button>
              </div>
            )
          ) : (
            userRecipes.length > 0 ? (
              userRecipes.map((recipe) => (
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
                      <button
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                        className="btn-secondary"
                      >
                        View Recipe
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                          className="btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe._id)}
                          className="btn-secondary bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">You haven't created any recipes yet.</p>
                <button
                  onClick={() => navigate('/create-recipe')}
                  className="btn-primary mt-4"
                >
                  Create Recipe
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
} 