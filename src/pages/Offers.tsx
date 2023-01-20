import {
	collection,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import ListingItems from '../components/ListingItems';
import MotionContainer from '../components/Motion';
import Spinner from '../components/Spinner';
import {db} from '../firebase.config';

interface data {
	id: string;
	data: DocumentData;
}

function Offers() {
	const [listings, setListings] = useState<[] | data[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [disableBtn, setDisableBtn] = useState<boolean>(false);
	const [lastFetchedListing, setLastFetchedListing] = useState<any>(null);

	// const params = useParams();

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Get Reference from firestore
				const listingsRef = collection(db, 'listings');

				// Creating a query
				const q = query(
					listingsRef,
					where('offer', '==', true),
					orderBy('timestamp', 'desc'),
					limit(4)
				);
				// Run query
				const querySnap = await getDocs(q);

				let listings: data[] = [];
				const currentLastDoc = querySnap.docs[querySnap.docs.length - 1];

				if (lastFetchedListing === currentLastDoc) {
					setDisableBtn(true);
				}

				setLastFetchedListing(currentLastDoc);

				querySnap.forEach(doc => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});

				setListings(listings);
				setLoading(false);
			} catch (error) {
				toast.error('Não foi possível carregar os imóveis');
			}
		};

		fetchListings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Load More items button
	const onFetchMoreListings = async () => {
		try {
			// Get Reference from firestore
			const listingsRef = collection(db, 'listings');

			// Creating a query
			const q = query(
				listingsRef,
				where('offer', '==', true),
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(4)
			);
			// Run query
			const querySnap = await getDocs(q);

			let listings: data[] = [];
			const currentLastDoc = querySnap.docs[querySnap.docs.length - 1];
			setLastFetchedListing(currentLastDoc);

			querySnap.forEach(doc => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(prev => [...prev, ...listings]);
			setLoading(false);
		} catch (error) {
			toast.error('Não foi possível carregar os imóveis');
		}
	};

	return (
		<>
			<MotionContainer className='category'>
				<header className='pageHeader'>
					<p className='pageHeader'>Ofertas</p>
				</header>

				{loading ? (
					<Spinner />
				) : listings && listings.length > 0 ? (
					<>
						<main>
							<ul className='categoryListings'>
								{listings.map(item => (
									<ListingItems
										listing={item.data}
										id={item.id}
										key={item.id}
									></ListingItems>
								))}
							</ul>
						</main>

						{lastFetchedListing && !disableBtn ? (
							<p className='loadMore' onClick={onFetchMoreListings}>
								Ver mais
							</p>
						) : (
							<p className='loadMore disabled'>Nao há mais ofertas</p>
						)}
					</>
				) : (
					<p>Não há ofertas no momento</p>
				)}
			</MotionContainer>
		</>
	);
}

export default Offers;
