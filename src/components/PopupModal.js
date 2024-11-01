
import React from 'react';
import Modal from 'react-modal';
import './PopupModalDesign.css'; // Optional: Add custom styles for the modal
import starFullImage  from '../assets/loginPage/StoryStarFull.svg'; // Update this path to where you store the image
import starEmptyImage from '../assets/loginPage/StoryStarEmpty.svg';

Modal.setAppElement('#root'); // Bind modal to your root element

const PopupModal = ({ isOpen, onClose, pathsTaken, onRestart, storyPoints, onNavigateBack }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Stars Earned"
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}  // Disable closing on overlay click

    >
      <h2>أحسنت! لقد أكملت القصة!</h2>
      <p>المسارات التي اخترتها:</p>
      <ul>
        {pathsTaken.map((path, index) => (
          <li key={index}>مسار {path}</li>
        ))}
      </ul>
      <p>⭐ عدد النجوم المكتسبة: {storyPoints}</p> {/* Display total points */}

      {/* Stars Display */}
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

      <button onClick={onRestart}>إعادة القصة واختيار مسارات جديدة</button>
      <button onClick={onNavigateBack}>العودة إلى قائمة القصص</button> {/* New Button */}

    </Modal>
  );
};


export default PopupModal;
