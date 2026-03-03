const DescriptionSection = ({ summary, storyline }) => {
	const text = summary || storyline;

	if (!text) {
		return null;
	}

	return (
		<section className="gd-section">
			<h2 className="gd-section__title">Game Description</h2>
			<p className="gd-section__text">{text}</p>
		</section>
	);
};

export default DescriptionSection;
