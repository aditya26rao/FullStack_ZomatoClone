
import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

export default function FoodDisplay({ searchQuery = '' }) {   // ✅ Accept searchQuery as prop
  const { category } = useContext(StoreContext);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const foodDisplayRef = useRef(null);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:8000/api/foods/';
        if (category && category !== 'All') {
          url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await axios.get(url.trim());
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setFoodList(data);
        } else {
          setFoodList([]);
          showPopup(`No dishes found for "${category}"`);
        }
      } catch (error) {
        console.error('❌ Error fetching food:', error);
        setFoodList([]);
        showPopup('Failed to load food items.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();

    if (foodDisplayRef.current) {
      foodDisplayRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [category]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 3000);
  };

  // ✅ Apply search filtering here:
  const filteredFoodList = foodList.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='food-display' id='food-display' ref={foodDisplayRef}>
      <h2>Top Dishes {category && category !== 'All' ? `: ${category}` : ''}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="food-display-list">
          {filteredFoodList.length > 0 ? (
            filteredFoodList.map(item => (
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
            <p>No dishes match your search.</p>
          )}
        </div>
      )}

      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}
    </div>
  );
}
