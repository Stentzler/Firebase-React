import {getAuth} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Spinner from '../components/Spinner';
import app, {db} from '../firebase.config';
import shareIcon from '../assets/svg/shareIcon.svg';
import {toast} from 'react-toastify';
import MotionContainer from '../components/Motion';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import Carousel from 'nuka-carousel/lib/carousel';

function Listing() {
	const [listing, setListing] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [shareLink, setShareLink] = useState(false);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth(app);

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId!);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			} else {
				setLoading(false);
				navigate(`/category/${params.categoryName}`);
				toast.error('Não foi possível carregar dados deste produto');
			}
		};

		fetchListing();
	}, [navigate, params.listingId, params.categoryName]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<MotionContainer>
			<main>
				{/* <div className='swiper-container'>
					<div className='swiperSlideDiv'>
						<h3 className='swiperSlideImg'>1</h3>
					</div>
				</div> */}
				<React.StrictMode>
					<Carousel className='swiper-container'>
						{listing.imgUrls.map((url: any, index: any) => (
							<div
								className='swiperSlideDiv'
								key={index}
								style={{
									background: `url(${url}) center no-repeat`,
									backgroundSize: 'cover',
								}}
							></div>
						))}
					</Carousel>
				</React.StrictMode>

				<div
					className='shareIconDiv'
					onClick={() => {
						navigator.clipboard.writeText(window.location.href);
						setShareLink(true);
						setTimeout(() => {
							setShareLink(false);
						}, 3000);
					}}
				>
					<img src={shareIcon} alt='share' />
				</div>

				{shareLink && (
					<p className='linkCopied' style={{color: '#00CC66'}}>
						Endereço copiado com sucesso!
					</p>
				)}

				<div className='listingDetails'>
					<p className='listingName'>
						{listing.name} - $
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					</p>
					<p className='listingLocation'>{listing.location}</p>
					<p className='listingType'>
						{listing.type === 'rent' ? 'Alugar' : 'Venda'}
					</p>
					{listing.offer && (
						<p className='discountPrice'>
							${listing.regularPrice - listing.discountedPrice} desconto
						</p>
					)}

					<ul className='listDetailsList'>
						<li>
							{listing.bedroms > 1 ? `${listing.bedroms} Quartos` : '1 Quarto'}
						</li>
						<li>
							{listing.bathroms > 1
								? `${listing.bathroms} Banheiros`
								: '1 Banheiro'}
						</li>
						{listing.parking && <li>Garagem</li>}
						{listing.furnished && <li>Mobiliado</li>}
					</ul>

					<p className='listingLocationTitle'>Location</p>

					{/* Map Google */}
					<div className='leafletContainer'>
						<MapContainer
							style={{height: '100%', width: '100%'}}
							center={[listing.geolocation.lat, listing.geolocation.lng]}
							zoom={15}
							scrollWheelZoom={false}
						>
							<TileLayer url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />
							<Marker
								position={[listing.geolocation.lat, listing.geolocation.lng]}
							>
								<Popup>{listing.location}</Popup>
							</Marker>
						</MapContainer>
					</div>

					{auth.currentUser?.uid !== listing.userRef && (
						<Link
							to={`/contact/${listing.userRef}?listingName=${listing.name}`}
							className='primaryButton'
						>
							Entrar em contato
						</Link>
					)}
				</div>
			</main>
		</MotionContainer>
	);
}

export default Listing;
