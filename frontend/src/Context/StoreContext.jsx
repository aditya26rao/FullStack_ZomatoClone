
import React, { createContext, useEffect, useState, useCallback } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [category, setCategory] = useState('All');
  const [cartItems, setCartItems] = useState({});
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Added token management
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev[item.id];
      if (existingItem) {
        return {
          ...prev,
          [item.id]: { ...existingItem, quantity: existingItem.quantity + 1 }
        };
      } else {
        return {
          ...prev,
          [item.id]: { ...item, quantity: 1 }
        };
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId]) {
        if (updatedCart[itemId].quantity > 1) {
          updatedCart[itemId].quantity -= 1;
        } else {
          delete updatedCart[itemId];
        }
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const fetchFood = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/foods/');
      const data = await response.json();
      setFoodList(data);
    } catch (error) {
      console.error('Error fetching food:', error);
      setFoodList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  const getTotalCartAmount = useCallback(() => {
    let total = 0;
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      total += item.price * item.quantity;
    }
    return total;
  }, [cartItems]);

  const contextValue = {
    category,
    setCategory,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    foodList,
    getTotalCartAmount,
    loading,
    token,        // ✅ Added token
    setToken,     // ✅ Added setToken for login
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

