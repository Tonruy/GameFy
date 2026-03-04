// This util transform the data from IGDB in a clean object for using it at frontend -> DRY
// If we dont check parameters, the query gets bug so we confirm everything exits
// 3 functions for different responsabilities :
//	- List View
//	- Detail View
// 	- Base data (common data for both views)


// Image from IGDB: we need to take off "//" from the url it gives as response
const buildIgdbImgUrl = (imagePath) => {
	if(!imagePath) {
		return null;
	}

	if (imagePath.startsWith('//')) {
		return 'https:'+imagePath;
	}
	return imagePath; //Without // at starts
}

// Checking if the parameter exists before getting it because sometimes some games don't; cover/rating/total_rating_count. BASE GAME / list view
const mappedGame = (igdbGame) => {
  let coverUrl = null;
  // Double check. First just cover, in case it exists we can get url. If we dont, it gives error (undefined) and sometimes there is not cover in the object (Object inside an object)
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

	// We need to confirm is an array because if its not, it gets bugged.
  // When working with external APIs we can't be sure what the response is so is best practices to check the result (Array.isArray)
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
		//Parameters for frontend
    ...baseGame, //Copy of the base data
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
