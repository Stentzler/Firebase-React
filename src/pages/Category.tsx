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
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import ListingItems from '../components/ListingItems';
import MotionContainer from '../components/Motion';
import Spinner from '../components/Spinner';
import {db} from '../firebase.config';

interface data {
	id: string;
	data: DocumentData;
}

function Category() {
	const [disableBtn, setDisableBtn] = useState<boolean>(false);
	const [listings, setListings] = useState<[] | data[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [lastFetchedListing, setLastFetchedListing] = useState<any>(null);

	const params = useParams();

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Get Reference from firestore
				const listingsRef = collection(db, 'listings');

				// Creating a query
				const q = query(
					listingsRef,
					where('type', '==', params.categoryName),
					orderBy('timestamp', 'desc'),
					limit(4)
				);
				// Run query
				const querySnap = await getDocs(q);

				const currentLastDoc = querySnap.docs[querySnap.docs.length - 1];

				if (lastFetchedListing === currentLastDoc) {
					setDisableBtn(true);
				}

				setLastFetchedListing(currentLastDoc);

				const listings: data[] = [];

				querySnap.forEach(doc => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});

				setListings(listings);
				setLoading(false);
			} catch (error) {
				toast.error('Not able to fetch items');
			}
		};

		fetchListings();
	}, [params.categoryName]);

	//Load More Listings Button
	const onFetchMoreListings = async () => {
		try {
			// Get Reference from firestore
			const listingsRef = collection(db, 'listings');

			// Creating a query
			const q = query(
				listingsRef,
				where('type', '==', params.categoryName),
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(4)
			);
			// Run query
			const querySnap = await getDocs(q);

			const currentLastDoc = querySnap.docs[querySnap.docs.length - 1];
			setLastFetchedListing(currentLastDoc);

			const listings: data[] = [];

			querySnap.forEach(doc => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(prev => [...prev, ...listings]);
			setLoading(false);
		} catch (error) {
			toast.error('Not able to fetch items');
		}
	};

	return (
		<MotionContainer>
			<div className='category'>
				<header className='pageHeader'>
					<p className='pageHeader'>
						{params.categoryName === 'rent' ? 'Aluguel' : 'Compra'}
					</p>
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
							<p className='loadMore disabled'>Nao há mais imóveis</p>
						)}
					</>
				) : (
					<p>
						Nada foi encontrado em:{' '}
						{params.categoryName === 'rent'
							? 'Alugar Imóveis'
							: 'Vender Imóveis'}
					</p>
				)}
			</div>
		</MotionContainer>
	);
}

export default Category;
