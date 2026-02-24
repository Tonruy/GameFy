
const TrendingSection = ({ games }) => {
	// No need destructuring of props because it only recieves games
	return (
		<div>
			<h2> Trending Games</h2>
			{
				games.map((game) => {
					return (
						<div key={game.id}>
							<span> {game.name}</span>
						</div>
					)
				})
			}

		</div>
	);
};

export default TrendingSection;
