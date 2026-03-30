import React, { useState } from 'react';
import api from './api/github';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Resume from './components/Resume';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearchUser = async (username) => {
    setLoading(true);
    setError(false);
    setUserData(null);
    setUserRepos([]);

    try {
      const [profileResponse, reposResponse] = await Promise.all([
        api.get(`/users/${username}`),
        api.get(`/users/${username}/repos?per_page=100&sort=updated`)
      ]);

      setUserData(profileResponse.data);
      setUserRepos(reposResponse.data);
    } catch (err) {
      setError(true);
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="controls">
        <Header />
        <SearchBar onSearch={handleSearchUser} />
      </div>
      
      <Resume 
        userData={userData} 
        repos={userRepos} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}

export default App;