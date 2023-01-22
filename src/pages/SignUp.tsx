import MotionContainer from '../components/Motion';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import {FaEyeSlash, FaEye} from 'react-icons/fa';
// import {
// 	getAuth,
// 	createUserWithEmailAndPassword,
// 	updateProfile,
// } from 'firebase/auth';
// import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
// import app, {db} from '../firebase.config';
import {toast} from 'react-toastify';
import OAuth from '../components/OAuth';

function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});
	const {email, password, name} = formData;
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
			// const auth = getAuth(app);

			// const userCredential = await createUserWithEmailAndPassword(
			// 	auth,
			// 	email,
			// 	password
			// );

			// const user = userCredential.user;

			// await updateProfile(auth.currentUser!, {
			// 	displayName: name,
			// });

			// const formDataCopy: any = {...formData};
			// delete formDataCopy.password;
			// formDataCopy.timestamp = serverTimestamp();

			// await setDoc(doc(db, 'users', user.uid), formDataCopy);

			toast.error('Não podemos registrá-lo devido ao storage da Database!');

			navigate('/');
		} catch (error: any) {
			toast.error('Náo foi possível registrar com os dados fornecidos');
		}
	};

	return (
		<>
			<MotionContainer className='pageContainer'>
				<header>
					<p className='pageHeader'>Registrar</p>
				</header>

				<main>
					<form onSubmit={onSubmit}>
						<input
							type='text'
							className='nameInput'
							placeholder='Nome'
							id='name'
							value={name}
							onChange={onChange}
						/>

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

						<div className='signUpBar'>
							<p className='signUpText'>Registrar</p>
							<button className='signInButton'>
								<ArrowRightIcon fill='#fff' width='34px' height='34px' />
							</button>
						</div>
					</form>

					<OAuth />
					<div className='center-tag'>
						<Link to='/sign-in' className='registerLink'>
							Login
						</Link>
					</div>
				</main>
			</MotionContainer>
		</>
	);
}

export default SignUp;
