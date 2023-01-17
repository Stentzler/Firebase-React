import MotionContainer from '../components/Motion';
import {getAuth, updateProfile} from 'firebase/auth';
import {updateDoc, doc} from 'firebase/firestore';
import app, {db} from '../firebase.config';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
	const auth = getAuth(app);
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth.currentUser?.displayName,
		email: auth.currentUser?.email,
	});
	const {email, name} = formData;

	const navigate = useNavigate();

	const onLogout = async () => {
		try {
			await auth.signOut();
			navigate('/');
		} catch (error) {
			toast.error('Not able to logout, try again');
		}
	};

	const onSubmit = async () => {
		try {
			if (auth.currentUser?.displayName !== name) {
				//Update name in firebase
				await updateProfile(auth.currentUser!, {
					displayName: name,
				});

				//Update in Firestore
				const userRef = doc(db, 'users', auth.currentUser!.uid);
				await updateDoc(userRef, {
					name,
				});

				toast.success('Profile updated!');
			}
		} catch (error) {
			toast.error('Unable to update user details');
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	return (
		<MotionContainer>
			<div className='profile'>
				<header className='profileHeader'>
					<p className='pageHeader'>My Profile</p>
					<button type='button' className='logOut' onClick={onLogout}>
						Logout
					</button>
				</header>
				<main>
					<div className='profileDetailsHeader'>
						<p className='profileDetailsText'>Personal Details</p>
						<p
							className='changePersonalDetails'
							onClick={() => {
								changeDetails && onSubmit();
								setChangeDetails(prev => !prev);
							}}
						>
							{changeDetails ? 'Confirm' : 'Change'}
						</p>
					</div>

					<div className='profileCard'>
						<form>
							<input
								type='text'
								id='name'
								className={!changeDetails ? 'profileName' : 'profileNameActive'}
								disabled={!changeDetails}
								value={name!}
								onChange={onChange}
							/>

							<input
								type='text'
								id='email'
								className='profileEmail'
								disabled={true}
								value={email!}
							/>
						</form>
					</div>

					<Link to='/create-listing' className='createListing'>
						<img src={homeIcon} alt='home' />
						<p>Venda ou alugue seu imóvel</p>
						<img src={arrowRight} alt='arrow' />
					</Link>
				</main>
			</div>
		</MotionContainer>
	);
}

export default Profile;
