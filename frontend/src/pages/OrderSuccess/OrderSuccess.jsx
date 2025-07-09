import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';  // optional CSS for styling

export default function OrderSuccess() {
  return (
    <div className="order-success">
      <h1>🎉 Thank You!</h1>
      <p>Your order has been placed successfully.</p>
      <Link to="/">
        <button>Go to Home</button>
      </Link>
    </div>
  );
}
