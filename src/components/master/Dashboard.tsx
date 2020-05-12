import React from 'react';

import './dashboard.scss';
import Header from './header/Header';
import Footer from './footer/Footer';
import Menu from './menu/Menu';

const Dashboard = () => {
  return (
    <>
      <Header />
      <Menu />
      <div className="content">View Components</div>

      <Footer />
    </>
  );
};

export default Dashboard;
