require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import CORS

const axios = require('axios');
const bodyParser = require('body-parser');

class IBMWatsonXAIWrapper {
  constructor() {
    this.apiKey = process.env.IBM_WATSONX_API_KEY;
    this.projectId = process.env.IBM_WATSONX_PROJECT_ID;
    this.baseUrl = process.env.IBM_WATSONX_URL;
    this.modelId = 'sdaia/allam-1-13b-instruct'; // Update if a different model is used
    this.parameters = {
      decoding_method: 'greedy',
      max_new_tokens: 400,
      temperature: 0.7,
      top_p: 1,
      repetition_penalty: 1.0
    };
  }

  async getAccessToken() {
    const tokenUrl = 'https://iam.cloud.ibm.com/identity/token';
    try {
      const response = await axios.post(tokenUrl, new URLSearchParams({
        'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
        'apikey': this.apiKey
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error obtaining access token:', error.message);
      throw new Error('Failed to get access token');
    }
  }

  async evaluateStory(storyText) {
    const accessToken = await this.getAccessToken();
    const evaluationUrl = `${this.baseUrl}/ml/v1/text/generation?version=2023-05-29`;

     const prompt = `
      المطلوب: أريدك أن تقوم بتقييم القصة المقدمة بناءً على المعايير التالية، مع التركيز على ملاءمتها للأطفال بعمر 3-5 سنوات، وإعطاء درجة لكل معيار، ثم احتساب المجموع النهائي. تأكد أن القصة خالية من أي محتوى غير مناسب للأطفال، وأن تكون المصطلحات بسيطة وسهلة الفهم. يجب أن تكون التقييمات دقيقة بما يتناسب مع قدرات الأطفال على الفهم في هذه الفئة العمرية، وأن يتم تقديم ملخص نهائي عن مدى ملاءمة القصة للأطفال من حيث اللغة والمضمون.

      إرشادات إضافية للتقييم:

      1. الكلمات والمصطلحات: إذا وُجدت كلمات قد تكون غير مألوفة أو صعبة على الأطفال بعمر 3-5 سنوات، مثل "الدروب القاحلة" أو "المروءة"، يجب خفض التقييم لهذا المعيار...
      2. التكرار والتوضيح: التكرار يساعد الأطفال على استيعاب الفكرة والمغزى، فإذا كانت القصة تفتقر إلى تكرار الأفكار أو الجمل الأساسية، خفّض التقييم في معيار التكرار. كما يُفضّل إعادة ذكر المغزى بطرق مبسطة لضمان فهم الأطفال له.

3. قابلية الكلمات للتصور: يجب أن تكون الأحداث والأوصاف سهلة التخيل، فإذا تضمنت القصة بيئات أو أوصافًا قد تكون غير مألوفة أو صعبة على الطفل تصورها، مثل الصحراء القاحلة أو العادات البدوية، خفّض التقييم لمعيار قابلية الكلمات للتصور. استخدم أوصافًا بسيطة ومألوفة للأطفال، حيث إنهم يحتاجون إلى تصور الأحداث بسهولة.

4. تسلسل الأحداث: يجب أن يكون تسلسل الأحداث بسيطًا وواضحًا، بحيث يمكن للطفل متابعته دون مساعدة. إذا كانت القصة تحتوي على تعقيد في تسلسل الأحداث، خفّض التقييم في معيار هيكل النص. كلما زادت الحاجة إلى تفسير إضافي، يجب خفض التقييم بشكل أكبر.

5. الملاءمة العاطفية والقيم الأخلاقية: إذا تضمنت القصة قيمًا أو مشاعر تتطلب تفسيرًا معقدًا (مثل الشجاعة في مواقف قد تكون غير مألوفة أو تحمل صراعًا كبيرًا)، يجب خفض التقييم لمعيار الملاءمة العاطفية والقيم الثقافية. يُفضّل تقديم قيم بسيطة وواضحة ومناسبة لعمر الأطفال.


      
      نص القصة: ${storyText}

      المعايير لتقييم القصة:
      1. ملاءمة المحتوى للأطفال: 
   - درجة: 2/5 - [يفضل الابتعاد عن موضوعات مثل [أذكر أي مواضيع غير ملائمة إن وجدت] بسبب عدم ملاءمتها لهذه الفئة العمرية]

2. اللغة والمصطلحات: 
   - درجة: 4/5 - [يجب أن تكون بعض المصطلحات أبسط بحيث يسهل فهمها للأطفال دون مساعدة]

3. التكرار في الأحداث:
   - درجة: 4/5 - [التكرار يساعد الطفل على استيعاب المغزى، يمكن تعزيز بعض الأجزاء بتكرار إضافي لجعل القصة أكثر جذباً]

...(إكمال باقي المعايير)

 مثلا 30  من 50 المجموع النهائي: [المجموع الكلي من 50]

تعليق نهائي مختصر: يُنصح بتعديل بعض المصطلحات والأحداث لتصبح القصة أكثر ملاءمة للأطفال بعمر 3-5 سنوات. استخدم تكرارًا بسيطًا للأفكار لزيادة وضوح المغزى.

هل القصة ملائمة للأطفال: نعم / لا
    `;

    const requestBody = {
      input: `<s> [INST] ${prompt} [/INST]`,
      parameters: this.parameters,
      model_id: this.modelId,
      project_id: this.projectId
    };

    try {
      const response = await axios.post(evaluationUrl, requestBody, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data.results[0].generated_text;
    } catch (error) {
      console.error('Error evaluating story:', error.response ? error.response.data : error.message);
      throw new Error('Story evaluation failed');
    }
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

// Enable CORS for all routes, allowing requests from http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000'  // Replace with your frontend URL
}));
app.use(express.json());



// Endpoint to evaluate story
app.post('/evaluate', async (req, res) => {
  const { storyText } = req.body;

  if (!storyText) {
    return res.status(400).json({ error: 'No story text provided' });
  }

  try {
    const wrapper = new IBMWatsonXAIWrapper();
    const evaluation = await wrapper.evaluateStory(storyText);
    res.json({ evaluation });
  } catch (error) {
    res.status(500).json({ error: 'Story evaluation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
