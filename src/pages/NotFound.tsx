import {useLocation} from 'react-router-dom';
import MotionContainer from '../components/Motion';

function NotFound() {
	const location = useLocation();

	return (
		<>
			<MotionContainer className='explore'>
				<header>
					<p className='pageHeader'>404 - Not Found!</p>
				</header>
				<main>
					<p className='profileDetailsText'>
						{location.pathname} Path does not exist!
					</p>
				</main>
			</MotionContainer>
		</>
	);
}

export default NotFound;
