import { useEffect, useState } from "react";
import { getDiscoverGames, getIncomingGames, getNewGames, getTopRatedGames, getTrendingGames } from "../api/gamesApi.js";

export const useHomeData = () => {
  const [trendingGames, setTrendingGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newGames, setNewGames] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);
  const [discoverGames, setDiscoverGames] = useState([]);
  const [incomingGames, setIncomingGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [trendingData, incomingData, newGamesData, topRatedData, discoverGames] = await Promise.all([
          getTrendingGames(),
          getIncomingGames(),
          getNewGames(),
          getTopRatedGames(),
          getDiscoverGames()
        ]);

        setTrendingGames(trendingData);
        setIncomingGames(incomingData);
        setNewGames(newGamesData);
        setTopRatedGames(topRatedData);
        setDiscoverGames(discoverGames);

      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  return {
    trendingGames,
    incomingGames,
    newGames,
    topRatedGames,
    isLoading,
    errorMessage,
    discoverGames
  };
};