

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import './PreviousOrder.css';

export default function PreviousOrder() {
  const [previousOrders, setPreviousOrders] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const { token } = useContext(StoreContext);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 3000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/previous-orders/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPreviousOrders(res.data);
      } catch (err) {
        showPopup('❌ Failed to load previous orders.');
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="previous-orders">
        <h2 className="previous-orders-title">Your Previous Orders</h2>
        <p>Please log in to view your previous orders.</p>

        {popupMessage && (
          <div className="popup-message">
            {popupMessage}
          </div>
        )}
      </div>
    );
  }

  if (!previousOrders.length) {
    return (
      <div className="previous-orders">
        <h2 className="previous-orders-title">Your Previous Orders</h2>
        <p>You have no previous orders yet.</p>

        {popupMessage && (
          <div className="popup-message">
            {popupMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="previous-orders">
      <h2 className="previous-orders-title">Your Previous Orders</h2>
      {previousOrders.map(order => (
        <div key={order.id} className="previous-order-card">
          <div className="order-header">
            <h4>Order #{order.id}</h4>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>
          <ul>
            {order.items?.map((item, idx) => (
              <li key={`${order.id}-${idx}`} className="order-item">
                {item.food_item?.name || 'Item'} × {item.quantity} — ₹{item.food_item?.price || 0}
              </li>
            ))}
          </ul>
          <div className="order-total">
            <strong>Total: ₹{order.total}</strong>
          </div>
        </div>
      ))}

      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}
    </div>
  );
}
