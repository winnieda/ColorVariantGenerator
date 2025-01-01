import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        {/* Header Section */}
        <div className="col-12 landing-header mb-4">
          <h2>Welcome to the Color Variant Generator</h2>
          <p className="lead">Click an option below to get started:</p>
        </div>
        {/* Options Section */}
        <div className="col-12 landing-buttons">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-9 mb-3">
              <Link to="/create-palette" className="btn btn-primary btn-lg w-100">
                <i className="fas fa-palette"></i> Create Palette or Variants
              </Link>
            </div>
            <div className="col-md-4 col-lg-3 mb-3">
              <Link to="/picture-presets" className="btn btn-secondary btn-lg w-100">
                <i className="fas fa-image"></i> Picture Presets
              </Link>
            </div>
            <div className="col-md-4 col-lg-3 mb-3">
              <Link to="/how-to-use" className="btn btn-secondary btn-lg w-100">
                <i className="fas fa-question"></i> How to Use
              </Link>
            </div>
          </div>
        </div>
        {/* Project Information Section */}
        <div className="col-12 mt-5 mb-5">
          <hr />
          <h1 className="information-header">Project Information & About Me:</h1>
          <div className="p-4 text-start bg-warning text-dark border rounded shadow">
            <h4>About This Project</h4>
            <p>
              This website was built to showcase a variety of technologies and features:
            </p>
            <ul>              
              <li><strong>Technologies:</strong></li>
              <ul>
                <li>React & Javascript (Frontend)</li>
                <li>Flask & Python (Backend)</li>
                <li>MySQL (Database)</li>
                <li>SQLAlchemy (ORM for MySQL)</li>
                <li>Direct SQL Calls (No longer in project, but were used before switching to SQLAlchemy near the 
                  project's end and frequently done manually during bugtesting)</li>
                <li>Github (Version Control)</li>
                <a href="https://github.com/winnieda/ColorVariantGenerator">Link to this project's Github page</a>
                <li>AWS EC2 Instance (Deployment and Hosting)</li>
                <li>AWS SES (Email Service)</li>
                <li>AWS Route 53 (Domain Service)</li>
                <li>Gunicorn (Flask Server)</li>
              </ul>
              <li><strong>Features:</strong></li>
              <ul>
                <li>Two-Factor Authentication (2FA)</li>
                <li>Confirmation Emails for Account Validation</li>
                <li>Both of the above sent from custom email address no-reply@colorvariantgenerator.com</li>
                <li>.env file to keep keys secure on a public repository</li>
                <li>Session Management with Flask-Login</li>
                <li>Secure Authentication with Salted and Hashed Passwords</li>
                <li>RESTful API with Axios for Frontend-Backend Communication</li>
                <li>Dynamic UI with React and Bootstrap</li>
                <li>CRUD Operations ('Delete' feature directly on website under construction, but the endpoint exists)</li>
                <li>Custom domain with HTTPS for security and legitimacy</li>
              </ul>
            </ul>
            <p>
              This project is designed to demonstrate skills in full-stack development, security best practices, and modern web application architecture.
            </p>
          </div>
        </div>
        {/* About Me Section */}
        <div className="col-12 mb-5">
          <div className="p-4 text-start bg-info text-white border rounded shadow d-flex align-items-center">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQEcLG1Y0YozMQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1680395206596?e=1741219200&v=beta&t=EiY0M8O0Z-c3o0-7LOvspNvNt4N7NAvmpavmRl8lW_Y"
              alt="Picture of Daniel"
              className="rounded-circle me-4"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <div>
              <h4>About Me</h4>
              <p>
                Hello, thank you so much for visiting my website!
              </p>
              <p>
                My name is Daniel Winnie and I'm striving to become a professional full-stack developer, one website at a time. 
                This is my biggest project yet, but I'm confident it's just the start.
              </p>
              <p>
                I'm currently working on a quick portfolio website using Angular and Spring Boot. I'll post it here when it's ready. 
                Until then, all of my relevant web development projects can be found on my Github and Linkedin located in the footer, 
                alongside the games I've made on Itch.io.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
