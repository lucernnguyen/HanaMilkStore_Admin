import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

const deleteImageFromFirebase = async (imagePath: string) => {
  const imageRef = ref(storage, imagePath);

  try {
    await deleteObject(imageRef);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

const firebaseService = {
    deleteImageFromFirebase
  };
  
  export default firebaseService;
