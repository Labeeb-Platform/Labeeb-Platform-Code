import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import './PopupModalDesign.css';
import starFullImage from '../assets/loginPage/StoryStarFull.svg';
import starEmptyImage from '../assets/loginPage/StoryStarEmpty.svg';



Modal.setAppElement('#root');

const PopupModal = ({ isOpen, onClose, pathsTaken, onRestart, storyPoints, onNavigateBack, onQuizStart }) => {
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (isOpen && !hasPlayedSound.current) {
      const audio = new Audio("/audioAffects/starSoundAffect.mp3");
      audio.play();
      hasPlayedSound.current = true; // Set flag so the sound only plays once per open
    }
    // Reset the flag when the modal closes
    if (!isOpen) {
      hasPlayedSound.current = false;
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Stars Earned"
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
    >
      <h2>
        {storyPoints === 4
          ? "انت بطل القصة! أكملت كل النجوم"
          : storyPoints === 3
          ? "رائع! حصلت على 3 نجوم!"
          : storyPoints === 2
          ? "جيد! حصلت على نجمتين"
          : storyPoints === 1
          ? "أحسنت! حصلت على نجمة"
          : "جرب خيارات مختلفة في القصة لتحصل على النجوم"}
      </h2>

      <div className="stars-container">
        {Array.from({ length: 4 }).map((_, index) => (
          <img
            src={index < storyPoints ? starFullImage : starEmptyImage}
            alt={index < storyPoints ? "Full Star" : "Empty Star"}
            key={index}
            className="star-image"
          />
        ))}
      </div>

     

      {storyPoints === 4 ? (
  <button className="modal-button quiz-button"  onClick={() => {
    console.log('Quiz button clicked');
    onQuizStart(); // Ensure this triggers correctly
  }}>
    ابدأ التقييم
  </button>
) : (
  <button className="modal-button restart-button" onClick={onRestart}>
    أعد القصة وجمع المزيد من النجوم
  </button>
)}




      <button className="modal-button back-button" onClick={onNavigateBack}>
        العودة إلى قائمة القصص
      </button>
    </Modal>
  );
};

export default PopupModal;