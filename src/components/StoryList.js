// import React, { useState } from 'react';
// import './StoryList.css'; // Import the CSS file
// import StoryPage from './StoryPage'; // Import the StoryPage component

// const StoryList = () => {
//   const [selectedStory, setSelectedStory] = useState(null); // Manage selected story

//   // Define your stories with folder paths and design classes
//   const stories = [
//     { title: 'قصة النحلة النشيطة', image: '/Images/bee2.svg', folder: '/data/beeStory', design: 'beeStoryDesign' },
//     { title: 'قصة فارس والفضاء', image: '/Images/astronaut.svg', folder: '/data/spaceStory', design: 'spaceStoryDesign' },
//     { title: 'قصة الابل و الارقام', image: '/Images/camel.svg', folder: '/data/camelStory', design: 'camelStoryDesign' },
//     { title: 'قصة لينة صديقة الارض الخضراء', image: '/Images/green.svg', folder: '/data/greenEarthStory', design: 'greenEarthStoryDesign' },
//     { title: 'قصة رحلة ليلى الى جبال الطائف', image: '/Images/mountain3.svg', folder: '/data/taifTripStory', design: 'taifTripStoryDesign' }
//   ];

//   const handleStoryClick = (story) => {
//     setSelectedStory(story); // Set the selected story's data when clicked
//   };

//   const handleBack = () => {
//     setSelectedStory(null); // Reset to story list when back is clicked
//   };

//   return (
//     <div className="storylist-container">
//       {/* If a story is selected, show StoryPage, otherwise show StoryList */}
//       {selectedStory ? (
//         <StoryPage 
//           storyFolder={selectedStory.folder} 
//           designClass={selectedStory.design}  // Pass the design class to StoryPage
//           onBack={handleBack} 

//         />
//       ) : (
//         <div className="storyList-boxes">
//           {stories.map((story) => (
//             <div
//               key={story.title}
//               className="storyList-box"
//               onClick={() => handleStoryClick(story)} // Handle click on story
//             >
//               <img src={story.image} alt={story.title} className="storyList-image" />
//               <p>{story.title}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StoryList;

import React, { useState, useEffect } from 'react';
import './StoryList.css';
import StoryPage from './StoryPage';
import SubmitStoryPage from './SubmitStoryPage';
import starFullImage from '../assets/loginPage/StoryStarFull.svg';
import starEmptyImage from '../assets/loginPage/StoryStarEmpty.svg';
import { collection, onSnapshot } from "firebase/firestore";
import { db, doc, getDoc, setDoc, updateDoc, arrayUnion } from '../firebase/firebaseConfig';


const StoryList = ({ userId, onLogout }) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [isSubmitPageOpen, setIsSubmitPageOpen] = useState(false);
  const [stories, setStories] = useState([
    { title: 'قصة النحلة النشيطة', image: '/Images/bee2.svg', folder: '/data/beeStory', design: 'beeStoryDesign', points: 0 },
    { title: 'قصة فارس والفضاء', image: '/Images/astronaut.svg', folder: '/data/spaceStory', design: 'spaceStoryDesign', points: 0 },
    { title: 'قصة الابل و الارقام', image: '/Images/camel.svg', folder: '/data/camelStory', design: 'camelStoryDesign', points: 0 },
    { title: 'قصة لينة صديقة الارض الخضراء', image: '/Images/green.svg', folder: '/data/greenEarthStory', design: 'greenEarthStoryDesign', points: 0 },
    { title: 'قصة رحلة ليلى الى جبال الطائف', image: '/Images/mountain3.svg', folder: '/data/taifTripStory', design: 'taifTripStoryDesign', points: 0 }
  ]);

  // Real-time listener for story points
  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'users', userId, 'stories'), (snapshot) => {
    setStories((prevStories) => 
      prevStories.map((story) => {
        const storyDoc = snapshot.docs.find(doc => doc.id === story.title);
        return storyDoc
          ? { ...story, points: storyDoc.data().points || 0 }
          : story;
      })
    );
  });

  return () => unsubscribe(); // Cleanup listener on unmount
}, [userId]); // Removed 'stories' dependency to avoid reinitializing on updates


  const handleStoryClick = (story) => setSelectedStory(story);

  const renderStars = (points) => {
    const maxStars = 4;
    return (
      <>
        {Array.from({ length: points }).map((_, index) => (
          <img src={starFullImage} alt="Full Star" key={`full-${index}`} />
        ))}
        {Array.from({ length: maxStars - points }).map((_, index) => (
          <img src={starEmptyImage} alt="Empty Star" key={`empty-${index}`} />
        ))}
      </>
    );
  };

  const handleBack = () => {
    setSelectedStory(null);
    setShowSubmitForm(false);
  };

  const openSubmitStoryPage = () => setIsSubmitPageOpen(true);
  const closeSubmitStoryPage = () => setIsSubmitPageOpen(false);
  const totalPoints = stories.reduce((sum, story) => sum + story.points, 0);


  return (
    <div className="storylist-page">
      {/* Ribbon at the top with Logout and Submit Story */}



     
   {!selectedStory && !isSubmitPageOpen && (

    <div className="top-ribbon">
  {/* Left section - Logout button */}
  <div className="ribbon-left">
    <button className="ribbon-button-logout" onClick={onLogout}>
  الخروج
</button>
  </div>

  {/* Center section - Create Story Button */}
  <div className="ribbon-center">
    <button className="ribbon-button" onClick={openSubmitStoryPage}>
      <img src="/Images/addStory3.svg" alt="Add Story" className="button-image" />
      <span className="button-text">اصنع قصتك من هنا</span>
    </button>
  </div>

  {/* Right section - Profile with username and total points */}
  <div className="ribbon-right">
        <div className="total-points">مجموع النجوم : {totalPoints} / 20</div>

      <div className="profile-circle">
    <p className="profile-username">اسم المستخدم</p>
    <img src="/Images/girl-char-login.png" alt="Profile" className="profile-image" />
    </div>
  </div>
</div>


)}

      <div className="storylist-container">
        {selectedStory ? (
          <StoryPage
            storyFolder={selectedStory.folder}
            designClass={selectedStory.design}
            userId={userId}
            storyId={selectedStory.title}
            onBack={() => setSelectedStory(null)}
          />
        ) : isSubmitPageOpen ? (
          <SubmitStoryPage userId={userId} onBack={closeSubmitStoryPage} />
        ) : (
          <div className="storyList-boxes">
            {stories.map((story) => (
              <div
                key={story.title}
                className="storyList-box"
                onClick={() => handleStoryClick(story)}
              >
                <img src={story.image} alt={story.title} className="storyList-image" />
                <p>{story.title}</p>
                <div className="story-stars">{renderStars(story.points)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );


};

export default StoryList;
