import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {useEffect, useState, useRef} from 'react';
import app from '../firebase.config';

export const useAuthStatus = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [checkingStatus, setcheckingStatus] = useState(true);
	const isMounted = useRef(true);

	useEffect(() => {
		if (isMounted) {
			const auth = getAuth(app);
			onAuthStateChanged(auth, user => {
				if (user) {
					setLoggedIn(true);
				}
				setcheckingStatus(false);
			});
		}

		return () => {
			isMounted.current = false;
		};
	}, [isMounted]);

	return {loggedIn, checkingStatus};
};
