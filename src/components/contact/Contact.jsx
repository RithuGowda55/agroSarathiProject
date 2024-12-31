import React, { useState } from "react";
import Back from "../common/back/Back";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send the form data to the backend
    const response = await fetch("http://localhost:8090/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (result.success) {
      alert("Your message has been sent successfully!");
    } else {
      alert("There was an error sending your message.");
    }
  };

  const map = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d904726.6131739549!2d76.634462!3d12.295810!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1652535615693!5m2!1sen!2sin";

  return (
    <>
      <Back title='Contact us' />
      <section className='contacts padding'>
        <div className='container shadow flexSB'>
          <div className='left row'>
            <iframe src={map} width="600" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
          <div className='right row'>
            <h1>Contact us</h1>
            <p>We're open for any suggestion or just to have a chat</p>

            <div className='items grid2'>
              <div className='box'>
                <h4>ADDRESS:</h4>
                <p>203 Agro Sarathi St. Farming District, Rural, India</p>
              </div>
              <div className='box'>
                <h4>EMAIL:</h4>
                <p> support@agrosarathi.com</p>
              </div>
              <div className='box'>
                <h4>PHONE:</h4>
                <p>+91 123 456 7890</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='flexSB'>
                <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleInputChange} />
                <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleInputChange} />
              </div>
              <input type='text' name='subject' placeholder='Subject' value={formData.subject} onChange={handleInputChange} />
              <textarea name='message' cols='30' rows='10' placeholder='Create a message here...' value={formData.message} onChange={handleInputChange}></textarea>
              <button className='primary-btn' type='submit'>SEND MESSAGE</button>
            </form>

         
            
            <h3>Follow us here</h3>
<div className="social-links">
  <a href="https://www.facebook.com/AgriBusinessGlobal" target="_blank" rel="noopener noreferrer">Facebook</a>
  <a href="https://www.instagram.com/agripulse" target="_blank" rel="noopener noreferrer">Instagram</a>
  <a href="https://twitter.com/AgriBusinessGlobal" target="_blank" rel="noopener noreferrer">Twitter</a>
</div>


          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
