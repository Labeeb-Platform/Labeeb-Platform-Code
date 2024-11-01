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
      alert('Your story has been submitted via email! Now evaluating the story...');

      // Start story evaluation with Allam
      await evaluateStory(formData.body);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit your story or evaluate it. Please try again later.');
    }
  };

//   const evaluateStory = async (storyText) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         'https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', // Replace with the actual Allam endpoint
//         {
//           prompt: `
//           المطلوب: أريدك أن تقوم بتقييم القصة بناءً على المعايير التالية، وتقديم درجات لكل معيار بالإضافة إلى تعليق مختصر يوضح السبب، وأيضًا احتساب المجموع النهائي.

//           نص القصة: ${storyText}

//           المعايير لتقييم القصة:
//           1- هيكل النص: تقييم مدى وضوح البداية، الوسط، والنهاية، ومدى تسلسل الأحداث.
//           2- الشخصيات: مدى بساطة الشخصيات وتوافقها مع البيئة الثقافية والدينية للأطفال.
//           3- اللغة والأسلوب: بساطة الكلمات ومدى ملاءمتها للفئة العمرية.
//           4- المحتوى والمغزى: وضوح المغزى الأخلاقي ومدى فهمه بسهولة.
//           5- الخيال والواقعية: التوازن بين الخيال المعتدل والواقعية.
//           6- الطول والانتباه: ملاءمة الطول للطفل وقدرته على المتابعة.
//           7- القيم الثقافية والدينية: تعزيز القيم الإسلامية والعربية.
//           8- قابلية الكلمات للتصور: إمكانية تخيل الكلمات والمواقف بسهولة.
//           9- قصر الجمل وكثرة الأحداث: التركيز على الجمل القصيرة والأحداث المتتابعة.
//           10- الملاءمة العاطفية: مناسبة المشاعر والأحداث لقدرة الطفل على الفهم.

//           نموذج الرد المطلوب: كل معيار يحصل على درجة من 1 إلى 5، مع شرح مختصر، ثم جمع الدرجات لإعطاء المجموع النهائي.
//           `,
//         },
//         {
//           headers: {
//             Authorization: `v-eUfsyk0RxN9bgBshUAp85W1yVv-XI-Tv_071k865RM`, // Replace with your Allam API key
//           },
//         }
//       );

//       // Capture the response for evaluation details
//       setEvaluationResult(response.data);
//     } catch (error) {
//       console.error('Error evaluating story:', error);
//       alert('Failed to evaluate your story. Please check your API connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

const evaluateStory = async (storyText) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/evaluate',
        { storyText }
      );
      setEvaluationResult(response.data.evaluation);
    } catch (error) {
      console.error('Error evaluating story:', error);
      alert('Failed to evaluate your story. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="submit-story-page">
      <button onClick={onBack}>Back</button>
      <h2>Submit Your Story</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Body:
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting and Evaluating...' : 'Submit'}
        </button>
      </form>
      
      {/* Display evaluation result */}
      {evaluationResult && (
        <div>
          <h3>Evaluation Result:</h3>
          <pre>{JSON.stringify(evaluationResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SubmitStoryPage;
