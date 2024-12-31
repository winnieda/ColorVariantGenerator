import React, { useState } from 'react';
import axios from 'axios';

// const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
const apiBaseUrl = 'http://127.0.0.1:5000/api';

const ConfirmationEmailSentPage = () => {
    const [username, setUsername] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setMessage('');

        try {
            // Validate confirmation code with backend
            const confirmResponse = await axios.post(`${apiBaseUrl}/confirm-user`, {
                username: username.trim(),
                code: confirmationCode.trim(),
            });

            if (confirmResponse.status === 200) {
                setMessage('Confirmation successful! You can now log in.');
            }
        } catch (err) {
            setError(true);
            setMessage(
                'Confirmation failed. Please check your username and code or try again.'
            );
        }
    };

    return (
        <div className="confirmation-email-sent-page">
            <h2>Confirmation Email Sent</h2>
            <p>Please check your email for the confirmation code and enter it below.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmation-code">Confirmation Code:</label>
                    <input
                        type="text"
                        id="confirmation-code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Confirm</button>
            </form>
            {message && <p className={error ? 'error' : 'success'}>{message}</p>}
        </div>
    );
};

export default ConfirmationEmailSentPage;
