import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import app, {db} from '../firebase.config';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoogleClick = async () => {
		try {
			const auth = getAuth(app);
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Check for user
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			// if User doesnt exist, create user
			if (!docSnap.exists()) {
				await setDoc(doc(db, 'users', user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}

			toast.success('Logged in successfully');
			navigate('/');
		} catch (error) {
			toast.error('Google creadentials not allowed');
		}
	};

	return (
		<div className='socialLogin'>
			<p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
			<button className='socialIconDiv' onClick={onGoogleClick}>
				<img className='socialIconImg' src={googleIcon} alt='google' />
			</button>
		</div>
	);
}

export default OAuth;
