import { useEffect, useState } from "react";
import { getTrendingGames } from "../api/gamesApi";
import TrendingSection from "../components/home/trendingSection";
import HeroSection from "../components/home/HeroSection";



const HomePage = () => {

	const [trendingGames, setTrendingGames] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		const fetchTrending = async () => {
			try {
				const data = await getTrendingGames();
				setTrendingGames(data);
			} catch (error) {
				setErrorMessage(error.message);
			} finally { //UX -> Used for message "Loading..." on screen whatever the answer  is 
				setIsLoading(false);
			}
		}
		fetchTrending()
	},
		[]);

	// Early return : before rendering the page check these:
	if (isLoading) {
		return <p> Cargando...</p>
	};
	if (errorMessage) {
		return <p>Error: {errorMessage}</p>;
	}

	return (
		<div>
			<h1>HOME</h1>
			<HeroSection games={trendingGames} />
			<TrendingSection games={trendingGames} />
		</div>
	)
}

export default HomePage;