const ScreenshotsGallery = ({ screenshotsUrls, onImageClick }) => {
	if (!Array.isArray(screenshotsUrls) || screenshotsUrls.length === 0) {
		return null;
	}

	return (
		<section className="gd-section">
			<h2 className="gd-section__title">Screenshots Gallery</h2>

			<div className="gd-shots">
				{screenshotsUrls.slice(0, 6).map((src, index) => {
					return (
						<div
							className="gd-shots__item"
							key={src}
							onClick={() => onImageClick?.(index)}
						>
							<img src={src} alt="Screenshot" />
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default ScreenshotsGallery;
