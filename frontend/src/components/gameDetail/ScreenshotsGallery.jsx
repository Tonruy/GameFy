const buildScreenshotUrl = (url) => {
	if (!url) {
		return null;
	}

	return url.replace("t_thumb", "t_720p").replace("t_screenshot_big", "t_720p");
};

const ScreenshotsGallery = ({ screenshotsUrls }) => {
	if (!Array.isArray(screenshotsUrls) || screenshotsUrls.length === 0) {
		return null;
	}

	return (
		<section className="gd-section">
			<h2 className="gd-section__title">Screenshots Gallery</h2>

			<div className="gd-shots">
				{screenshotsUrls.slice(0, 6).map((url) => {
					const src = buildScreenshotUrl(url);
					if (!src) {
						return null;
					}

					return (
						<div className="gd-shots__item" key={src}>
							<img src={src} alt="Screenshot" />
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default ScreenshotsGallery;