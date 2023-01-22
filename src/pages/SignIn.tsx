import MotionContainer from '../components/Motion';
import {toast} from 'react-toastify';
import {FormEvent, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import {FaEyeSlash, FaEye} from 'react-icons/fa';
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

	const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		try {
			const auth = getAuth(app);

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				toast.success('Bem-vinda(o)!');
				navigate('/');
			}
		} catch (error) {
			toast.error('Credenciais inválidas');
		}
	};

	return (
		<MotionContainer>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Bem-vindo(a)</p>
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
								placeholder='Senha'
								id='password'
								value={password}
								onChange={onChange}
							/>

							{!showPassword ? (
								<FaEye
									size={28}
									className='showPassword'
									onClick={() => setShowPassword(prev => !prev)}
								/>
							) : (
								<FaEyeSlash
									size={28}
									className='showPassword'
									onClick={() => setShowPassword(prev => !prev)}
								/>
							)}
						</div>

						<Link to='/forgot-password' className='forgotPasswordLink'>
							Recuperar Senha
						</Link>

						<div className='signInBar'>
							<p className='signInText'>Login</p>
							<button className='signInButton'>
								<ArrowRightIcon fill='#fff' width='34px' height='34px' />
							</button>
						</div>
					</form>

					<OAuth />
					<div className='center-tag'>
						<Link to='/sign-up' className='registerLink'>
							Registrar-me
						</Link>
					</div>
				</main>
			</div>
		</MotionContainer>
	);
}

export default SignIn;
