import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import './ExploreMenu.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { StoreContext } from '../../Context/StoreContext';
import { buildApiUrl, buildMediaUrl } from '../../config/api';
import { assets, menu_list } from '../../assets/assets';

const localFallbacks = menu_list.map((item) => item.menu_image);
const allCategoryImage = assets.basket_icon;

export default function ExploreMenu() {
  const { category, setCategory } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(buildApiUrl('/api/categories/'));
        const data = response.data;
        const categoriesArray = Array.isArray(data) ? data : data.categories || [];
        setCategories(categoriesArray);
      } catch (requestError) {
        console.error('Error fetching categories:', requestError);
        setError('Failed to load categories.');
      } finally {
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

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Meal Categories</h1>

      {loading && <p>Loading categories...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

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
                src={allCategoryImage}
                alt="All"
                className="meal-image"
              />
              <h3>All</h3>
            </div>

            {categories.map((item, index) => (
              <div
                key={item.id}
                className={`explore-menu-list-item ${category === item.name ? 'active' : ''}`}
                onClick={() => setCategory((prev) => (prev === item.name ? 'All' : item.name))}
              >
                <img
                  src={buildMediaUrl(item.image) || localFallbacks[index % localFallbacks.length]}
                  alt={item.name}
                  className="meal-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = localFallbacks[index % localFallbacks.length];
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
