
import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import PreviousOrder from '../PreviousOrder/PreviousOrder';

export default function Cart() {
  const { cartItems, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartItemsArray = Object.values(cartItems);
  const subtotal = getTotalCartAmount();

  const deliveryFee = subtotal > 0 ? (cartItemsArray.length < 4 ? 75 : 150) : 0;
  const finalTotal = subtotal + deliveryFee;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    alert('🚀 Promo codes feature is coming soon!');
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="card-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {cartItemsArray.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>🛒 Your cart is empty.</p>
        ) : (
          cartItemsArray.map(item => {
            const price = Number(item.price) || 0;
            const total = price * item.quantity;

            return (
              <div className="cart-items-title cart-items-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <p>{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</p>
                <p>{formatCurrency(price)}</p>
                <p>{item.quantity}</p>
                <p>{formatCurrency(total)}</p>
                <p
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => removeFromCart(item.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${item.name} from cart`}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && removeFromCart(item.id)}
                >
                  X
                </p>
              </div>
            );
          })
        )}
      </div>

      {cartItemsArray.length > 0 && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-detials">
                <p>Subtotal</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
              <hr />
              <div className="cart-total-detials">
                <p>Delivery Fee</p>
                <p>{formatCurrency(deliveryFee)}</p>
              </div>
              <hr />
              <div className="cart-total-detials">
                <b>Total</b>
                <b>{formatCurrency(finalTotal)}</b>
              </div>
            </div>
            <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>

          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="Promo Code" />
                <button type="submit" onClick={handlePromoSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <PreviousOrder />
      </div>
    </div>
  );
}
