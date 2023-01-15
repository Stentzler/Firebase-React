import MotionContainer from '../components/Motion';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import app from '../firebase.config';
import {toast} from 'react-toastify';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setEmail(e.target.value);

	const onSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const auth = getAuth(app);
			await sendPasswordResetEmail(auth, email);
			toast.success('Email was sent');
			navigate('/');
		} catch (error) {
			toast.error('Not able to send the email');
		}
	};

	return (
		<MotionContainer>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Forgot Password</p>
				</header>

				<main>
					<form onSubmit={onSubmit}>
						<input
							type='email'
							className='emailInput'
							placeholder='Email'
							id='email'
							value={email}
							onChange={onChange}
						/>
						<Link className='forgotPasswordLink' to='/sign-in'>
							Sign In
						</Link>

						<div className='signInBar'>
							<div className='signInText'>Send Reset Link</div>
							<button className='signInButton'>
								<ArrowRightIcon fill='#fff' width='34px' height='34px' />
							</button>
						</div>
					</form>
				</main>
			</div>
		</MotionContainer>
	);
}

export default ForgotPassword;
