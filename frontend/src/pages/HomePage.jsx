import TrendingSection from "../components/home/TrendingSection";
import HeroSection from "../components/home/HeroSection";
import NewReleasesSection from "../components/home/NewReleasesSection";
import TopRatedSection from "../components/home/TopRatedSection";
import { useHomeData } from "../hooks/useHomeData";
import DiscoverSection from "../components/home/DiscoverSection";
import IncomingSection from "../components/home/IncomingSection";
import Spinner from "../components/ui/spinner/Spinner";

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
