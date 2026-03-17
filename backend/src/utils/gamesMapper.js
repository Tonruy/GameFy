const buildIgdbImgUrl = (imagePath) => {
	if(!imagePath) {
		return null;
	}

	if (imagePath.startsWith('//')) {
		return 'https:'+imagePath;
	}
	return imagePath;
}

const mappedGame = (igdbGame) => {
  let coverUrl = null;
  if (igdbGame.cover && igdbGame.cover.url) {
    coverUrl = buildIgdbImgUrl(igdbGame.cover.url);
  }

  let rating = null;
  if (igdbGame.rating) {
    rating = igdbGame.rating;
  }

  let totalRatingCount = 0;
  if (igdbGame.total_rating_count) {
    totalRatingCount = igdbGame.total_rating_count;
  }

  let name = null;
  if (igdbGame.name) {
    name = igdbGame.name;
  }

  return {
    id: igdbGame.id,
    name: name,
    rating: rating,
    totalRatingCount: totalRatingCount,
    coverUrl: coverUrl
  };
};

const mapGameCard = (igdbGame) => {
  return mappedGame(igdbGame);
};

const mapGameDetail = (igdbGame) => {
  const baseGame = mappedGame(igdbGame);

  let summary = null;
  if (igdbGame.summary) {
    summary = igdbGame.summary;
  }

  let storyline = null;
  if (igdbGame.storyline) {
    storyline = igdbGame.storyline;
  }

  let firstReleaseDate = null;
  if (igdbGame.first_release_date) {
    firstReleaseDate = igdbGame.first_release_date;
  }

  const screenshotsUrls = [];
  const screenshots = [];
  if (igdbGame.screenshots && Array.isArray(igdbGame.screenshots)) {
    igdbGame.screenshots.forEach((screenshot) => {
      if (screenshot.url) {
        const screenshotUrl = buildIgdbImgUrl(screenshot.url);
        screenshotsUrls.push(screenshotUrl);
        screenshots.push({
          url: screenshotUrl,
          width: screenshot.width || null,
          height: screenshot.height || null,
          alphaChannel: Boolean(screenshot.alpha_channel)
        });
      }
    });
  }

  const videoIds = [];
  if (igdbGame.videos && Array.isArray(igdbGame.videos)) {
    igdbGame.videos.forEach((video) => {
      if (video.video_id) {
        videoIds.push(video.video_id);
      }
    });
  }

  const genres = [];
  if (igdbGame.genres && Array.isArray(igdbGame.genres)) {
    igdbGame.genres.forEach((genre) => {
      if (genre.name) {
        genres.push(genre.name);
      }
    });
  }

  const platforms = [];
  if (igdbGame.platforms && Array.isArray(igdbGame.platforms)) {
    igdbGame.platforms.forEach((platform) => {
      if (platform.name) {
        platforms.push(platform.name);
      }
    });
  }

  return {
    ...baseGame,
    summary: summary,
    storyline: storyline,
    firstReleaseDate: firstReleaseDate,
    screenshotsUrls: screenshotsUrls,
    screenshots: screenshots,
    videoIds: videoIds,
    genres: genres,
    platforms: platforms
  };
};

module.exports = {
  mapGameCard,
  mapGameDetail
};
