import React, { createContext, useEffect, useMemo, useState } from 'react';

export const StoreContext = createContext(null);

const CART_STORAGE_KEY = 'cartItems';
const TOKEN_STORAGE_KEY = 'token';

const readStoredCart = () => {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawCart) return {};
    const parsedCart = JSON.parse(rawCart);
    if (typeof parsedCart !== 'object' || parsedCart === null) return {};

    // Keep only valid cart rows created from current backend food items.
    return Object.entries(parsedCart).reduce((acc, [key, item]) => {
      const id = Number(item?.id ?? key);
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      if (!Number.isInteger(id) || id <= 0 || quantity <= 0 || price < 0) return acc;
      acc[id] = { ...item, id, quantity, price };
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to parse cart from storage:', error);
    return {};
  }
};

const StoreContextProvider = ({ children }) => {
  const [category, setCategory] = useState('All');
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY) || '');

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const setAuthToken = (newToken) => {
    const safeToken = newToken || '';
    setToken(safeToken);
    if (safeToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, safeToken);
      return;
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev[item.id];
      if (existingItem) {
        return {
          ...prev,
          [item.id]: { ...existingItem, quantity: existingItem.quantity + 1 },
        };
      }
      return {
        ...prev,
        [item.id]: { ...item, quantity: 1 },
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (!updatedCart[itemId]) return updatedCart;

      if (updatedCart[itemId].quantity > 1) {
        updatedCart[itemId] = {
          ...updatedCart[itemId],
          quantity: updatedCart[itemId].quantity - 1,
        };
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const logout = () => {
    clearCart();
    setAuthToken('');
    localStorage.removeItem('user');
  };

  const getTotalCartAmount = () => {
    return Object.values(cartItems).reduce((total, item) => {
      return total + (Number(item.price) || 0) * (item.quantity || 0);
    }, 0);
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const contextValue = useMemo(
    () => ({
      category,
      setCategory,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalCartAmount,
      getCartCount,
      token,
      setToken: setAuthToken,
      logout,
    }),
    [category, cartItems, token]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreContextProvider;
