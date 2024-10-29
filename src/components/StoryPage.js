import React, { useState, useEffect } from 'react';
import { readCSVFile } from './csvUtils'; // Import your CSV utility
import './StoryPage.css'; // General styles for all stories
import { FaVolumeUp } from 'react-icons/fa'; // Import a volume icon from react-icons

const StoryPage = ({ storyFolder, designClass, onBack }) => {
  const [storyData, setStoryData] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Start with index 0
  const [isStoryEnded, setIsStoryEnded] = useState(false); // Track if the story has ended
  const [volume, setVolume] = useState(1); // Default volume (1 is 100%)
  

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
    } else if (designClass === 'camelStoryDesign') {
      import('./camelStoryDesign.css');
    }else if (designClass === 'greenEarthStoryDesign') {
      import('./greenEarthStoryDesign.css');
    }else if (designClass === 'taifTripStoryDesign') {
      import('./taifTripStoryDesign.css');
    }
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

  const handleBackStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1); // Go back to the previous row (index - 1)
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

  const handleRestartAudio = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
        audioElement.currentTime = 0; // Reset audio to the beginning
        audioElement.play(); // Play the audio from the start
    }
  };

  const handleVolumeChange = (event) => {
    const audioElement = document.getElementById('audio-element');
    const volumeValue = event.target.value;
    setVolume(volumeValue);
    if (audioElement) {
      audioElement.volume = volumeValue; // Adjust the audio element's volume
    }
  };

  return (
    <div className="storyPage-container">
      <div className={`storyPage-box ${designClass}`}>
        <div className="content-box">
          <div className="storyPage-content">

            {/* Back Button */}
            <button className="back-button" onClick={onBack}>
              <img src="/Images/book.svg" alt="Back" className="back-button-image" />
              <span>الرجوع الى القصص</span>
            </button>

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
              <div className="audio-container">
                <audio id="audio-element"
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

                {/* Volume Icon and Slider */}
                <div className="volume-control">
                  <FaVolumeUp size={24} className="volume-icon" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
              </div>
            )}

            {/* Restart Audio Button */}
            <button className="restart-audio-button" onClick={handleRestartAudio}>إعادة تشغيل القصة</button>

            {/* Option Buttons or Next Button */}
            <div className="storyPage-buttons">
              {currentStory.options === 'yes' ? (
                <div className='options'>
                  {currentStory['option 1'] && (
                    <button onClick={() => handleChoice(currentStory['option 1'])}>
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
                !isStoryEnded && <button className="next-button" onClick={handleNext}>التالي </button>
              )}
            </div>
          </div>

          {/* Back Step Button to go back in the story */}
          {currentStepIndex > 0 && (
            <button className="back-step-button" onClick={handleBackStep}>السابق</button>
          )}

        </div>
      </div>
    </div>
  );
};

export default StoryPage;
