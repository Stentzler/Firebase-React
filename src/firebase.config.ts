import {getFirestore} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyD6CLU3iRH0eZQVyv9eY3HuB9JaGU3poss',
	authDomain: 'marketplace-d9064.firebaseapp.com',
	projectId: 'marketplace-d9064',
	storageBucket: 'marketplace-d9064.appspot.com',
	messagingSenderId: '972150034133',
	appId: '1:972150034133:web:ee3ff4426cdd8098dc9c5c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export default app;
