import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationEmailSentPage = () => {
    return (
        <div className="confirmation-email-sent-page">
            <h2>Confirmation Email Sent</h2>
            <p>Please check your email for a confirmation link to activate your account.</p>
            <Link to="/">Return to Homepage</Link>
        </div>
    );
};

export default ConfirmationEmailSentPage;
