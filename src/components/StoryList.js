import React, { useState } from 'react';
import './StoryList.css'; // Import the CSS file
import StoryPage from './StoryPage'; // Import the StoryPage component

const StoryList = () => {
  const [selectedStory, setSelectedStory] = useState(null); // Manage selected story

  // Define your stories with folder paths and design classes
  const stories = [
    { title: 'قصة النحلة النشيطة', image: '/Images/bee2.svg', folder: '/data/beeStory', design: 'beeStoryDesign' },
    { title: 'قصة فارس والفضاء', image: '/Images/astronaut.svg', folder: '/data/spaceStory', design: 'spaceStoryDesign' },
    { title: 'Story 3', image: '/Images/story3.png', folder: '/data/story3', design: 'story3Design' },
    { title: 'Story 4', image: '/Images/story4.png', folder: '/data/story4', design: 'story4Design' },
    { title: 'Story 5', image: '/Images/story5.png', folder: '/data/story5', design: 'story5Design' }
  ];

  const handleStoryClick = (story) => {
    setSelectedStory(story); // Set the selected story's data when clicked
  };

  const handleBack = () => {
    setSelectedStory(null); // Reset to story list when back is clicked
  };

  return (
    <div className="storylist-container">
      {/* If a story is selected, show StoryPage, otherwise show StoryList */}
      {selectedStory ? (
        <StoryPage 
          storyFolder={selectedStory.folder} 
          designClass={selectedStory.design}  // Pass the design class to StoryPage
          onBack={handleBack} 

        />
      ) : (
        <div className="storyList-boxes">
          {stories.map((story) => (
            <div
              key={story.title}
              className="storyList-box"
              onClick={() => handleStoryClick(story)} // Handle click on story
            >
              <img src={story.image} alt={story.title} className="storyList-image" />
              <p>{story.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryList;
