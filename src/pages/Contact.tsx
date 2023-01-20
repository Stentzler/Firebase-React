import MotionContainer from '../components/Motion';
import {useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {doc, DocumentData, getDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';

function Contact() {
	const [landlord, setLandlord] = useState<DocumentData | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();

	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const getLandlord = async () => {
			const docRef = doc(db, 'users', params.landlordId!);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setLandlord(docSnap.data());
			} else {
				toast.error('Não é possível contactar este usuário');
				navigate(-1);
			}
		};

		getLandlord();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<MotionContainer>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Dados para contato</p>
				</header>
				{landlord !== null && (
					<main>
						<div className='contactLandlord'>
							<p className='landlordName'>Proprietário: {landlord?.name}</p>
							<p className='landlordName'>Email: {landlord?.email}</p>
							<p className='landlordName'>
								Imóvel: {searchParams.get('listingName')}
							</p>
						</div>
					</main>
				)}
			</div>
		</MotionContainer>
	);
}

export default Contact;
