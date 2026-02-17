import React from 'react';
import './Header.css';
import { assets } from '../../assets/assets';

export default function Header() {
  const scrollToMenu = () => {
    const menuEl = document.getElementById('explore-menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='header' style={{ backgroundImage: `url(${assets.header_img})` }}>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Explore top-rated meals, filter by category, and place orders in minutes.</p>
        <button onClick={scrollToMenu}>View Menu</button>
      </div>
    </div>
  );
}
