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


import React, { useState } from 'react';
import './StoryList.css';
import StoryPage from './StoryPage';
import SubmitStoryPage from './SubmitStoryPage'; // Import SubmitStoryPage


const StoryList = ({ userId }) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false); // New state for showing SubmitStoryPage
    const [isSubmitPageOpen, setIsSubmitPageOpen] = useState(false);



  const stories = [
    { title: 'قصة النحلة النشيطة', image: '/Images/bee2.svg', folder: '/data/beeStory', design: 'beeStoryDesign' },
    { title: 'قصة فارس والفضاء', image: '/Images/astronaut.svg', folder: '/data/spaceStory', design: 'spaceStoryDesign' },
    { title: 'قصة الابل و الارقام', image: '/Images/camel.svg', folder: '/data/camelStory', design: 'camelStoryDesign' },
    { title: 'قصة لينة صديقة الارض الخضراء', image: '/Images/green.svg', folder: '/data/greenEarthStory', design: 'greenEarthStoryDesign' },
    { title: 'قصة رحلة ليلى الى جبال الطائف', image: '/Images/mountain3.svg', folder: '/data/taifTripStory', design: 'taifTripStoryDesign' }
  ];

  

  console.log("userId ",userId)



  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleBack = () => {
    setSelectedStory(null);
    setShowSubmitForm(false);

  };

   const openSubmitStoryPage = () => {
    setIsSubmitPageOpen(true);
  };

  const closeSubmitStoryPage = () => {
    setIsSubmitPageOpen(false);
  };


  console.log("Story List Page, selectedStory: ",selectedStory)
  return (
    <div className="storylist-container">
      {selectedStory ? (
        <StoryPage 
          storyFolder={selectedStory.folder} 
          designClass={selectedStory.design} 
          userId={userId}
          storyId={selectedStory.title} 
          
          onBack={handleBack}
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
            </div>
          ))}

          <button onClick={openSubmitStoryPage}>Submit a Story</button> {/* New button */}


        </div>
      )}
    </div>
  );
};





export default StoryList;
