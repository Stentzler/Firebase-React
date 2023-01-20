import {Link} from 'react-router-dom';
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg';
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';
import {useEffect, useState} from 'react';

function ListingItems({listing, id, onDelete, onEdit}: any) {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const updateWindowDimensions = (): any => {
			setWidth(window.innerWidth);
		};

		window.addEventListener('resize', updateWindowDimensions);
		updateWindowDimensions();

		return () => window.removeEventListener('resize', updateWindowDimensions);
	}, [width]);

	return (
		<li className='categoryListing'>
			<Link
				to={`/category/${listing.type}/${id}`}
				className='categoryListingLink'
			>
				<img
					src={listing.imgUrls[0]}
					alt={listing.name}
					className='categoryListingImg'
				/>
				<div className='categoryListingDetails'>
					<p className='categoryListingLocation'>
						{width >= 1024
							? listing.location
							: listing.location.length > 25
							? listing.location.slice(0, 25) + '...'
							: listing.location.length}
					</p>
					<p className='categoryListingName'>{listing.name}</p>
					<p className='categoryListingPrice'>
						$
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						{listing.type === 'rent' && ' - Mês'}
					</p>
					<div className='categoryListingInfoDiv'>
						<img src={bedIcon} alt='bed' />
						<p className='categoryListingInfoText'>
							{listing.bedrooms > 1
								? `${listing.bedrooms} Quartos`
								: '1 Quarto'}
						</p>
						<img src={bathtubIcon} alt='bath' />
						<p className='categoryListingInfoText'>
							{listing.bathrooms > 1
								? `${listing.bedrooms} Banheiros`
								: '1 Banheiro'}
						</p>
					</div>
				</div>
			</Link>

			{onDelete && (
				<DeleteIcon
					className='removeIcon'
					fill='rgb(231,76,60)'
					onClick={() => onDelete(id)}
				></DeleteIcon>
			)}

			{onEdit && (
				<EditIcon className='editIcon' onClick={() => onEdit(id)}></EditIcon>
			)}
		</li>
	);
}

export default ListingItems;
