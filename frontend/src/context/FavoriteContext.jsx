import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setFavoritesList([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.get('/favorites');
      if (data.success) {
        setFavoritesList(data.data);
        const ids = new Set(data.data.map((item) => item._id));
        setFavoriteIds(ids);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      toast.error('Please log in to save properties to your favorites');
      return false;
    }

    try {
      const { data } = await API.post(`/favorites/${propertyId}`);
      if (data.success) {
        toast.success(data.message);
        fetchFavorites();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating favorite');
      return false;
    }
  };

  const isFavorite = (propertyId) => {
    return favoriteIds.has(propertyId);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoritesList,
        favoriteIds,
        loading,
        toggleFavorite,
        isFavorite,
        fetchFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);
