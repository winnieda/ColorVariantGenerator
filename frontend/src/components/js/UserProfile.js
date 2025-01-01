import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaletteOutput from './PaletteOutput';
import '../css/UserProfile.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
// const apiBaseUrl = 'http://127.0.0.1:5000/api';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [palettes, setPalettes] = useState(null);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/get_palettes/${id}`);
        const rawPalettes = response.data.palettes;
        setPalettes(parsePalettes(rawPalettes));
        setUsername(response.data.username);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate('/404');
        } else {
          setError('An error occurred while fetching user data.');
        }
      }
    };
    fetchUserData();
  }, [id, navigate]);
  

  const parsePalettes = (rawPalettes) => {
    return rawPalettes.map((entry) => {
      const parsedData = JSON.parse(entry.palette_data);  // Parse the JSON string
      return parsedData.colors;  // Return only the colors array
    });
  };  

  return (
    <div className="user-profile">
      <h2>{username ? `${username}'s Profile` : 'User Profile'}</h2>
      {error && <p>{error}</p>}
      {palettes ? (
        palettes.length > 0 ? (
          <div className="palette-output-container">
            <PaletteOutput generatedPalettes={palettes} />
          </div>
        ) : (
          <p className="text-center">No palettes available.</p>
        )
      ) : (
        <p className="text-center">Loading palettes...</p>
      )}
    </div>
  );
};

export default UserProfile;
