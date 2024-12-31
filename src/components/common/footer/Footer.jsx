import React, { useState } from "react";
import { blog } from "../../../dummydata";
import "./footer.css";

const Footer = () => {
  // State for the email input
  const [email, setEmail] = useState('');

  // Handle subscribe action
  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter a valid email address");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8090/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        alert("Subscribed successfully!");
        setEmail(""); // Reset the input field
      } else if (response.status === 409) {
        alert("This email is already subscribed!");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Failed to subscribe. Please try again later.");
    }
  };
  

  return (
    <>
      <section className="newletter">
        <div className="container flexSB">
          <div className="left row">
            <h1>Newsletter - Stay tuned for the latest agricultural updates</h1>
            <span>Get the latest farming tips, news, and updates from Agro Sarathi</span>
          </div>
          <div className="right row">
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on change
            />
            <i className="fa fa-paper-plane" onClick={handleSubscribe}>send</i>
          </div>
        </div>
      </section>
      <footer>
        <div className="container padding">
          <div className="box logo">
            <h1>AGRO SARATHI</h1>
            <span>Your Agricultural Companion</span>
            <p>Agro Sarathi is dedicated to providing farmers with innovative tools, knowledge, and support to enhance agricultural practices and boost productivity.</p>

            <i className="fab fa-facebook-f icon"></i>
            <i className="fab fa-twitter icon"></i>
            <i className="fab fa-instagram icon"></i>
          </div>
          <div className="box link">
            <h3>Explore</h3>
            <ul>
              <li>About Us</li>
              <li>Services</li>
              <li>Farming Tips</li>
              <li>Blog</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="box link">
            <h3>Quick Links</h3>
            <ul>
              <li>Contact Us</li>
              <li>Pricing</li>
              <li>Terms & Conditions</li>
              <li>Privacy</li>
              <li>Feedbacks</li>
            </ul>
          </div>
          <div className="box">
            <h3>Recent Posts</h3>
            {blog.slice(0, 3).map((val, index) => (
              <div key={index} className="items flexSB">
                <div className="img">
                  <img src={val.cover} alt="" />
                </div>
                <div className="text">
                  <span>
                    <i className="fa fa-calendar-alt"></i>
                    <label>{val.date}</label>
                  </span>
                  <span>
                    <i className="fa fa-user"></i>
                    <label>{val.type}</label>
                  </span>
                  <h4>{val.title.slice(0, 40)}...</h4>
                </div>
              </div>
            ))}
          </div>
          <div className="box last">
            <h3>Have Questions?</h3>
            <ul>
              <li>
                <i className="fa fa-map"></i>
                203 Agro Sarathi St. Farming District, Rural, India
              </li>
              <li>
                <i className="fa fa-phone-alt"></i>
                +91 123 456 7890
              </li>
              <li>
                <i className="fa fa-paper-plane"></i>
                support@agrosarathi.com
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="legal">
        <p>
          Copyright ©2024 All rights reserved | This platform is made with <i className="fa fa-heart"></i> for farmers by Agro Sarathi
        </p>
      </div>
    </>
  );
};

export default Footer;
