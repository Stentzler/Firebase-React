import {Link} from 'react-router-dom';
import MotionContainer from '../components/Motion';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../components/Slider';

function Explore() {
	return (
		<>
			<MotionContainer className='explore'>
				<header>
					<p className='pageHeader'>Nossos Imóveis</p>
				</header>
				<main>
					<Slider />
					<p className='exploreCategoryHeading'>Categorias</p>
					<div className='exploreCategories'>
						<Link to='/category/rent'>
							<img
								src={rentCategoryImage}
								alt='rent'
								className='exploreCategoryImg'
							/>
							<p className='exploreCategoryName'>Alugar Imóvel</p>
						</Link>

						<Link to='/category/sale'>
							<img
								src={sellCategoryImage}
								alt='sell'
								className='exploreCategoryImg'
							/>
							<p className='exploreCategoryName'>Comprar Imóvel</p>
						</Link>
					</div>
				</main>
			</MotionContainer>
		</>
	);
}

export default Explore;
