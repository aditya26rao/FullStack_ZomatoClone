import React, { useContext, useState } from 'react';
import axios from 'axios';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

export default function PlaceOrder() {
  const { getTotalCartAmount, cartItems, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const cartItemsArray = Object.values(cartItems);
  const deliveryFee = subtotal > 0 ? (cartItemsArray.length < 4 ? 75 : 150) : 0;
  const finalTotal = subtotal + deliveryFee;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    phone: '',
  });

  const [popupMessage, setPopupMessage] = useState('');

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 5000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showPopup('⚠️ Please login before placing an order.');
      navigate('/');
      return;
    }

    const orderItems = cartItemsArray
      .filter(item => item.quantity > 0)
      .map(item => ({
        food_item: item.id || item.idMeal,
        quantity: item.quantity,
      }));

    try {
      const response = await axios.post(
        'http://localhost:8000/api/orders/',
        {
          ...formData,
          subtotal,
          delivery_fee: deliveryFee,
          total: finalTotal,
          items: orderItems,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        localStorage.removeItem('cartItems');
        clearCart();
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          street: '',
          city: '',
          state: '',
          zip_code: '',
          country: '',
          phone: '',
        });

        showPopup('✅ Order placed successfully!');
        setTimeout(() => navigate('/order-success'), 1500);
      }
    } catch (error) {
      console.error('❌ Order error:', error);
      let errMsg = '❌ Something went wrong. Please try again.';
      if (error.response) {
        const data = error.response.data;
        errMsg =
          data?.detail ||
          data?.error ||
          data?.message ||
          JSON.stringify(data, null, 2);
      } else if (error.message) {
        errMsg = error.message;
      }
      showPopup(errMsg);
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} required onChange={handleChange} />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} required onChange={handleChange} />
        </div>
        <input type="email" name="email" placeholder="Email Address" value={formData.email} required onChange={handleChange} />
        <input type="text" name="street" placeholder="Street" value={formData.street} required onChange={handleChange} />
        <div className="multi-fields">
          <input type="text" name="city" placeholder="City" value={formData.city} required onChange={handleChange} />
          <input type="text" name="state" placeholder="State" value={formData.state} required onChange={handleChange} />
        </div>
        <div className="multi-fields">
          <input type="text" name="zip_code" placeholder="Zip Code" value={formData.zip_code} required onChange={handleChange} />
          <input type="text" name="country" placeholder="Country" value={formData.country} required onChange={handleChange} />
        </div>
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} required onChange={handleChange} />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-detials">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-detials">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-detials">
              <b>Total</b>
              <b>₹{finalTotal.toFixed(2)}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>

      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}
    </form>
  );
}
