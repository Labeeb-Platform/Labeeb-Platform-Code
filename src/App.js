// import React, { useState } from 'react';
// import './App.css';
// import Login from './components/Login';
// import StoryList from './components/StoryList';
// import StoryPage from './components/StoryPage';

// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [childName, setChildName] = useState('');
//   const [gender, setGender] = useState('');
//   const [currentPage, setCurrentPage] = useState('login');
//   const [currentStory, setCurrentStory] = useState(null);

//   const handleLogin = (name, gender) => {
//     setChildName(name);
//     setGender(gender);
//     setLoggedIn(true);
//     setCurrentPage('storyList');
//   };

//   const handleSelectStory = (story) => {
//     setCurrentStory(story);
//     setCurrentPage('storyPage');
//   };

//   const handleBackToStories = () => {
//     setCurrentPage('storyList');
//   };

//   return (
//     <div className="App">
//       {currentPage === 'login' && <Login onLogin={handleLogin} />}
//       {currentPage === 'storyList' && <StoryList onSelectStory={handleSelectStory} />}
//       {currentPage === 'storyPage' && <StoryPage story={currentStory} onBack={handleBackToStories} />}
//     </div>
//   );
// }

// export default App;

// src/App.js
import React, { useState, useEffect } from 'react';
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (storedUser) {
      setChildName(storedUser.name);
      setGender(storedUser.gender);
      setUserId(storedUser.userId);
      setLoggedIn(true);
      setCurrentPage('storyList');
    }
  }, []);

  const handleLogin = (name, gender, userId) => {
    const userData = { name, gender, userId };
    localStorage.setItem('userData', JSON.stringify(userData));
    setChildName(name);
    setGender(gender);
    setUserId(userId);
    setLoggedIn(true);
    setCurrentPage('storyList');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setChildName('');
    setGender('');
    setUserId(null);
    setLoggedIn(false);
    setCurrentPage('login');
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
     
      {currentPage === 'login' && (
        <Login onLogin={(name, gender, userId) => handleLogin(name, gender, userId)} />
      )}
      {currentPage === 'storyList' && (
        <StoryList userId={userId} onSelectStory={handleSelectStory} onLogout={handleLogout} />
      )}
      {currentPage === 'storyPage' && (
        <StoryPage
          story={currentStory}
          userId={userId}
          storyId={currentStory ? currentStory.title : null}
          onBack={handleBackToStories}
        />
      )}
    </div>
  );
}

export default App;
