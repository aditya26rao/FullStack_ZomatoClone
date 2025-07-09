
import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import './ExploreMenu.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { StoreContext } from '../../Context/StoreContext';

export default function ExploreMenu() {
  const { category, setCategory } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/');
        const data = response.data;
        const categoriesArray = Array.isArray(data) ? data : data.categories || [];
        setCategories(categoriesArray);
        setLoading(false);
      } catch (error) {
        setError('Failed to load categories.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += offset;
    }
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100?text=No+Image';
    return url.startsWith('http') ? url : `http://localhost:8000${url}`;
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Meal Categories</h1>

      {loading && <p>Loading categories...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div className="explore-menu-wrapper">
          <button className="scroll-button left" onClick={() => scroll(-200)}>
            <FaChevronLeft />
          </button>

          <div className="explore-menu-list" ref={scrollRef}>
            <div
              className={`explore-menu-list-item ${category === 'All' ? 'active' : ''}`}
              onClick={() => setCategory('All')}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/598/598348.png"
                alt="All"
                className="meal-image"
              />
              <h3>All</h3>
            </div>

            {categories.map((item) => (
              <div
                key={item.id}
                className={`explore-menu-list-item ${category === item.name ? 'active' : ''}`}
                onClick={() => setCategory(prev => (prev === item.name ? 'All' : item.name))}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="meal-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>

          <button className="scroll-button right" onClick={() => scroll(200)}>
            <FaChevronRight />
          </button>
        </div>
      )}

      <hr />
    </div>
  );
}
