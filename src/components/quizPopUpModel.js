import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './quizPopUpModel.css';

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

  if (!questionData) return null;

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);

    // Ensure trimmed, lower-cased comparison for consistency
    const processedAnswer = answer.trim().toLowerCase();
    const correctAnswer = questionData.correctAnswer.trim().toLowerCase();
    
    console.log("Selected Answer:", processedAnswer, "| Correct Answer:", correctAnswer);

    if (processedAnswer === correctAnswer) {
      setIsAnswerCorrect(true);
      setShowTryAgainMessage(false); // Clear "try again" message
    } else {
      setIsAnswerCorrect(false);
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
      {isAnswerCorrect && (
        <p className="quiz-feedback correct">إجابة صحيحة!</p>
      )}
      {showTryAgainMessage && !isAnswerCorrect && (
        <p className="quiz-feedback incorrect">حاول مرة اخرى</p>
      )}

      {/* Close button appears only if the correct answer is selected */}
      {isAnswerCorrect && (
        <button className="quiz-close-button" onClick={onClose}>إغلاق</button>
      )}
    </Modal>
  );
};

export default QuizPopupModal;
