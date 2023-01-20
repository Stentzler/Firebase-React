import {collection, getDocs, limit, orderBy, query} from 'firebase/firestore';
import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {db} from '../firebase.config';
import Carousel from 'nuka-carousel/lib/carousel';
import Spinner from '../components/Spinner';

function Slider() {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState<any>([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchListings = async () => {
			const listingsRef = collection(db, 'listings');
			const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
			const querySnap = await getDocs(q);

			let listingsArr: any[] = [];

			querySnap.forEach(doc => {
				return listingsArr.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listingsArr);
		};

		fetchListings();
		setLoading(false);
	}, []);

	if (loading) {
		return <Spinner />;
	}

	return (
		<>
			{listings.length > 0 && (
				<>
					<p className='exploreHeading'>Publicações Recentes</p>
					<Carousel className='swiper-container'>
						{listings.map((listing: any) => (
							<div
								className='swiperSlideHome'
								key={listing.id}
								style={{
									background: `url(${listing.data.imgUrls[0]}) center no-repeat`,
									backgroundSize: 'cover',
								}}
								onClick={() =>
									navigate(`/category/${listing.data.type}/${listing.id}`)
								}
							>
								<p className='swiperSlideText'>{listing.data.name}</p>
							</div>
						))}
					</Carousel>
				</>
			)}
		</>
	);
}

export default Slider;
