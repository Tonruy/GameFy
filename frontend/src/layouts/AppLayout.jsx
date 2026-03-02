import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logoHorizontal from '../assets/logo horizontal.png';
import searchIcon from '../assets/search.svg';
import { getGenres, getPlatforms } from '../api/catalogApi';
import { searchGames } from '../api/gamesApi';
import './AppLayout.css';

// Layout for diferent pages
// Header -> common for the pages
// Main/Outlet -> space where React renders the page

export default function AppLayout() {
	const navigate = useNavigate();
	// Refs to access popup containers in the real DOM for outside-click detection -> click outside modals -> close them
	const genresRef = useRef(null);
	const platformsRef = useRef(null);
	const searchRef = useRef(null);
	const searchInputRef = useRef(null);
	// Two different modals
	const [isGenresActive, setIsGenresActive] = useState(false);
	const [isPlatformsActive, setIsPlatformsActive] = useState(false);
	// Catalog lists are preloaded once to avoid loading state on every click
	const [genresList, setGenresList] = useState([]);
	const [platformsList, setPlatformsList] = useState([]);
	// Search states:
	const [searchGame, setSearchGame] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

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
			} catch (error) {
				setGenresList([]);
				setPlatformsList([]);
			}
		};

		preloadCatalog();
	}, []);

	// Modals useEffect
	useEffect(() => {
		// Global listener closes both popups when user clicks outside both modals
		const handleOutsideClick = (event) => {
			const clickedOutsideGenres = genresRef.current && !genresRef.current.contains(event.target);
			const clickedOutsidePlatforms = platformsRef.current && !platformsRef.current.contains(event.target);
			const clickedOutsideSearch = searchRef.current && !searchRef.current.contains(event.target);

			if (clickedOutsideGenres && clickedOutsidePlatforms) {
				setIsGenresActive(false);
				setIsPlatformsActive(false);
			}

			if (clickedOutsideSearch) {
				setIsSuggestionsOpen(false);
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
			} catch (error) {
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

	const toggleGenres = () => {
		// Open/close Genres and always close Platforms to keep one popup at a time
		setIsGenresActive((previousState) => !previousState);
		setIsPlatformsActive(false);
	};

	const togglePlatforms = () => {
		setIsPlatformsActive((previousState) => !previousState);
		setIsGenresActive(false);
	};

	const handleSelectGenre = (item) => {
		// Navigate and pass selected name so Catalog page can render a dynamic title
		navigate(`/genre/${item.genreId}`, {
			state: {
				selectedName: item.name
			}
		});
		setIsGenresActive(false);
	};

	const handleSelectPlatform = (item) => {
		navigate(`/platform/${item.platformId}`, {
			state: {
				selectedName: item.name
			}
		});
		setIsPlatformsActive(false);
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
		navigate(`/games/${game.id}`);
	};

	return (
		<div className="app-layout">
			<header className="app-layout__header">
				<Link to="/" className="header__brand">
					<img className="header__brandLogo" src={logoHorizontal} alt="GameFy" />
				</Link>

				<div className="app-layout__nav">
					<div className="app-layout__catalog">
						<button
							type="button"
							className="app-layout__catalogButton"
							onClick={() => navigate('/')}
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
					<Link to="/auth" className="app-layout__login">Login</Link>
				</div>
			</header>

			<main className="app-layout__main">
				<Outlet />
			</main>
		</div>
	);
}
