import {motion} from 'framer-motion';

interface Props {
	children: React.ReactNode;
	className?: string;
}

function MotionContainer({children, className = ''}: Props) {
	return (
		<motion.div
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			transition={{duration: 0.3}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export default MotionContainer;
