import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../api/authApi.js';
import './registerComponent.css';

export default function RegisterComponent() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleRegisterSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage('');

		const normalizedEmail = email.trim();
		const normalizedUsername = username.trim();
		const normalizedPassword = password.trim();

		if (!normalizedEmail || !normalizedUsername || !normalizedPassword) {
			setErrorMessage('Please complete all fields');
			return;
		}

		if (normalizedPassword.length < 8) {
			setErrorMessage('Password must be at least 8 characters');
			return;
		}

		setIsSubmitting(true);

		try {
			const registerResponse = await registerUser(normalizedEmail, normalizedUsername, normalizedPassword);
			if (!registerResponse?.userId) {
				setErrorMessage('Invalid server response');
				return;
			}

			const loginResponse = await loginUser(normalizedUsername, normalizedPassword);
			if (!loginResponse?.token || !loginResponse?.refreshToken) {
				setErrorMessage('Account created, but auto-login failed. Please log in manually.');
				return;
			}

			localStorage.setItem('gamefy_access_token', loginResponse.token);
			localStorage.setItem('gamefy_refresh_token', loginResponse.refreshToken);

			navigate('/');
		} catch (error) {
			setErrorMessage(error.message || 'Register failed');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="register route-transition">
			<h1 className="register__title">Create Account</h1>
			<form className="register__form" onSubmit={handleRegisterSubmit}>
				<label htmlFor="registerEmail" className="register__label">Email</label>
				<input
					id="registerEmail"
					type="email"
					className="register__input"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>

				<label htmlFor="registerUsername" className="register__label">Username</label>
				<input
					id="registerUsername"
					type="text"
					className="register__input"
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>

				<label htmlFor="registerPassword" className="register__label">Password</label>
				<input
					id="registerPassword"
					type="password"
					className="register__input"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>

				<div className="register__actions">
					<button type="submit" className="register__submit" disabled={isSubmitting}>
						Register
					</button>
					<button
						type="button"
						className="register__cancel"
						onClick={() => navigate('/')}
					>
						Cancel
					</button>
				</div>

				{errorMessage ? <p className="register__error">{errorMessage}</p> : null}
			</form>
		</section>
	);
}
