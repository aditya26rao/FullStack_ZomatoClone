import React, { useContext, useMemo } from 'react';
import './FoodItem.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { buildMediaUrl } from '../../config/api';

export default function FoodItem({ id, name, image, price, description }) {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  const numericPrice = Number(price) || 0;
  const quantity = cartItems[id]?.quantity || 0;
  const totalPrice = quantity > 0 ? numericPrice * quantity : numericPrice;
  const rating = useMemo(() => Math.floor(Math.random() * 3) + 3, []);

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) =>
      i < rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#ccc" />
    );

  const handleAdd = () => {
    addToCart({ id, name, image, price: numericPrice });
  };

  const handleRemove = () => {
    removeFromCart(id);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          src={buildMediaUrl(image) || assets.default_food_image}
          alt={name || 'Food item'}
          className="food-item-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.default_food_image;
          }}
        />

        {!quantity ? (
          <img
            className="add"
            onClick={handleAdd}
            src={assets.add_icon_white}
            alt="Add to cart"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={handleRemove}
              src={assets.remove_icon_red}
              alt="Remove from cart"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleRemove()}
            />
            <p>{quantity}</p>
            <img
              onClick={handleAdd}
              src={assets.add_icon_green}
              alt="Add more"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <h3 className="food-item-name">
            {name?.length > 20 ? `${name.slice(0, 20)}...` : name}
          </h3>
          <div className="food-item-stars">{renderStars()}</div>
        </div>
      </div>

      <p className="food-item-description">
        {description
          ? description.length > 60
            ? `${description.slice(0, 60)}...`
            : description
          : 'No description available.'}
      </p>

      <p className="food-item-price">
        {formatCurrency(totalPrice)}
        {quantity > 1 && (
          <span className="unit-price">
            {' '}
            ({formatCurrency(numericPrice)} x {quantity})
          </span>
        )}
      </p>
    </div>
  );
}
