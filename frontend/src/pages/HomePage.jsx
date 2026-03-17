import TrendingSection from "../components/home/TrendingSection.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import NewReleasesSection from "../components/home/NewReleasesSection.jsx";
import TopRatedSection from "../components/home/TopRatedSection.jsx";
import { useHomeData } from "../hooks/useHomeData.js";
import DiscoverSection from "../components/home/DiscoverSection.jsx";
import IncomingSection from "../components/home/IncomingSection.jsx";
import Spinner from "../components/ui/spinner/Spinner.jsx";

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

	return (
		isLoading ? (
			<Spinner />
		) : errorMessage ? (
			<p>Error: {errorMessage}</p>
		) : (
			<div>
				<HeroSection games={trendingGames} />
				<TrendingSection games={trendingGames} />
				<IncomingSection games={incomingGames} />
				<DiscoverSection games={discoverGames} />
				<NewReleasesSection games={newGames} />
				<TopRatedSection games={topRatedGames} />
			</div>
		)
	)
}

export default HomePage;
