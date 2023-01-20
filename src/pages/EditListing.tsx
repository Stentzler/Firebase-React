import {useState, useEffect, useRef} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage';
import {useNavigate, useParams} from 'react-router-dom';
import Spinner from '../components/Spinner';
import app, {db} from '../firebase.config';
import MotionContainer from '../components/Motion';
import {toast} from 'react-toastify';
import {v4 as uuid} from 'uuid';

function EditListings() {
	const [loading, setLoading] = useState(false);
	const [listing, setListing] = useState<any>(null);
	const [formData, setFormData] = useState<any>({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
	} = formData;

	const auth = getAuth(app);
	const navigate = useNavigate();
	const isMounted = useRef(true);
	const params = useParams();

	// Set userRef to logged in user
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, user => {
				if (user) {
					setFormData({...formData, userRef: user.uid});
				} else {
					navigate('/sign-in');
				}
			});
		}
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);

	// Fetch data from the listing to be updated
	useEffect(() => {
		setLoading(true);

		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId!);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const listing = docSnap.data();
				setListing(listing);
				setFormData({...listing, address: listing.location});
			} else {
				navigate('/');
				toast.error('Imóvel não encontrado.');
			}
		};
		fetchListing();
		setLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Redirect user if he does not own the listing
	useEffect(() => {
		if (listing && listing.userRef !== auth.currentUser!.uid) {
			toast.error('Acesso não permitido');
			navigate('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (e: any) => {
		e.preventDefault();

		setLoading(true);

		if (discountedPrice >= regularPrice) {
			setLoading(false);
			toast.error('Valor com desconto deve ser menor do que valor normal');
			return;
		}

		if (images.length > 6) {
			setLoading(false);
			toast.error('Máximo de 6 imagens');
			return;
		}

		// Adding geoloaction
		let geolocation: any = {};
		let location = undefined;

		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
		);
		const data = await response.json();
		geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
		geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

		location =
			data.status === 'OK' ? data.results[0]?.formatted_address : undefined;

		if (location === undefined) {
			setLoading(false);
			toast.error('O endereço enviado não foi encontrado');
			return;
		}

		// Store Images in firebase
		const storeImage = async (image: any) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser!.uid}-${image.name}-${uuid()}`;
				const storageRef = ref(storage, 'images/' + fileName);
				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					'state_changed',
					snapshot => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('upload' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload paused');
								break;
							case 'running':
								console.log('Upload running');
								break;
						}
					},
					error => {
						reject(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
							resolve(downloadURL);
						});
					}
				);
			});
		};

		const imgUrls = await Promise.all(
			[...images].map(image => storeImage(image))
		).catch(() => {
			setLoading(false);
			toast.error('Não foi possível enviar as imagens');
			return;
		});

		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
		};

		// Cleaning data for storage
		delete formDataCopy.images;
		delete formDataCopy.latitude;
		delete formDataCopy.longitude;
		delete formDataCopy.address;
		location && (formDataCopy.location = location);
		!formDataCopy.offer && delete formDataCopy.discountedPrice;

		// Update Listing
		const docRef = doc(db, 'listings', params.listingId!);
		await updateDoc(docRef, formDataCopy);

		setLoading(false);
		toast.success('Imóvel atualizado com sucesso!');
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	};

	const onMutate = (e: any) => {
		let boolean: null | boolean = null;

		if (e.target.value === 'true') {
			boolean = true;
		}
		if (e.target.value === 'false') {
			boolean = false;
		}

		//Files
		if (e.target.files) {
			setFormData((prev: any) => ({
				...prev,
				images: e.target.files,
			}));
		}
		//Text
		if (!e.target.files) {
			setFormData((prev: any) => ({
				...prev,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	};

	if (loading) {
		return <Spinner></Spinner>;
	}

	return (
		<MotionContainer>
			<div className='profile'>
				<header>
					<p className='pageHeader'>Alterar Dados do imóvel</p>
				</header>
				<main>
					<form onSubmit={onSubmit} className='registerForm'>
						<label className='formLabel'>Vender | Alugar</label>
						<div className='formButtons'>
							<button
								type='button'
								className={type === 'sale' ? 'formButtonActive' : 'formButton'}
								id='type'
								value='sale'
								onClick={onMutate}
							>
								Vender
							</button>
							<button
								type='button'
								className={type === 'rent' ? 'formButtonActive' : 'formButton'}
								id='type'
								value='rent'
								onClick={onMutate}
							>
								Alugar
							</button>
						</div>

						<label className='formLabel'>Descrição</label>
						<input
							type='text'
							className='formInputName'
							id='name'
							value={name}
							onChange={onMutate}
							maxLength={32}
							minLength={10}
							placeholder='Condomínio - Apartamento'
							required
						/>

						<div className='formRooms flex'>
							<div>
								<label className='formLabel'>Quartos</label>
								<input
									className='formInputSmall'
									type='number'
									id='bedrooms'
									value={bedrooms}
									onChange={onMutate}
									min='1'
									max='20'
									required
								/>
							</div>
							<div>
								<label className='formLabel'>Banheiros</label>
								<input
									className='formInputSmall'
									type='number'
									id='bathrooms'
									value={bathrooms}
									onChange={onMutate}
									min='1'
									max='20'
									required
								/>
							</div>
						</div>

						<label className='formLabel'>Garagem</label>
						<div className='formButtons'>
							<button
								className={parking ? 'formButtonActive' : 'formButton'}
								type='button'
								id='parking'
								value='true'
								onClick={onMutate}
							>
								Sim
							</button>
							<button
								className={!parking ? 'formButtonActive' : 'formButton'}
								type='button'
								id='parking'
								value='false'
								onClick={onMutate}
							>
								Não
							</button>
						</div>

						<label className='formLabel'>Mobiliado</label>
						<div className='formButtons'>
							<button
								className={furnished ? 'formButtonActive' : 'formButton'}
								type='button'
								id='furnished'
								value='true'
								onClick={onMutate}
							>
								Sim
							</button>
							<button
								className={!furnished ? 'formButtonActive' : 'formButton'}
								type='button'
								id='furnished'
								value='false'
								onClick={onMutate}
							>
								Não
							</button>
						</div>

						<label className='formLabel'>Endereço</label>
						<textarea
							className='formInputAddress'
							id='address'
							value={address}
							onChange={onMutate}
							required
						></textarea>

						<label className='formLabel'>Oferta</label>
						<div className='formButtons'>
							<button
								className={offer ? 'formButtonActive' : 'formButton'}
								type='button'
								id='offer'
								value='true'
								onClick={onMutate}
							>
								Sim
							</button>
							<button
								className={!offer ? 'formButtonActive' : 'formButton'}
								type='button'
								id='offer'
								value='false'
								onClick={onMutate}
							>
								Não
							</button>
						</div>

						<label className='formLabel'>Preço</label>
						<div className='formPriceDiv'>
							<input
								type='number'
								className='formInputSmall'
								id='regularPrice'
								value={regularPrice}
								onChange={onMutate}
								min='50'
								max='750000000'
							/>
							{type === 'rent' && <p className='formPriceText'>Valor Mensal</p>}
						</div>

						{offer && (
							<>
								<label className='formLabel'>Preço Promocional</label>
								<input
									type='number'
									className='formInputSmall'
									id='discountedPrice'
									value={discountedPrice}
									onChange={onMutate}
									min='50'
									max='750000000'
									required={offer}
								/>
							</>
						)}

						<label className='formLabel'>Imagens</label>
						<p className='imagesInfo'>A primeira imagem será a capa (max 6)</p>
						<input
							className='formInputFile'
							type='file'
							id='images'
							onChange={onMutate}
							max='6'
							accept='.jpg,.png,.jpeg'
							multiple
							required
						/>

						<button className='primaryButton createListingButton' type='submit'>
							Enviar
						</button>
					</form>
				</main>
			</div>
		</MotionContainer>
	);
}

export default EditListings;
