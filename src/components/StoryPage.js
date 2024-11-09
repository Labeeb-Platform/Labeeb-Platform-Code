import React, { useState, useEffect, useRef } from 'react';
import { readCSVFile } from './csvUtils';
import './StoryPage.css';
import { FaVolumeUp } from 'react-icons/fa';
import PopupModal from './PopupModal';
import { db, doc, getDoc, setDoc, updateDoc, arrayUnion } from '../firebase/firebaseConfig';
import QuizPopupModal from './quizPopUpModel'; // Add this to import QuizPopupModal

const StoryPage = ({ storyFolder, designClass,userId, storyId ,  onBack}) => {
  const [storyData, setStoryData] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStoryEnded, setIsStoryEnded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pathsTaken, setPathsTaken] = useState([]);
  const [storyPoints, setStoryPoints] = useState(0);
  const audioRef = useRef(null);
  
  // Add state to manage the quiz modal
const [quizData, setQuizData] = useState([]); // Holds quiz questions
const [currentQuestion, setCurrentQuestion] = useState(null); // Tracks current quiz question
const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); // Controls quiz modal display


useEffect(() => {
  const loadQuizData = async () => {
    try {
      const response = await fetch(`${storyFolder}/QuizStory.csv`);
      if (!response.ok) throw new Error("Failed to fetch quiz CSV file");

      const text = await response.text();
      const blob = new Blob([text], { type: 'text/csv' });
      readCSVFile(blob, (data) => setQuizData(data)); // Store parsed quiz data
    } catch (error) {
      console.error("Error loading quiz CSV:", error);
    }
  };
  loadQuizData();
}, [storyFolder]);

// useEffect(() => {
//   if (storyPoints === 4 && quizData.length > 0) {
//     setCurrentQuestion(quizData[0]); // Set the first quiz question
//     setIsModalOpen(false); // Close star modal
//     setIsQuizModalOpen(true); // Open quiz modal
//   }
// }, [storyPoints, quizData]);


const handleQuizStart = () => {
  console.log('handleQuizStart called');
  console.log('Quiz data:', quizData);
  setIsQuizModalOpen(true); // Open quiz modal
  setIsModalOpen(false); // Close the star modal
  setCurrentQuestion(quizData[0]); // Load the first question for the quiz
};

useEffect(() => {
  if (isQuizModalOpen) {
    console.log('Quiz modal should now be open with question:', currentQuestion);
  }
}, [isQuizModalOpen, currentQuestion]);

const handleQuizClose = () => {
  console.log('Closing quiz modal');
  setIsQuizModalOpen(false); // Close quiz modal
  onBack();
};

  console.log("quizData[0]: ", quizData[0])

 useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`${storyFolder}/story.csv`);
            if (!response.ok) throw new Error("Failed to fetch CSV file");

            const text = await response.text();
            if (text.startsWith("<!DOCTYPE html>")) {
                throw new Error("Unexpected HTML response. Check the file path or permissions.");
            }

            const blob = new Blob([text], { type: 'text/csv' });
            readCSVFile(blob, (data) => {
                console.log("Parsed CSV data:", data);
                setStoryData(data);
            });
        } catch (error) {
            console.error("Error fetching CSV:", error);
        }
    };

    fetchData();
}, [storyFolder]);



  useEffect(() => {
    if (designClass) import(`./${designClass}.css`);
  }, [designClass]);

 useEffect(() => {
    // Log each entry in storyData to verify the structure
    storyData.forEach((entry, index) => {
      if (!entry.index) {
        console.error(`Missing 'index' in entry at row ${index}`, entry);
      }
    });
}, [storyData]);

useEffect(() => {
  const audioElement = audioRef.current;
  if (audioElement) {
    const handleAudioEnd = () => {
      if (isStoryEnded) {
        setIsModalOpen(true); // Open the modal only after the audio finishes
      }
    };
    audioElement.addEventListener('ended', handleAudioEnd);

    return () => {
      audioElement.removeEventListener('ended', handleAudioEnd);
    };
  }
}, [isStoryEnded]);


  const saveInitialStoryData = async () => {
    if (!userId || !storyId) {
      console.error("Cannot save data: Missing userId or storyId.");
      return;
    }
    const storyRef = doc(db, 'users', userId, 'stories', storyId);
    const storyDoc = await getDoc(storyRef);

    if (!storyDoc.exists()) {
      await setDoc(storyRef, {
        points: 0,
        pathsTaken: [],
      });
    } else {
      setPathsTaken(storyDoc.data().pathsTaken || []);
    }
  };

  // Enhanced logging to inspect `index` field in `storyData`
const getStoryByIndex = (index) => {
    console.log("Finding story with index:", index);
    const foundStory = storyData.find((story) => parseInt(story.index) === index);
    if (!foundStory) {
      console.log("No story found with index:", index);
    }
    return foundStory;
};


  const currentStory = getStoryByIndex(currentStepIndex);
  console.log("Current Step Index:", currentStepIndex);
  console.log("Current Story Data:", currentStory);

  const handleNext = async () => {
    if (!isStoryEnded) {
      const nextStory = getStoryByIndex(currentStepIndex + 1);
      if (nextStory) {
        setCurrentStepIndex(currentStepIndex + 1);
        if (nextStory.end === 'yes') {
          setIsStoryEnded(true);
          await updateProgress(nextStory['end order']);
        }
      }
    }
  };

  const handleBackStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleChoice = async (nextIndex) => {
    const nextStory = getStoryByIndex(parseInt(nextIndex, 10));
    if (nextStory) {
      setCurrentStepIndex(parseInt(nextIndex, 10));
      if (nextStory.end === 'yes') {
        setIsStoryEnded(true);
        await updateProgress(nextStory['end order']);
      }
    }
  };

  const updateProgress = async (endOrder) => {
    if (!userId || !storyId) {
      console.error("Cannot update progress: Missing userId or storyId.");
      return;
    }

    const storyRef = doc(db, 'users', userId, 'stories', storyId);
    const storyDoc = await getDoc(storyRef);

    if (!storyDoc.exists()) {
      await setDoc(storyRef, {
        points: 1,
        pathsTaken: [endOrder],
      });
      setPathsTaken([endOrder]);
      setStoryPoints(1);  // Set initial points if story doc is newly created

    } else {
      const storyData = storyDoc.data();
      if (!storyData.pathsTaken.includes(endOrder)) {
        const newPoints = storyData.points + 1;
        await updateDoc(storyRef, {
          points: newPoints,

          pathsTaken: arrayUnion(endOrder),
        });
        setPathsTaken((prevPaths) => [...prevPaths, endOrder]);
        setStoryPoints(newPoints);  // Update points from Firebase
      }

      else {
      setStoryPoints(storyData.points);  // Set points if already present
    }
    }
  };

  const handleRestartAudio = () => {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play();
    }
  };

  const handleRestartStory = () => {
    setCurrentStepIndex(0);
    setPathsTaken([]);
    setIsStoryEnded(false);
    setIsModalOpen(false);
  };

  const handleVolumeChange = (event) => {
    const audioElement = document.getElementById('audio-element');
    const volumeValue = event.target.value;
    setVolume(volumeValue);
    if (audioElement) audioElement.volume = volumeValue;
  };

  console.log('storyData.length: ', storyData.length);
  console.log('currentStory: ', currentStory);

  if (!storyData.length || !currentStory) return <p>Loading story...</p>;

  return (
    <div className="storyPage-container">
      <div className={`storyPage-box ${designClass}`}>
        <div className="content-box">
          <div className="storyPage-content">
            
            <button className="back-button" onClick={onBack}>
              <img src="/Images/backarrow.svg" alt="Back" className="back-button-image" />
              <span>العودة</span>
            </button>
            <img
              src={`${storyFolder}/images/${currentStory.image}`}
              alt="story image"
              className="storyPage-image"
            />
            <p className="storyPage-text">{currentStory.text}</p>

            {currentStory.sound && (
              <div className="audio-container">
                <audio 
                ref={audioRef}
                id="audio-element" key={currentStory.sound} controls autoPlay className="storyPage-audio">
                  <source src={`${storyFolder}/audio/${currentStory.sound}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
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
            <button className="restart-audio-button" onClick={handleRestartAudio}>إعادة تشغيل القصة</button>

            <div className="storyPage-buttons">
              {currentStory.options === 'yes' ? (
                <div className='options'>
                  {currentStory['option 1'] && (
                    <button onClick={() => handleChoice(currentStory['option 1'])}>الخيار الثاني</button>
                  )}
                  {currentStory['option 2'] && (
                    <button onClick={() => handleChoice(currentStory['option 2'])}>الخيار الاول</button>
                  )}
                </div>
              ) : (
                !isStoryEnded && <button className="next-button" onClick={handleNext}>التالي</button>
              )}
            </div>
          </div>
          {currentStepIndex > 0 && (
            <button className="back-step-button" onClick={handleBackStep}>السابق</button>
          )}
        </div>
      </div>
    <PopupModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      pathsTaken={pathsTaken}
      onRestart={handleRestartStory}
      storyPoints={storyPoints} 
      onNavigateBack={onBack}
      onQuizStart={handleQuizStart} // Make sure this is here

    />


{isQuizModalOpen && currentQuestion && (
  <QuizPopupModal
    isOpen={isQuizModalOpen}
    questionData={currentQuestion}
    onClose={handleQuizClose}

    style={{
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    }}
  />
)}


    </div>
  );
};

export default StoryPage;