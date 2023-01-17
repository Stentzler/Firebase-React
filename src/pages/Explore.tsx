import {Link} from 'react-router-dom';
import MotionContainer from '../components/Motion';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

function Explore() {
	return (
		<MotionContainer>
			<div className='explore'>
				<header>
					<p className='pageHeader'>Explore</p>
				</header>
				<main>
					{/* Slider */}
					<p className='exploreCategoryHeading'>Categories</p>
					<div className='exploreCategories'>
						<Link to='/category/rent'>
							<img
								src={rentCategoryImage}
								alt='rent'
								className='exploreCategoryImg'
							/>
							<p className='exploreCategoryName'>Properties for rent</p>
						</Link>

						<Link to='/category/sale'>
							<img
								src={sellCategoryImage}
								alt='sell'
								className='exploreCategoryImg'
							/>
							<p className='exploreCategoryName'>Properties for sale</p>
						</Link>
					</div>
				</main>
			</div>
		</MotionContainer>
	);
}

export default Explore;
