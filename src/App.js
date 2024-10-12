import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import StoryList from './components/StoryList';
import StoryPage from './components/StoryPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [childName, setChildName] = useState('');
  const [gender, setGender] = useState('');
  const [currentPage, setCurrentPage] = useState('login');
  const [currentStory, setCurrentStory] = useState(null);

  const handleLogin = (name, gender) => {
    setChildName(name);
    setGender(gender);
    setLoggedIn(true);
    setCurrentPage('storyList');
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
    setCurrentPage('storyPage');
  };

  const handleBackToStories = () => {
    setCurrentPage('storyList');
  };

  return (
    <div className="App">
      {currentPage === 'login' && <Login onLogin={handleLogin} />}
      {currentPage === 'storyList' && <StoryList onSelectStory={handleSelectStory} />}
      {currentPage === 'storyPage' && <StoryPage story={currentStory} onBack={handleBackToStories} />}
    </div>
  );
}

export default App;
