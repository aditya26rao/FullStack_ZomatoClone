import React from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

export default function Home({ searchQuery }) {
  return (
    <div>
      <Header />
      <ExploreMenu />
      <FoodDisplay searchQuery={searchQuery} />
      <AppDownload />
    </div>
  );
}
