// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the styles
import Back from '../../common/back/Back';

const Dashboard = () => {
  return (
    <>
      <Back title='Explore' />
      <div className="dashboard">
        <div className="cards-container">
          <div className="cardd">
            <Link to="/CropInputForm" className="cardd-link">
              <div className="cardd-content">
                <h2>NTP</h2>
                <p>Manage crop inputs and nutrients.</p>
              </div>
            </Link>
          </div>
          <div className="cardd">
            <Link to="/irrigation" className="cardd-link">
              <div className="cardd-content">
                <h2>Irrigation</h2>
                <p>Monitor and manage irrigation systems.</p>
              </div>
            </Link>
          </div>
          <div className="cardd">
            <Link to="/price" className="cardd-link">
              <div className="cardd-content">
                <h2>Price</h2>
                <p>Check crop pricing and market trends.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
