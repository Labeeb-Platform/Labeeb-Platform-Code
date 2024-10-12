import React, { useState, useEffect } from 'react';
import { readCSVFile } from './csvUtils'; // Import your CSV utility
import './StoryPage.css'; // General styles for all stories

const StoryPage = ({ storyFolder, designClass, onBack }) => {
  const [storyData, setStoryData] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Start with index 0
  const [isStoryEnded, setIsStoryEnded] = useState(false); // Track if the story has ended

  useEffect(() => {
    // Fetch the CSV file from the selected story's folder
    fetch(`${storyFolder}/story.csv`)
      .then((response) => response.text()) // Read the CSV file as text
      .then((csvText) => {
        const blob = new Blob([csvText], { type: 'text/csv' });
        readCSVFile(blob, (data) => setStoryData(data)); // Parse and set the story data
      });
  }, [storyFolder]); // Reload when the storyFolder changes

  useEffect(() => {
    // Dynamically load the specific CSS for the story
    if (designClass === 'beeStoryDesign') {
      import('./beeStoryDesign.css');
    } else if (designClass === 'spaceStoryDesign') {
      import('./spaceStoryDesign.css');
    } 
    // Add other design imports as necessary
  }, [designClass]);

  // Function to get the story row by its index value
  const getStoryByIndex = (index) => {
    return storyData.find(story => parseInt(story.index) === index);
  };

  const currentStory = getStoryByIndex(currentStepIndex);

  const handleNext = () => {
    if (!isStoryEnded) {
      const nextStory = getStoryByIndex(currentStepIndex + 1); // Go to the next row (index + 1)
      if (nextStory) {
        setCurrentStepIndex(currentStepIndex + 1);
        if (nextStory.end === 'yes') {
          setIsStoryEnded(true); // Stop the story if it reaches an end
        }
      }
    }
  };

  const handleChoice = (nextIndex) => {
    if (nextIndex === 'end') {
      setIsStoryEnded(true); // If 'end' is selected, stop the story
    } else {
      const nextStory = getStoryByIndex(parseInt(nextIndex, 10)); // Convert nextIndex to a number and find the corresponding row
      if (nextStory) {
        setCurrentStepIndex(parseInt(nextIndex, 10)); // Navigate to the chosen step by its index
        if (nextStory.end === 'yes') {
          setIsStoryEnded(true); // Stop the story if it reaches an end
        }
      } else {
        console.error("Invalid option selected:", nextIndex);
      }
    }
  };

  if (!storyData.length || !currentStory) return <p>Loading story...</p>;

  return (
    <div className="storyPage-container">
      <div className={`storyPage-box ${designClass}`}>
        <div className="content-box">
        <div className="storyPage-content">

            {/* Back Button */}
        <button className="back-button" onClick={onBack}>الرجوع الى القصص</button>

           

          {/* Large Picture */}
          <img
            src={`${storyFolder}/images/${currentStory.image}`}
            alt="story image"
            className="storyPage-image"
          />

          {/* Story Text */}
          <p className="storyPage-text">{currentStory.text}</p>

          {/* Audio Player */}
          {currentStory.sound && (
            <audio
              key={currentStory.sound}
              controls
              autoPlay
              className="storyPage-audio"
            >
              <source
                src={`${storyFolder}/audio/${currentStory.sound}`}
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
          )}

          {/* Option Buttons or Next Button */}
          <div className="storyPage-buttons">
            {currentStory.options === 'yes' ? (
              <div className = 'options'>
                {currentStory['option 1'] && (
                  <button  onClick={() => handleChoice(currentStory['option 1'])}>
                    خيار الباء
                  </button>
                )}
                {currentStory['option 2'] && (
                  <button onClick={() => handleChoice(currentStory['option 2'])}>
                    خيار الالف
                  </button>
                )}
              </div>
            ) : (
              !isStoryEnded && <button className='next-button' onClick={handleNext}>التالي</button> // Show Next button if no options
            )}
          </div>
        </div>

      
      </div>
    </div>
    </div>
  );
};

export default StoryPage;
