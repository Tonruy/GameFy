import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logoHorizontal from '../assets/logo horizontal.png';
import logoVertical from '../assets/logo vertical.png';
import searchIcon from '../assets/search.svg';
import { getGenres, getPlatforms } from '../api/catalogApi.js';
import { searchGames } from '../api/gamesApi.js';
import './AppLayout.css';
import { loginUser } from '../api/authApi.js';
import { getMe } from '../api/usersApi.js';
import FeedbackModal from '../components/ui/feedbackModal/FeedbackModal.jsx';

// Layout for diferent pages
// Header -> common for the pages
// Main/Outlet -> space where React renders the page

export default function AppLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const headerRef = useRef(null);
	const headerMeasureRef = useRef(null);
	// Refs to access popup containers in the real DOM for outside-click detection -> click outside modals -> close them
	const genresRef = useRef(null);
	const platformsRef = useRef(null);
	const navRef = useRef(null);
	const searchRef = useRef(null);
	const searchInputRef = useRef(null);
	const loginRef = useRef(null);
	const menuRef = useRef(null);
	// 3 different modals but only 1 could be opened
	const [isGenresActive, setIsGenresActive] = useState(false);
	const [isPlatformsActive, setIsPlatformsActive] = useState(false);
	const [isLoginActive, setIsLoginActive] = useState(false);
	const [isMenuActive, setIsMenuActive] = useState(false);
	const [isCompactHeader, setIsCompactHeader] = useState(false);
	// Catalog lists are preloaded once to avoid loading state on every click
	const [genresList, setGenresList] = useState([]);
	const [platformsList, setPlatformsList] = useState([]);
	// Search states:
	const [searchGame, setSearchGame] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
	// Login states and login submits
	const [loginIdentifier, setLoginIdentifier] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
	const [loginError, setLoginError] = useState('');
	const [authUser, setAuthUser] = useState(null);
	const [isAuthReady, setIsAuthReady] = useState(false);
	const [feedbackModal, setFeedbackModal] = useState({
		isOpen: false,
		message: '',
		type: 'success'
	});

	// Preload both catalogs on mount so popup opening feels instant
	// Evade fetching everytime we click the button
	useEffect(() => {
		const preloadCatalog = async () => {
			try {
				const [genresData, platformsData] = await Promise.all([
					getGenres(),
					getPlatforms()
				]);
				setGenresList(genresData || []);
				setPlatformsList(platformsData || []);
			} catch {
				setGenresList([]);
				setPlatformsList([]);
			}
		};

		preloadCatalog();
	}, []);

	useEffect(() => {
		const accessToken = localStorage.getItem('gamefy_access_token');
		if (!accessToken) {
			setAuthUser(null);
			setIsAuthReady(true);
			return;
		}

		const loadCurrentUser = async () => {
			try {
				const userData = await getMe();
				setAuthUser(userData || null);
			} catch {
				localStorage.removeItem('gamefy_access_token');
				localStorage.removeItem('gamefy_refresh_token');
				setAuthUser(null);
			} finally {
				setIsAuthReady(true);
			}
		};

		loadCurrentUser();
	}, []);

	useEffect(() => {
		if (!feedbackModal.isOpen) {
			return;
		}

		const timer = setTimeout(() => {
			setFeedbackModal({
				isOpen: false,
				message: '',
				type: 'success'
			});
		}, 1800);

		return () => {
			clearTimeout(timer);
		};
	}, [feedbackModal.isOpen, feedbackModal.message]);

	const evaluateHeaderMode = useCallback(() => {
		const headerElement = headerRef.current;
		const measureElement = headerMeasureRef.current;

		if (!headerElement || !measureElement) {
			return;
		}

		const availableWidth = headerElement.clientWidth;
		const requiredWidth = Math.ceil(measureElement.scrollWidth);
		const shouldUseCompact = requiredWidth > availableWidth;

		setIsCompactHeader((previousState) => {
			if (previousState === shouldUseCompact) {
				return previousState;
			}
			return shouldUseCompact;
		});

		if (!shouldUseCompact) {
			setIsMenuActive(false);
		}
	}, []);

	useEffect(() => {
		let frameId = null;
		const scheduleHeaderCheck = () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			frameId = requestAnimationFrame(() => {
				evaluateHeaderMode();
			});
		};

		scheduleHeaderCheck();
		window.addEventListener('resize', scheduleHeaderCheck);

		return () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			window.removeEventListener('resize', scheduleHeaderCheck);
		};
	}, [evaluateHeaderMode]);

	useLayoutEffect(() => {
		evaluateHeaderMode();
	}, [evaluateHeaderMode, authUser?.username]);

	useEffect(() => {
		let cancelled = false;
		if (!document.fonts?.ready) {
			return () => {
				cancelled = true;
			};
		}

		document.fonts.ready.then(() => {
			if (!cancelled) {
				evaluateHeaderMode();
			}
		});

		return () => {
			cancelled = true;
		};
	}, [evaluateHeaderMode]);

	// Modals useEffect
	useEffect(() => {
		// Global listener closes both popups when user clicks outside both modals
		const handleOutsideClick = (event) => {
			const clickedOutsideGenres = genresRef.current && !genresRef.current.contains(event.target);
			const clickedOutsidePlatforms = platformsRef.current && !platformsRef.current.contains(event.target);
			const clickedOutsideNav = navRef.current && !navRef.current.contains(event.target);
			const clickedOutsideSearch = searchRef.current && !searchRef.current.contains(event.target);
			const clickedOutsideLogin = loginRef.current && !loginRef.current.contains(event.target);
			const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(event.target);

			if (clickedOutsideGenres && clickedOutsidePlatforms) {
				setIsGenresActive(false);
				setIsPlatformsActive(false);
			}

			if (clickedOutsideNav && clickedOutsideMenu) {
				setIsMenuActive(false);
			}

			if (clickedOutsideSearch) {
				setIsSuggestionsOpen(false);
			}

			if (clickedOutsideLogin) {
				setIsLoginActive(false);
				resetLoginForm();
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	// Debouncing -> Instead of making a fetch for every character the user writes, it waits 300ms since user stopped for 300 ms
	useEffect(() => {
		const normalizedQuery = searchGame.trim();

		if (normalizedQuery.length < 2) {
			setSuggestions([]);
			setIsSearching(false);
			return;
		}

		let isCancelled = false;
		setIsSearching(true);

		// Debounce -> suggestions
		const timer = setTimeout(async () => {
			try {
				const gamesFound = await searchGames(normalizedQuery);
				if (!isCancelled) {
					setSuggestions(gamesFound || []);
				}
			} catch {
				if (!isCancelled) {
					setSuggestions([]);
				}
			} finally {
				if (!isCancelled) {
					setIsSearching(false);
				}
			}
		}, 300);

		return () => {
			isCancelled = true;
			clearTimeout(timer);
		};
	}, [searchGame]);

	//Handles and helpers
	const toggleGenres = () => {
		// Open/close Genres and always close Platforms to keep one popup at a time
		setIsGenresActive((previousState) => !previousState); // If it was false, it becomes true
		setIsPlatformsActive(false);
		setIsLoginActive(false);
	};

	const togglePlatforms = () => {
		setIsPlatformsActive((previousState) => !previousState);
		setIsGenresActive(false);
		setIsLoginActive(false);
	};

	const toggleLogin = () => {
		setIsLoginActive((previousState) => !previousState);
		setIsGenresActive(false);
		setIsPlatformsActive(false);
		setIsMenuActive(false);
		setLoginError('');
	};

	const toggleMenu = () => {
		setIsMenuActive((previousState) => !previousState);
		setIsGenresActive(false);
		setIsPlatformsActive(false);
		setIsLoginActive(false);
		setIsSuggestionsOpen(false);
	};

	const resetLoginForm = () => {
		setLoginIdentifier('');
		setLoginPassword('');
		setLoginError('');
	};

	const handleLoginSubmit = async (event) => {
		event.preventDefault(); // Evade to recharge the entire client and only makes the fetch of login -> Speed
		setLoginError('');
		// We are going to use it twice, so its better just one trim
		const identifier = loginIdentifier.trim();
		const password = loginPassword.trim()

		if (!identifier || !password) {
			setLoginError('Email/username and password are\u00A0required') //\u00A0 We cant separate are and required (UX/UI) -> now 
			return;
		};
		setIsSubmittingLogin(true);

		try {
			const response = await loginUser(identifier, password);
			if (!response?.token || !response?.refreshToken) {  /* ?. = exists? */
				setLoginError('Invalid server response');
				return;
			}
			localStorage.setItem('gamefy_access_token', response.token);
			localStorage.setItem('gamefy_refresh_token', response.refreshToken);
			window.location.reload();
			return;

		} catch (error) {
			localStorage.removeItem('gamefy_access_token');
			localStorage.removeItem('gamefy_refresh_token');
			setAuthUser(null);
			setIsAuthReady(true);
			setLoginError(error?.message || 'Login failed'); // Always secure two possible errors in case back fails
		} finally {
			setIsSubmittingLogin(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('gamefy_access_token');
		localStorage.removeItem('gamefy_refresh_token');
		window.location.assign('/');
	};

	const syncAuthFavorites = (gameId, shouldBeFavorite) => {
		setAuthUser((previousUser) => {
			if (!previousUser) {
				return previousUser;
			}

			const currentFavorites = Array.isArray(previousUser.favorites) ? previousUser.favorites : [];
			const normalizedGameId = Number(gameId);
			const safeGameId = Number.isNaN(normalizedGameId) ? gameId : normalizedGameId;

			let nextFavorites = currentFavorites;

			if (shouldBeFavorite) {
				const alreadyExists = currentFavorites.some((id) => String(id) === String(safeGameId));
				nextFavorites = alreadyExists ? currentFavorites : [...currentFavorites, safeGameId];
			} else {
				nextFavorites = currentFavorites.filter((id) => String(id) !== String(safeGameId));
			}

			return {
				...previousUser,
				favorites: nextFavorites
			};
		});
	};

	const syncAuthProfile = (updatedUserData) => {
		setAuthUser((previousUser) => {
			if (!previousUser) {
				return previousUser;
			}

			return {
				...previousUser,
				...updatedUserData
			};
		});
	};

	const showFeedback = (message, type = 'success') => {
		setFeedbackModal({
			isOpen: true,
			message,
			type
		});
	};

	const handleSelectGenre = (item) => {
		// Navigate and pass selected name so Catalog page can render a dynamic title
		navigate(`/genre/${item.genreId}`, {
			state: {
				selectedName: item.name
			}
		});
		setIsGenresActive(false);
		setIsMenuActive(false);
	};

	const handleSelectPlatform = (item) => {
		navigate(`/platform/${item.platformId}`, {
			state: {
				selectedName: item.name
			}
		});
		setIsPlatformsActive(false);
		setIsMenuActive(false);
	};

	const handleSearchGame = (event) => {
		const value = event.target.value;
		setSearchGame(value);
		// No care spaces, min length 2 characters for start suggestions
		if (value.trim().length < 2) {
			setSuggestions([]);
			setIsSuggestionsOpen(false);
			setIsSearching(false);
			return;
		}

		setIsSuggestionsOpen(true);
	};

	const handleSearchKeyDown = (event) => {
		if (event.key !== 'Enter') {
			return;
		}

		event.preventDefault();
		if (suggestions.length) {
			handleSelectSuggestion(suggestions[0]);
		}
	};

	const handleSelectSuggestion = (game) => {
		if (!game || !game.id) {
			return;
		}

		setIsSuggestionsOpen(false);
		setSearchGame('');
		setSuggestions([]);
		setIsMenuActive(false);

		navigate(`/games/${game.id}`);
	};

	return (
		<div className={`app-layout ${isCompactHeader ? 'app-layout--compact' : ''}`}>
			<header ref={headerRef} className="app-layout__header">
				<div ref={headerMeasureRef} className="app-layout__headerMeasure" aria-hidden="true">
					<div className="app-layout__headerMeasureRow">
						<div className="app-layout__headerMeasureBrandSlot">
							<img className="app-layout__headerMeasureLogo" src={logoHorizontal} alt="" />
						</div>

						<div className="app-layout__headerMeasureNav">
							<span className="app-layout__headerMeasureChip">Home</span>
							<span className="app-layout__headerMeasureChip">Genres</span>
							<span className="app-layout__headerMeasureChip">Platforms</span>
							{authUser ? <span className="app-layout__headerMeasureChip">Favorites</span> : null}
						</div>

						<div className="app-layout__headerMeasureAuth">
							<span className="app-layout__headerMeasureSearch">Search games...</span>
							<span className="app-layout__headerMeasureChip">{authUser ? 'Logout' : 'Login'}</span>
							{authUser ? (
								<span className="app-layout__headerMeasureUsername">
									{authUser.username}
								</span>
							) : null}
						</div>
					</div>
				</div>

				<Link to="/" className="header__brand">
					<img
						className="header__brandLogo"
						src={isCompactHeader ? logoVertical : logoHorizontal}
						alt="GameFy"
					/>
				</Link>

				<div ref={navRef} className={`app-layout__nav ${isMenuActive ? 'app-layout__nav--mobileOpen' : ''}`}>
					<div className="app-layout__catalog">
						<button
							type="button"
							className="app-layout__catalogButton"
							onClick={() => {
								navigate('/');
								setIsMenuActive(false);
							}}
						>
							Home
						</button>
					</div>

					<div ref={genresRef} className="app-layout__catalog">
						<button type="button" className="app-layout__catalogButton" onClick={toggleGenres}>Genres</button>

						{isGenresActive ? (
							<div className="app-layout__popup app-layout__popup--genres">
								{!genresList.length ? (
									<p>No options found.</p>
								) : (
									genresList.map((item) => (
										<button
											key={item.genreId}
											type="button"
											className="app-layout__popupItem"
											onClick={() => handleSelectGenre(item)}
										>
											{item.name}
										</button>
									))
								)}
							</div>
						) : null}
					</div>

					<div ref={platformsRef} className="app-layout__catalog">
						<button type="button" className="app-layout__catalogButton" onClick={togglePlatforms}>Platforms</button>

						{isPlatformsActive ? (
							<div className="app-layout__popup app-layout__popup--platforms">
								{!platformsList.length ? (
									<p>No options found.</p>
								) : (
									platformsList.map((item) => (
										<button
											key={item.platformId}
											type="button"
											className="app-layout__popupItem"
											onClick={() => handleSelectPlatform(item)}
										>
											{item.name}
										</button>
									))
								)}
							</div>
						) : null}
					</div>

					{authUser ? (
						<div className="app-layout__catalog">
							<button
								type="button"
								className="app-layout__catalogButton"
								onClick={() => {
									navigate('/favorites');
									setIsMenuActive(false);
								}}
							>
								Favorites
							</button>
						</div>
					) : null}

					{authUser ? (
						<div className="app-layout__catalog app-layout__catalog--mobileOnly">
							<button
								type="button"
								className="app-layout__catalogButton app-layout__catalogButton--danger"
								onClick={() => {
									setIsMenuActive(false);
									handleLogout();
								}}
							>
								Logout
							</button>
						</div>
					) : null}
				</div>

				<div className="app-layout__authArea">
					<div ref={searchRef} className="app-layout__search">
						<div className="app-layout__searchControl">
							<input
								ref={searchInputRef}
								type="text"
								className="app-layout__searchInput"
								placeholder="Search games..."
								value={searchGame}
								onChange={handleSearchGame}
								onKeyDown={handleSearchKeyDown}
								onFocus={() => {
									if (searchGame.trim().length >= 2) {
										setIsSuggestionsOpen(true);
									}
								}}
							/>
							<button
								type="button"
								className="app-layout__searchIconButton"
								aria-label="Open search suggestions"
								onClick={() => {
									searchInputRef.current?.focus();
									if (searchGame.trim().length >= 2) {
										setIsSuggestionsOpen(true);
									}
								}}
							>
								<img src={searchIcon} alt="" className="app-layout__searchIcon" />
							</button>
						</div>

						{isSuggestionsOpen ? (
							<div className="app-layout__searchSuggestions">
								{isSearching ? (
									<p className="app-layout__searchState">Searching...</p>
								) : suggestions.length ? (
									suggestions.slice(0, 8).map((game) => (
										<button
											key={game.id}
											type="button"
											className="app-layout__searchSuggestionItem"
											onClick={() => handleSelectSuggestion(game)}
										>
											{game.name}
										</button>
									))
								) : (
									<p className="app-layout__searchState">No games found</p>
								)}
							</div>
						) : null}
					</div>
					<div ref={loginRef} className="app-layout__catalog">
						<button
							type="button"
							className={`app-layout__login ${authUser ? 'app-layout__login--hideOnCompact' : ''}`}
							onClick={authUser ? handleLogout : toggleLogin}
						>
							{authUser ? 'Logout' : 'Login'}
						</button>
						{authUser ? (
							<Link
								to="/dashboard"
								className="app-layout__authUsername app-layout__authUsernameLink"
								onClick={() => {
									setIsMenuActive(false);
								}}
							>
								{authUser.username}
							</Link>
						) : null}

						{isLoginActive && !authUser ? (
							<div className="app-layout__popup app-layout__popup--login">
								<form className="app-layout__loginForm" onSubmit={handleLoginSubmit}>
									<label htmlFor="loginIdentifier" className="app-layout__loginLabel">
										Email or username
									</label>
									<input
										id="loginIdentifier"
										type="text"
										className="app-layout__loginInput"
										value={loginIdentifier}
										onChange={(e) => setLoginIdentifier(e.target.value)}
									/>

									<label htmlFor="loginPassword" className="app-layout__loginLabel">
										Password
									</label>
									<input
										id="loginPassword"
										type="password"
										className="app-layout__loginInput"
										value={loginPassword}
										onChange={(e) => setLoginPassword(e.target.value)}
									/>

									<button type="submit" className="app-layout__loginSubmit" disabled={isSubmittingLogin}>
										Login
									</button>
									{loginError ? <p className="app-layout__loginError">{loginError}</p> : null}

									<p className="app-layout__loginLabel app-layout__loginRegisterText">
										Do not have an account? <Link to="/auth">Register here</Link>
									</p>
								</form>
							</div>
						) : null}
					</div>

					<div ref={menuRef} className="app-layout__menu">
						<button
							type="button"
							className="app-layout__menuToggle"
							onClick={toggleMenu}
							aria-label={isMenuActive ? 'Close navigation menu' : 'Open navigation menu'}
							aria-expanded={isMenuActive}
						>
							<span className="app-layout__menuToggleLine" />
							<span className="app-layout__menuToggleLine" />
							<span className="app-layout__menuToggleLine" />
						</button>
					</div>
				</div>
			</header>

			<FeedbackModal
				isOpen={feedbackModal.isOpen}
				message={feedbackModal.message}
				type={feedbackModal.type}
				onClose={() => setFeedbackModal({ isOpen: false, message: '', type: 'success' })}
			/>

			<main className="app-layout__main">
				<div key={`${location.pathname}${location.search}`} className="route-transition">
					<Outlet context={{ authUser, isAuthReady, syncAuthFavorites, syncAuthProfile, showFeedback }} />
				</div>
			</main>
		</div>
	);
}
