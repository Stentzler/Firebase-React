import {motion} from 'framer-motion';

interface Props {
	children: React.ReactNode;
}

function MotionContainer({children}: Props) {
	return (
		<motion.div
			style={{display: 'flex', justifyContent: 'center'}}
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			transition={{duration: 0.3}}
			className='animation-container'
		>
			{children}
		</motion.div>
	);
}

export default MotionContainer;
