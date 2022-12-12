import {getFirestore} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyCj5SzakMy_gZwgytr6Rnh_EPlIO-V17Y4',
	authDomain: 'house-marketplace-4341d.firebaseapp.com',
	projectId: 'house-marketplace-4341d',
	storageBucket: 'house-marketplace-4341d.appspot.com',
	messagingSenderId: '601248107996',
	appId: '1:601248107996:web:5d9a540bb226b497995319',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
