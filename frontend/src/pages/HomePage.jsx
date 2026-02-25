import TrendingSection from "../components/home/TrendingSection";
import HeroSection from "../components/home/HeroSection";
import NewReleasesSection from "../components/home/NewReleasesSection";
import TopRatedSection from "../components/home/TopRatedSection";
import { useHomeData } from "../hooks/useHomeData";
import DiscoverSection from "../components/home/DiscoverSection";
import IncomingSection from "../components/home/IncomingSection";

const HomePage = () => {

	const {
		trendingGames,
		incomingGames,
		newGames,
		topRatedGames,
		discoverGames,
		isLoading,
		errorMessage
	} = useHomeData();

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
			<IncomingSection games={incomingGames} />
			<DiscoverSection games={discoverGames} />
			<NewReleasesSection games={newGames} />
			<TopRatedSection games={topRatedGames} />
		</div>
	)
}

export default HomePage;