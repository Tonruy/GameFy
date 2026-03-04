import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { deleteMyProfile, updateMyProfile } from '../../api/usersApi';
import Spinner from '../ui/spinner/Spinner';
import './userDashBoardLayout.css';

export default function UserDashboardLayout() {
	const navigate = useNavigate();
	const { authUser, isAuthReady, syncAuthProfile, showFeedback } = useOutletContext();
	const [profileData, setProfileData] = useState({
		username: '',
		email: ''
	});
	const [usernameInput, setUsernameInput] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeletingProfile, setIsDeletingProfile] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const profileTitle = `${profileData.username || authUser?.username || 'User'}'s Profile`;
	const isBusy = isSubmitting || isDeletingProfile;

	useEffect(() => {
		if (!authUser) {
			return;
		}

		const nextProfileData = {
			username: authUser.username || '',
			email: authUser.email || ''
		};

		setProfileData(nextProfileData);
		setUsernameInput(nextProfileData.username);
	}, [authUser]);

	const handleStartEdit = () => {
		setUsernameInput(profileData.username);
		setErrorMessage('');
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setUsernameInput(profileData.username);
		setErrorMessage('');
		setIsDeleteModalOpen(false);
		setIsEditing(false);
	};

	const handleOpenDeleteModal = () => {
		setErrorMessage('');
		setIsDeleteModalOpen(true);
	};

	const handleCancelDeleteModal = () => {
		handleCancelEdit();
	};

	const handleSaveChanges = async () => {
		const normalizedUsername = usernameInput.trim();

		if (!normalizedUsername) {
			setErrorMessage('Username is required');
			return;
		}

		if (normalizedUsername.length < 3 || normalizedUsername.includes(' ')) {
			setErrorMessage('Invalid username');
			return;
		}

		if (normalizedUsername === profileData.username) {
			setIsEditing(false);
			return;
		}

		try {
			setIsSubmitting(true);
			setErrorMessage('');

			const updatedUser = await updateMyProfile({ username: normalizedUsername });
			const nextProfileData = {
				username: updatedUser?.username || normalizedUsername,
				email: updatedUser?.email || profileData.email
			};

			setProfileData(nextProfileData);
			setUsernameInput(nextProfileData.username);
			syncAuthProfile?.(updatedUser || nextProfileData);
			showFeedback?.('Profile updated');
			setIsEditing(false);
		} catch (error) {
			setErrorMessage(error.message || 'Could not update profile');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteProfile = async () => {
		try {
			setIsDeletingProfile(true);
			setErrorMessage('');
			await deleteMyProfile();
			localStorage.removeItem('gamefy_access_token');
			localStorage.removeItem('gamefy_refresh_token');
			showFeedback?.('Profile deleted', 'danger');
			navigate('/');
			window.location.reload();
		} catch (error) {
			setErrorMessage(error.message || 'Could not delete profile');
			setIsDeleteModalOpen(false);
		} finally {
			setIsDeletingProfile(false);
		}
	};

	if (!isAuthReady) {
		return <Spinner />;
	}

	if (!authUser) {
		return (
			<section className="user-dashboard route-transition">
				<div className="user-dashboard__card">
					<h1 className="user-dashboard__title">My Profile</h1>
					<p>Please login first to access your dashboard.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="user-dashboard route-transition">
			<div className="user-dashboard__card">
				<h1 className="user-dashboard__title">{profileTitle}</h1>

				<div className="user-dashboard__field">
					<p className="user-dashboard__label">Username</p>
					{isEditing ? (
						<input
							type="text"
							className="user-dashboard__input"
							autoFocus
							placeholder="Enter new username"
							value={usernameInput}
							onChange={(event) => setUsernameInput(event.target.value)}
						/>
					) : (
						<p className="user-dashboard__value">{profileData.username}</p>
					)}
				</div>

				<div className="user-dashboard__field">
					<p className="user-dashboard__label">Email</p>
					<p className="user-dashboard__value">{profileData.email}</p>
				</div>

				<div className="user-dashboard__actions">
					{isEditing ? (
						<>
							<button
								type="button"
								className="user-dashboard__button"
								onClick={handleSaveChanges}
								disabled={isBusy}
							>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</button>
							<button
								type="button"
								className="user-dashboard__button user-dashboard__button--secondary"
								onClick={handleCancelEdit}
								disabled={isBusy}
							>
								Cancel
							</button>
						</>
					) : (
						<>
							<button type="button" className="user-dashboard__button" onClick={handleStartEdit}>
								Edit Profile
							</button>
							<button
								type="button"
								className="user-dashboard__button user-dashboard__button--danger"
								onClick={handleOpenDeleteModal}
								disabled={isBusy}
							>
								Delete Account
							</button>
						</>
					)}
				</div>

				{errorMessage ? <p className="user-dashboard__error">{errorMessage}</p> : null}
			</div>

			{isDeleteModalOpen ? (
				<div className="user-dashboard__modalOverlay" onClick={handleCancelDeleteModal}>
					<div className="user-dashboard__modal user-dashboard__modal--danger" onClick={(event) => event.stopPropagation()}>
						<p className="user-dashboard__modalText">Your profile will be delete. Are you sure?</p>
						<div className="user-dashboard__modalActions">
							<button
								type="button"
								className="user-dashboard__button user-dashboard__button--danger"
								onClick={handleDeleteProfile}
								disabled={isBusy}
							>
								{isDeletingProfile ? 'Deleting...' : 'Yes'}
							</button>
							<button
								type="button"
								className="user-dashboard__button user-dashboard__button--secondary"
								onClick={handleCancelDeleteModal}
								disabled={isBusy}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
