// import React, { useState } from 'react';
// import emailjs from 'emailjs-com';

// const SubmitStoryPage = ({ userId, onBack }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     body: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Prepare data to send
//     const dataToSend = {
//       title: formData.title,
//       body: formData.body,
//       user_id: userId, // Pass the userId from props
//     };

//     // Send email using EmailJS
//     emailjs
//       .send(
//         'service_c4ba0yb',   // Replace with your Service ID from EmailJS
//         'template_nqmzhxr',   // Replace with your Template ID from EmailJS
//         dataToSend,
//         'S8INIcWZ_Kx9x8fgX'        // Replace with your EmailJS User ID
//       )
//       .then((response) => {
//         console.log('Email sent successfully:', response);
//         alert('Your story has been submitted!');
//       })
//       .catch((error) => {
//         console.error('Error sending email:', error);
//         alert('Failed to submit your story. Please try again later.');
//       });
//   };

//   return (
//     <div className="submit-story-page">
//       <button onClick={onBack}>Back</button> {/* Back Button */}
//       <h2>Submit Your Story</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Title:
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Body:
//           <textarea
//             name="body"
//             value={formData.body}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default SubmitStoryPage;


import './SubmitStoryPageDesign.css';
import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';

const SubmitStoryPage = ({ userId, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for EmailJS and Allam API
    const dataToSend = {
      title: formData.title,
      body: formData.body,
      user_id: userId, // Pass the userId from props
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        'service_c4ba0yb',   // Replace with your Service ID from EmailJS
        'template_nqmzhxr',   // Replace with your Template ID from EmailJS
        dataToSend,
        'S8INIcWZ_Kx9x8fgX'        // Replace with your EmailJS User ID
      );
      alert('تم إرسال قصتك بنجاح عبر البريد الإلكتروني! جاري الآن تقييم القصة، ترقب النتائج قريباً... 😊📖');

      // Start story evaluation with Allam
      await evaluateStory(formData.body);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit your story or evaluate it. Please try again later.');
    }
  };




const evaluateStory = async (storyText) => {
  setLoading(true);
  try {
    const response = await axios.post(
      'http://localhost:5000/evaluate', // Use your local proxy server
      { storyText }
    );

    // Ensure response data structure is as expected
    if (response.data.evaluation.length > 0) {
      const resultText = response.data.evaluation;
      console.log("response.data.evaluation: ", response.data.evaluation)

      // Extract the specific portions from resultText
      const summaryCommentMatch = resultText.match(/تعليق نهائي مختصر: (.*)/);
      const suitabilityMatch = resultText.match(/ملاءمة القصة للأطفال: (.*)/);

      // Set extracted portions in the evaluation result without prefixes
      setEvaluationResult({
        finalComment: summaryCommentMatch ? summaryCommentMatch[1].trim() : "Not found",
        isSuitable: suitabilityMatch ? suitabilityMatch[1].trim() : "Not found",
      });
    } else {
      console.log("response.data.evaluation: ", response.data.evaluation);
      throw new Error("Unexpected response structure or missing data");
    }
  } catch (error) {
    console.error('Error evaluating story:', error);
    alert('Failed to evaluate your story. Please check your API connection.');
  } finally {
    setLoading(false);
  }
};






return (
    <div className="submit-story-container">
      
        <button onClick={onBack} className="form-back-button">
    <img src="/Images/backarrow.svg" alt="Back Icon" className="back-icon" />
    <span>العودة</span></button>

        <h1 className="creative-title">حان وقت الإبداع! اصنع قصتك</h1>
        <div className="submit-story-box">
            
            <form onSubmit={handleSubmit}>
                <label>
                    عنوان القصة
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="اكتب العنوان هنا" /* Placeholder for the title */
                        required
                    />
                </label>
                <label>
                    اكتب قصتك هنا
                    <textarea
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        placeholder="اكتب قصتك هنا" /* Placeholder for the story body */
                        required
                    />
                </label>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'جارٍ الإرسال والتقييم...' : 'أرسل قصتك'}
                </button>
            </form>
            {/* {evaluationResult && (
                <div className="evaluation-result">
                    <h3>نتيجة تقييم القصة</h3>
                    <p><strong>هل القصة مناسبة للاطفال ؟</strong> {evaluationResult.isSuitable}</p>
                    <p><strong>تعليق لتحسين القصة : </strong> {evaluationResult.finalComment}</p>
                </div>
            )} */}

            {evaluationResult && (
  <div className={`popup ${evaluationResult.isSuitable === "نعم" ? 'popup-success' : 'popup-error'}`}>
    {evaluationResult.isSuitable === "نعم" ? "تم تقديم القصة بنجاح، وهي مناسبة للأطفال!" : "عذرًا، القصة غير مناسبة للأطفال."}
  </div>
)}

 {evaluationResult && (
                <div className="evaluation-result">
                    <p><strong>تعليق لتحسين القصة : </strong> {evaluationResult.finalComment}</p>
                </div>
            )}

            
        </div>
    </div>
);





};

export default SubmitStoryPage;
