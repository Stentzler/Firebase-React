import MotionContainer from '../components/Motion';
import {toast} from 'react-toastify';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import app from '../firebase.config';
import OAuth from '../components/OAuth';

function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const {email, password} = formData;
	const navigate = useNavigate();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setFormData(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: any): Promise<void> => {
		e.preventDefault();

		try {
			const auth = getAuth(app);

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				toast.success('Welcome!');
				navigate('/');
			}
		} catch (error) {
			toast.error('Please check your credentials...');
		}
	};

	return (
		<MotionContainer>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Welcome Back</p>
				</header>

				<main>
					<form onSubmit={onSubmit}>
						<input
							type='email'
							className='emailInput'
							placeholder='email@email.com'
							id='email'
							value={email}
							onChange={onChange}
						/>
						<div className='passwordInputDiv'>
							<input
								type={showPassword ? 'text' : 'password'}
								className='passwordInput'
								placeholder='password'
								id='password'
								value={password}
								onChange={onChange}
							/>

							<img
								src={visibilityIcon}
								alt='show-password'
								className='showPassword'
								onClick={() => setShowPassword(prev => !prev)}
							/>
						</div>

						<Link to='/forgot-password' className='forgotPasswordLink'>
							Forgot Password?
						</Link>

						<div className='signInBar'>
							<p className='signInText'>Sign In</p>
							<button className='signInButton'>
								<ArrowRightIcon fill='#fff' width='34px' height='34px' />
							</button>
						</div>
					</form>

					<OAuth />
					<Link to='/sign-up' className='registerLink'>
						Sign Up Instead
					</Link>
				</main>
			</div>
		</MotionContainer>
	);
}

export default SignIn;
