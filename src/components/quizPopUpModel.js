import React, { useState , useEffect } from 'react';
import Modal from 'react-modal';
import './quizPopUpModel.css';

Modal.setAppElement('#root');

const QuizPopupModal = ({ isOpen, questionData, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [showTryAgainMessage, setShowTryAgainMessage] = useState(false);


    // Reset state each time modal opens with a new question
  useEffect(() => {
    if (isOpen && questionData) {
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setShowTryAgainMessage(false);
      console.log("New question loaded:", questionData);
    }
  }, [isOpen, questionData]);


   console.log("QuizPopupModal isOpen:", isOpen);
    console.log("QuizPopupModal questionData:", questionData);

  if (!questionData) return null; // Return early if no question data



  console.log("QuizPopupModal rendered with questionData:", questionData);

 const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);

    // Force lowercase comparison to ensure case-insensitivity and trim whitespace
      const isCorrect = answer.trim().toLowerCase() === questionData.correctAnswer.trim().toLowerCase();
    setIsAnswerCorrect(isCorrect);

    console.log("Selected Answer:", answer, "| Processed as:", answer.trim().toLowerCase());
    console.log("Correct Answer:", questionData.correctAnswer, "| Processed as:", questionData.correctAnswer.trim().toLowerCase());



      if (isCorrect) {
      setShowTryAgainMessage(false); // Clear "try again" message
    } else {
      setShowTryAgainMessage(true); // Display "try again" message
    }
  };


  
  


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Quiz Question"
      className="quiz-modal-content"
      overlayClassName="quiz-modal-overlay"
      shouldCloseOnOverlayClick={false}
    >
      <h3>السؤال: {questionData.questions}</h3>
      <div className="quiz-choices">
        {['A', 'B', 'C'].map((choiceKey) => (
          <button
            key={choiceKey}
            className={`quiz-choice-button ${selectedAnswer === questionData[choiceKey] ? 'selected' : ''}`}
            onClick={() => handleAnswerClick(questionData[choiceKey])}
          >
            {questionData[choiceKey]}
          </button>
        ))}
      </div>
      
      {/* Show feedback */}
      {isAnswerCorrect === true && (
        <p className="quiz-feedback correct">إجابة صحيحة!</p>
      )}
      {showTryAgainMessage && isAnswerCorrect === false && (
        <p className="quiz-feedback incorrect">إجابة خاطئة. حاول مرة أخرى!</p>
      )}

      {/* Close button appears only if the correct answer is selected */}
      {isAnswerCorrect && (
        <button className="close-button" onClick={onClose}>إغلاق</button>
      )}
    </Modal>
  );


};



export default QuizPopupModal;
