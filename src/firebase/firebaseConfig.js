// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc , updateDoc, arrayUnion, getDoc,} from 'firebase/firestore';


// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0FOD-888pbWQkBO6lL03cgBBXcJEqSmg",
  authDomain: "labeeb-kidz-platform.firebaseapp.com",
  projectId: "labeeb-kidz-platform",
  storageBucket: "labeeb-kidz-platform.firebasestorage.app",
  messagingSenderId: "1008156434171",
  appId: "1:1008156434171:web:5bbe917e488f4159111a5e",
  measurementId: "G-LKLRTWT7E8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// Helper function to fetch points for a specific story
const fetchStoryPoints = async (storyId) => {
  try {
    const docRef = doc(db, 'stories', storyId); // Adjust collection name if needed
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().points || 0; // Assumes 'points' field exists; defaults to 0 if missing
    } else {
      console.log("No such story document found!");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching story points:", error);
    return 0;
  }
};

export {
  auth,
  db,
  signInAnonymously,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  fetchStoryPoints, // Export the helper function
};

