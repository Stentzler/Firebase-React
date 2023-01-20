import MotionContainer from '../components/Motion';
import {getAuth, updateProfile} from 'firebase/auth';
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from 'firebase/firestore';
import app, {db} from '../firebase.config';
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import Spinner from '../components/Spinner';
import ListingItems from '../components/ListingItems';

function Profile() {
	const auth = getAuth(app);
	const [loading, setLoading] = useState(true);
	const [changeDetails, setChangeDetails] = useState(false);
	const [userListings, setUserListings] = useState<any[]>([]);
	const [formData, setFormData] = useState({
		name: auth.currentUser?.displayName,
		email: auth.currentUser?.email,
	});
	const {email, name} = formData;

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingRef = collection(db, 'listings');
			const q = query(
				listingRef,
				where('userRef', '==', auth.currentUser!.uid),
				orderBy('timestamp', 'desc')
			);

			const querySnap = await getDocs(q);

			let listingsArr: any[] = [];

			querySnap.docs.forEach(doc => {
				return listingsArr.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setUserListings(listingsArr);
		};

		fetchUserListings();
		setLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onLogout = async () => {
		try {
			await auth.signOut();
			navigate('/');
		} catch (error) {
			toast.error('Não foi possível deslogar');
		}
	};

	const onSubmit = async () => {
		try {
			if (auth.currentUser?.displayName !== name) {
				//Update name in firebase
				await updateProfile(auth.currentUser!, {
					displayName: name,
				});

				//Update in Firestore
				const userRef = doc(db, 'users', auth.currentUser!.uid);
				await updateDoc(userRef, {
					name,
				});

				toast.success('Perfil Alterado!');
			}
		} catch (error) {
			toast.error('Não foi possível alterar perfil');
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onDelete = async (listingId: any) => {
		if (window.confirm('Deseja mesmo deletar este item?')) {
			await deleteDoc(doc(db, 'listings', listingId));

			const updatedListings = userListings.filter(
				listing => listing.id !== listingId
			);

			setUserListings(updatedListings);
			toast.success('Item removido com sucesso!');
		}
	};

	const onEdit = (listingId: any) => navigate(`/edit-listing/${listingId}`);

	if (loading) {
		return <Spinner />;
	}

	return (
		<MotionContainer>
			<div className='profile'>
				<header className='profileHeader'>
					<p className='pageHeader'>Meu Perfil</p>
					<button type='button' className='logOut' onClick={onLogout}>
						Deslogar
					</button>
				</header>
				<main>
					<div className='profileDetailsHeader'>
						<p className='profileDetailsText'>Informações pessoais</p>
						<p
							className='changePersonalDetails'
							onClick={() => {
								changeDetails && onSubmit();
								setChangeDetails(prev => !prev);
							}}
						>
							{changeDetails ? 'Confirmar' : 'Alterar'}
						</p>
					</div>

					<div className='profileCard'>
						<form>
							<input
								type='text'
								id='name'
								className={!changeDetails ? 'profileName' : 'profileNameActive'}
								disabled={!changeDetails}
								value={name!}
								onChange={onChange}
							/>

							<input
								type='text'
								id='email'
								className='profileEmail'
								disabled={true}
								value={email!}
							/>
						</form>
					</div>

					<Link to='/create-listing' className='createListing'>
						<img src={homeIcon} alt='home' />
						<p>Venda ou alugue seu imóvel</p>
						<img src={arrowRight} alt='arrow' />
					</Link>

					{!loading && userListings?.length > 0 && (
						<>
							<p className='listingText'>Seus imóveis</p>
							<ul className='listingsList'>
								{userListings?.map((listing: any) => (
									<ListingItems
										key={listing.id}
										listing={listing.data}
										id={listing.id}
										onDelete={onDelete}
										onEdit={() => onEdit(listing.id)}
									></ListingItems>
								))}
							</ul>
						</>
					)}
				</main>
			</div>
		</MotionContainer>
	);
}

export default Profile;
