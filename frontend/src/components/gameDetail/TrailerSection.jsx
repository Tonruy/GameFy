const TrailerSection = ({ videoIds }) => {
	const hasVideo = Array.isArray(videoIds) && videoIds.length > 0;

	if (!hasVideo) {
		return null;
	}

	const youtubeId = videoIds[0];

	return (
		<section className="gd-trailer gd-trailer--raised">
			<div className="gd-trailer__label">Official Trailer</div>

			<div className="gd-trailer__frame">
				<iframe
					src={`https://www.youtube.com/embed/${youtubeId}`}
					title="Official Trailer"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			</div>
		</section>
	);
};

export default TrailerSection;
