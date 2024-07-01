import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBS4iRn_C6KDkl-r7UhUGawGi9BCQm2VHM",
  authDomain: "imageuploadv3.firebaseapp.com",
  projectId: "imageuploadv3",
  storageBucket: "imageuploadv3.appspot.com",
  messagingSenderId: "519262163364",
  appId: "1:519262163364:web:63fd52bd73b07158207131"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
