import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import { buildApiUrl } from '../../config/api';

export default function FoodDisplay({ searchQuery = '' }) {
  const { category } = useContext(StoreContext);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (category && category !== 'All') {
          params.category = category;
        }

        const response = await axios.get(buildApiUrl('/api/foods/'), { params });
        setFoodList(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        console.error('Error fetching food:', requestError);
        setFoodList([]);
        setError('Unable to load dishes right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [category]);

  const query = searchQuery.trim().toLowerCase();
  const filteredFoodList = foodList.filter((item) => {
    if (!query) return true;
    return (
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top Dishes {category && category !== 'All' ? `- ${category}` : ''}</h2>

      {loading && <p className="food-display-feedback">Loading dishes...</p>}
      {!loading && error && <p className="food-display-feedback error">{error}</p>}

      {!loading && !error && (
        <div className="food-display-list">
          {filteredFoodList.length > 0 ? (
            filteredFoodList.map((item) => (
              <FoodItem
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                description={item.description}
              />
            ))
          ) : (
            <p className="food-display-feedback">No dishes match your current filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
