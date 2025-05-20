const form = document.querySelector("form");
const mainContainer = document.querySelector(".main-container");
const btnforSearch = document.querySelector(".btn-for-search");
const moreDetailsContaner = document.querySelector(".more-details");
const searchInput = document.querySelector(".searchInput");
const suggestionsBox = document.getElementById("suggestions");
const searchForm = document.getElementById("searchForm");
const searchIcon = document.getElementById("searchIcon");


const API_KEY = 'd1becbefc947f6d6af137051548adf7f';
const BASE_URL = 'https://api.themoviedb.org/3';
let pageNumber = 1;
let searchTime =1
let query;
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    query=form.querySelector('input').value;
    searchTime=1;
    pageNumber=1;
    suggestionsBox.classList.remove("Active");
 searchonTmdb(query,pageNumber);

})
lodeHomePage();
function lodeHomePage(){
   getLatestMovies();
   getLatestShow();
   getLatestShowNetflix();
   getLatestShowAmazon();
   getLatestShowHotstar();
}
function createSection(titleText, containerClass) {
  const sectionWrapper = document.createElement("section");
  sectionWrapper.classList.add("movie-section");

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = titleText;

  const contentDiv = document.createElement("div");
  contentDiv.classList.add(containerClass);

  sectionWrapper.appendChild(title);
  sectionWrapper.appendChild(contentDiv);
  mainContainer.appendChild(sectionWrapper);

  return contentDiv;
}

function createMovieCard(item, type) {
  const imgcart = document.createElement('div');
  imgcart.classList.add("imgcart");

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
    : 'images/logo.png';

 imgcart.innerHTML = `
         <img 
           src="images/lodar.webp"
           data-src="${posterUrl}" 
           class="movie-img lazy-load" 
           loading="lazy"
         >
       `;
  const cartInfo = document.createElement('div');
  cartInfo.classList.add("cartInfo");

  let ratingClass = '';
  let ratingText = '';

  if (!item.vote_average || item.vote_average === 0) {
    ratingClass = 'rating-no';
    ratingText = 'N/A';
  } else if (item.vote_average >= 7) {
    ratingClass = 'rating-high';
    ratingText = item.vote_average.toFixed(1);
  } else if (item.vote_average >= 5) {
    ratingClass = 'rating-mid';
    ratingText = item.vote_average.toFixed(1);
  } else {
    ratingClass = 'rating-low';
    ratingText = item.vote_average.toFixed(1);
  }

  cartInfo.innerHTML = `
    <h4 class="${ratingClass}">
      <i class="fa-solid fa-star"></i> ${ratingText}
    </h4>
    <h4>${type === 'movie' ? item.title : item.name}</h4>
  `;

  imgcart.appendChild(cartInfo);
  scheduleLazyLoad();
    imgcart.addEventListener("click", () => {
    moreDetails(type, item.id);
  });

  return imgcart;
}

async function getLatestMovies() {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const contentDiv = createSection("Latest Movies", "latestMovies");

    data.results.forEach(item => {
      const card = createMovieCard(item, 'movie');
      contentDiv.appendChild(card);
    });

    btnforSearch.style.display = "none";
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
}

async function getLatestShow() {
  try {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const contentDiv = createSection("Latest Shows", "latestShow");

    data.results.forEach(item => {
      const card = createMovieCard(item, 'tv');
      contentDiv.appendChild(card);
    });

    btnforSearch.style.display = "none";
  } catch (error) {
    console.error("Failed to fetch shows:", error);
  }
}

async function getLatestShowNetflix() {
  try {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_networks=213`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const contentDiv = createSection("Trending on Netflix", "TrendingOnNetflix");

    data.results.forEach(item => {
      const card = createMovieCard(item, 'tv');
      contentDiv.appendChild(card);
    });

    btnforSearch.style.display = "none";
  } catch (error) {
    console.error("Failed to fetch Netflix shows:", error);
  }
}

async function getLatestShowAmazon() {
  try {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_networks=1024`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const contentDiv = createSection("Trending on Amazon Prime", "TrendingOnAmazon");

    data.results.forEach(item => {
      const card = createMovieCard(item, 'tv');
      contentDiv.appendChild(card);
    });

    btnforSearch.style.display = "none";
  } catch (error) {
    console.error("Failed to fetch Amazon shows:", error);
  }
}

async function getLatestShowHotstar() {
  try {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_networks=3919`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const contentDiv = createSection("Trending on Jio Hotstar", "TrendingOnHotstar");

    data.results.forEach(item => {
      const card = createMovieCard(item, 'tv');
      contentDiv.appendChild(card);
    });

    btnforSearch.style.display = "none";
  } catch (error) {
    console.error("Failed to fetch Hotstar shows:", error);
  }
}


const SearchResult = document.createElement('div');
SearchResult.classList.add("SearchResult");

pageNumber=1;
async function searchonTmdb(query, pageNumber) {
  const selectedType = document.getElementById("searchType").value;

  suggestionsBox.classList.remove("Active");
  searchIcon.classList.replace("fa-magnifying-glass", "fa-xmark");

  let endpoint = selectedType;
 

  const url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${pageNumber}&include_adult=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    if (searchTime == 1) {
      mainContainer.innerHTML = "";
      SearchResult.innerHTML = "";
    }
    searchTime++;

    const data = await response.json();
    let results = data.results;

  
    results.forEach(item => {
      const mediaType = item.media_type || selectedType;
      if (mediaType !== "movie" && mediaType !== "tv" && mediaType !== "person") return;

      const imgcart = document.createElement('div');
      imgcart.classList.add("imgcart");

      const imageUrl =
        mediaType === "person"
          ? (item.profile_path ? `https://image.tmdb.org/t/p/w500/${item.profile_path}` : 'images/castplaceholder.png')
          : (item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : 'images/castplaceholder.png');

      imgcart.innerHTML = `
        <img 
          src="images/lodar.webp"
          data-src="${imageUrl}" 
          class="movie-img lazy-load" 
          loading="lazy"
        >
      `;

      mainContainer.appendChild(SearchResult);
      SearchResult.appendChild(imgcart);
      scheduleLazyLoad();

      const cartInfo = document.createElement('div');
      cartInfo.classList.add("cartInfo");
     
      const title = mediaType === "person" ? item.name : (item.title || item.name);
      const vote = mediaType === "person" ? null : item.vote_average;

      let ratingClass = '';
      let ratingText = '';

      if (vote === null || vote === 0 || mediaType === "person") {
        ratingClass = 'rating-no';
        ratingText = 'N/A';
      } else if (vote >= 7) {
        ratingClass = 'rating-high';
        ratingText = vote.toFixed(1);
      } else if (vote >= 5) {
        ratingClass = 'rating-mid';
        ratingText = vote.toFixed(1);
      } else {
        ratingClass = 'rating-low';
        ratingText = vote.toFixed(1);
      }

      cartInfo.innerHTML = `
        <h4 class="${ratingClass}">
          <i class="fa-solid fa-star"></i> ${ratingText}
        </h4>
        <h4>${title}</h4>
      `;
      imgcart.append(cartInfo);
      if(mediaType != "person"){
      imgcart.addEventListener("click", () => {
        moreDetails(mediaType, item.id);
      });
      }
      else
      imgcart.addEventListener("click", () => {
        fetchPersonDetails(item.id,item);
            });
   
      
    
      
      
    });

    if (data.page < data.total_pages) {
      btnforSearch.style.display = "flex";
    } else {
      btnforSearch.style.display = "none";
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

document.getElementById("searchType").addEventListener("change", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchTime = 1;
    searchonTmdb(query, 1);
  }
});

 function loadMoreREsultSearch() {
    searchonTmdb(query,++pageNumber)
 }


  
 // lodeMore 
 const loadMoreBtn = document.getElementById('loadMoreBtn');
 const btnText = loadMoreBtn.querySelector('.btn-text');
 const spinner = loadMoreBtn.querySelector('.spinner');
 
 loadMoreBtn.addEventListener('click', async () => {
   btnText.textContent = "Loading...";
   spinner.classList.remove('hidden');
 
   // Simulate async content loading
 
   btnText.textContent = "Load More";
   spinner.classList.add('hidden');
 }); 

 async function moreDetails(category, id) {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    searchInput.value = "";
  suggestionsBox.innerHTML = "";
  searchIcon.classList.replace("fa-xmark", "fa-magnifying-glass");
  suggestionsBox.classList.remove("Active");
    moreDetailsContaner.innerHTML = '';
    mainContainer.style.display = "none";
  
    await new Promise(res => setTimeout(res, 50));
  

      const detailRes = await fetch(`https://api.themoviedb.org/3/${category}/${id}?api_key=${API_KEY}`);
      const data = await detailRes.json();


    const posterSize = window.innerWidth <= 580 ? 'w300' : 'w780';
    const posterPath = data.poster_path
      ? `https://image.tmdb.org/t/p/${posterSize}${data.poster_path}`
      : 'images/logo.png';

    moreDetailsContaner.style.background = `linear-gradient(rgba(0, 0, 0, .85), rgba(0, 0, 0, 1)), url("${posterPath}") center/cover no-repeat`;
    moreDetailsContaner.innerHTML = '';
    document.querySelector(".personDetails").style.transform = "scale(0)";

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'close-btn';
    closeBtn.addEventListener('click', () => {
      mainContainer.style.display = "block";
      moreDetailsContaner.style.transform = "scale(0)";
      moreDetailsContaner.innerHTML = '';
    });
    moreDetailsContaner.appendChild(closeBtn);

    // Fetch trailer
    const videoRes = await fetch(`https://api.themoviedb.org/3/${category}/${id}/videos?api_key=${API_KEY}`);
    const videoData = await videoRes.json();
    const youtubeTrailer = videoData.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');

    const wrapper = document.createElement('div');
    wrapper.className = 'details-wrapper';

    // Trailer section
    const trailerWrapper = document.createElement('div');
    trailerWrapper.className = 'video-wrapper';
    if (youtubeTrailer) {
      trailerWrapper.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${youtubeTrailer.key}?autoplay=0&mute=0&rel=0" 
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>`;
    } else {
      trailerWrapper.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w780/${data.backdrop_path || data.poster_path}" alt="Trailer not available" class="fallback-image">
        <p class="trailer-notice">Trailer not available.</p>`;
    }

    wrapper.appendChild(trailerWrapper);

    // Details content
    const content = document.createElement('div');
    content.className = 'details-content';
    content.innerHTML = `
      <h2 class="movie-title">${data.name || data.title}</h2>
      <p class="movie-release">Release: ${data.release_date || data.first_air_date || 'N/A'}</p>
      <p class="movie-overview">${data.overview || 'No overview available.'}</p>`;
    wrapper.appendChild(content);

    moreDetailsContaner.appendChild(wrapper);
    moreDetailsContaner.style.transform = "scale(1)";
    mainContainer.style.display = "none";

    // Fetch cast
    const castRes = await fetch(`https://api.themoviedb.org/3/${category}/${id}/credits?api_key=${API_KEY}`);
    const castData = await castRes.json();

    const castSection = document.createElement('div');
    castSection.className = 'cast-section';
    castSection.innerHTML = `<h3>Cast</h3>`;

    const castGrid = document.createElement('div');
    castGrid.className = 'cast-grid';

    if (castData.cast?.length > 0) {
      castData.cast.slice(0, 12).forEach(actor => {
        const actorCard = document.createElement('div');
        actorCard.className = 'actor-card';

        actorCard.innerHTML = `
          <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path : 'images/castplaceholder.png'}" alt="${actor.name}">
          <p><i>${actor.name}</i></p>
          <p>${actor.character}</p>`;

        actorCard.addEventListener("click", () => {
          fetchPersonDetails(actor.id, actor);
        });

        castGrid.appendChild(actorCard);
      });
    } else {
      castGrid.innerHTML = `<p class="no-cast">No cast information available.</p>`;
    }

    castSection.appendChild(castGrid);
    moreDetailsContaner.appendChild(castSection);

    // Handle TV seasons
    if (data.seasons !== undefined) {
      const seasons = data.seasons.filter(s => s.season_number !== 0);
      const seasonTabs = document.createElement('div');
      seasonTabs.className = 'season-tabs';

      const episodeContainer = document.createElement('div');
      episodeContainer.className = 'episodes-container';

      seasons.forEach(season => {
        const btn = document.createElement('button');
        btn.textContent = `S${season.season_number.toString().padStart(2, '0')}`;
        btn.className = 'season-btn';

        btn.addEventListener('click', () => {
          document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadSeason(season.season_number);
        });

        seasonTabs.appendChild(btn);
      });

      moreDetailsContaner.appendChild(seasonTabs);
      moreDetailsContaner.appendChild(episodeContainer);

      const latestSeason = seasons[seasons.length - 1];
      await loadSeason(latestSeason.season_number);

      async function loadSeason(seasonNumber) {
        const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`);
        const seasonData = await seasonRes.json();

        episodeContainer.innerHTML = `
          <h3 class="season-header">Season ${seasonNumber} Overview</h3>
          <p>${seasonData.overview || 'No season overview available.'}</p>`;

        const episodes = seasonData.episodes;
        const limitedEpisodes = episodes.slice(0, 3);
        const remainingEpisodes = episodes.slice(3);

        const episodeList = document.createElement('div');
        episodeList.className = 'episode-list';

        limitedEpisodes.forEach(ep => {
          const epCard = createEpisodeCard(ep);
          episodeList.appendChild(epCard);
        });

        const moreList = document.createElement('div');
        moreList.className = 'more-episodes';
        moreList.style.display = 'none';

        remainingEpisodes.forEach(ep => {
          const epCard = createEpisodeCard(ep);
          moreList.appendChild(epCard);
        });

        episodeContainer.appendChild(episodeList);
        episodeContainer.appendChild(moreList);

        if (remainingEpisodes.length > 0) {
          const toggleBtn = document.createElement('button');
          toggleBtn.textContent = 'Show All Episodes';
          toggleBtn.className = 'show-more-btn';

          let isExpanded = false;

          toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            moreList.style.display = isExpanded ? 'block' : 'none';
            toggleBtn.textContent = isExpanded ? 'Show Less Episodes' : 'Show All Episodes';
          });

          episodeContainer.appendChild(toggleBtn);
        }
      }
    }

    // Fetch related movies/shows
    if (data.seasons !== undefined) {
      fetchRelatedMovies(data.id, "tv");
    } else {
      fetchRelatedMovies(data.id, "movie");
    }

  } catch (error) {
    console.error('Error fetching details:', error);
  }
}



function createEpisodeCard(ep) {
  const epCard = document.createElement('div');
  epCard.className = 'episode-card';
  epCard.innerHTML = `
    <strong>S${ep.season_number.toString().padStart(2, '0')}E${ep.episode_number.toString().padStart(2, '0')} - ${ep.name}</strong>
    <p><em>${new Date(ep.air_date).toLocaleDateString()}</em></p>
    <div class="episode-inner">
      ${ep.still_path ? `<img src="https://image.tmdb.org/t/p/w300${ep.still_path}" alt="Episode still" class="episode-still">` : ''}
      <div class="episode-text">
        <p>${ep.overview || 'No episode overview.'}</p>
      </div>
    </div>
  `;
  return epCard;
}
function fetchPersonDetails(personId,actor) {
  moreDetailsContaner.style.transform = "scale(0)";

  // First: Fetch biography
  fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(actorDetails => {
      const bio = shortenBio(actorDetails.biography);
       console.log(personId,actor);
      // Second: Fetch recent credits
      fetch(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {

          const personDetails = document.querySelector(".personDetails");
          personDetails.innerHTML = ""; // Clear previous data
          personDetails.style.transform = "scale(1)";

          // Close button
          const closeBtn = document.createElement('button');
          closeBtn.innerHTML = '&times;';
          closeBtn.classList.add("close-btn");
          closeBtn.addEventListener('click', () => {
            moreDetailsContaner.style.transform = "scale(1)";
            personDetails.innerHTML = "";
            personDetails.style.transform = "scale(0)";
          });
          personDetails.appendChild(closeBtn);

          // Profile Section with Bio
          const ActorProfilePictor = document.createElement('div');
          ActorProfilePictor.classList.add("ActorProfilePictor");
          ActorProfilePictor.innerHTML = `
            <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path : 'images/castplaceholder.png'}" alt="${actor.name}">
            <h2>${actor.name}</h2>
            <p style="max-width: 500px; margin: auto;">${bio}</p>
          `;
          personDetails.appendChild(ActorProfilePictor);
          const lable = document.createElement("h3");
          lable.innerText="Known For";
          personDetails.appendChild(lable);
          // Recent Works Grid
  
          const actorInfoContainer = document.createElement('div');
          actorInfoContainer.classList.add("actorInfoContainer");
          
           
          const sortedWorks = data.cast
            .sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date))
            .slice(0, ); // Recent 6 works

          sortedWorks.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add("movieCard");
            card.innerHTML = `
              <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : 'images/logo.png'}" alt="${movie.title || movie.name}">
              <p><strong>${movie.title || movie.name}</strong></p>
              <p style="font-size: 0.9em; color: gray;">as ${movie.character || 'N/A'}</p>
            `;
            actorInfoContainer.appendChild(card);
            card.addEventListener("click", () => {
              moreDetails(movie.media_type,movie.id);
            });
          });

          personDetails.appendChild(actorInfoContainer);
        });
    });
}

// Helper: Trim bio to 2–3 sentences
function shortenBio(bio, sentenceCount = 2) {
  if (!bio) return "Biography not available.";
  const sentences = bio.split('.').filter(Boolean);
  return sentences.slice(0, sentenceCount).join('. ') + (sentences.length > sentenceCount ? '...' : '.');
}


function fetchRelatedMovies(movieId, type) {

  const endpoint = type === "movie"
    ? `movie/${movieId}/similar`
    : `tv/${movieId}/similar`;

  fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const relatedContainer = document.createElement('div');
      relatedContainer.classList.add("relatedMovies");

      const label = document.createElement("h3");
      label.innerText = "You May Also Like";
      moreDetailsContaner.appendChild(label);

      if (data.results.length === 0) {
        relatedContainer.innerHTML = `<p class="no-cast">Not available.</p>`;
        moreDetailsContaner.appendChild(relatedContainer);
        return;
      }

      data.results.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movieCard");

        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : 'images/logo.png';

        movieCard.innerHTML = `
          <img 
            src="images/lodar.webp"
            data-src="${posterUrl}" 
            class="movie-img lazy-load" 
            loading="lazy"
          >
        `;

        const cartInfo = document.createElement('div');
        cartInfo.classList.add("cartInfo");

        let ratingClass = '';
        let ratingText = '';

        if (!movie.vote_average || movie.vote_average === 0) {
          ratingClass = 'rating-no';
          ratingText = 'N/A';
        } else if (movie.vote_average >= 7) {
          ratingClass = 'rating-high';
          ratingText = movie.vote_average.toFixed(1);
        } else if (movie.vote_average >= 5) {
          ratingClass = 'rating-mid';
          ratingText = movie.vote_average.toFixed(1);
        } else {
          ratingClass = 'rating-low';
          ratingText = movie.vote_average.toFixed(1);
        }

        cartInfo.innerHTML = `
          <h4 class="${ratingClass}">
            <i class="fa-solid fa-star"></i> ${ratingText}
          </h4>
          <h4>${type === 'movie' ? movie.title : movie.name}</h4>
        `;

        movieCard.appendChild(cartInfo);
        relatedContainer.appendChild(movieCard);

        movieCard.addEventListener("click", () => {
          moreDetailsContaner.style.transform = "scale(0)";
          moreDetailsContaner.innerHTML = "";
          mainContainer.style.display = "block";
          moreDetails(type, movie.id);
        });
      });

      moreDetailsContaner.appendChild(relatedContainer);
      scheduleLazyLoad(); // call once after all cards are added
    });
}


let lazyTimer;
function scheduleLazyLoad() {
  clearTimeout(lazyTimer);
  lazyTimer = setTimeout(replaceLazyImages, 100);
}
 // lazay 
 function replaceLazyImages() {
  const lazyImages = document.querySelectorAll('img.lazy-load');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerRef) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const realSrc = img.getAttribute('data-src');

          const tempImg = new Image();
          tempImg.src = realSrc;

          tempImg.onload = () => {
            img.src = realSrc;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
          };

          observerRef.unobserve(img);
        }
      });
    }, {
      rootMargin: "0px 0px 200px 0px", 
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      observer.observe(img);
    });

  } else {
    lazyImages.forEach(img => {
      const realSrc = img.getAttribute('data-src');
      const tempImg = new Image();
      tempImg.src = realSrc;

      tempImg.onload = () => {
        img.src = realSrc;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
    });
  }
}
let debounceTimeout;

// Get dropdown
const searchTypeSelect = document.getElementById("searchType");

// Handle Enter key: hide suggestions
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("Active");
  }
});

searchIcon.addEventListener("click", () => {
  if (searchIcon.classList.contains("fa-xmark")) {
    searchInput.value = "";
    suggestionsBox.innerHTML = "";
    searchIcon.classList.replace("fa-xmark", "fa-magnifying-glass");
     location.reload()
    searchInput.focus();
  }
});

// Handle input for suggestions and icon toggle
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  const query = searchInput.value.trim();
  const selectedType = searchTypeSelect.value;

  if (query) {
    searchIcon.classList.replace("fa-magnifying-glass", "fa-xmark");
  } else {
    searchIcon.classList.replace("fa-xmark", "fa-magnifying-glass");
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("Active");
    return;
  }

  debounceTimeout = setTimeout(async () => {
    let endpoint = selectedType;

  

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
      );
      const data = await response.json();

      let results = data.results || [];


      if (results.length === 0) {
        suggestionsBox.innerHTML = "<div class='no-results'>No results found</div>";
        suggestionsBox.classList.add("Active");
        return;
      }

      suggestionsBox.innerHTML = results
      .slice(0, 6)
      .map(item => {
        const mediaType = item.media_type || selectedType;
    
        let title, image;
        if (mediaType === "person") {
          title = item.name;
          image = item.profile_path
            ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
            : "images/castplaceholder.png";
        } else {
          title = item.title || item.name || "Untitled";
          image = item.poster_path
            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
            : "images/castplaceholder.png";

        }
    
        return `
          <div class="suggestion-item" data-id="${item.id}" data-type="${mediaType}">
            <img src="${image}" alt="${title}">
            <span>${title}</span>
          </div>
        `;
      }).join("");
    

      suggestionsBox.classList.add("Active");

    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  }, 300);
});

// Handle clicking a suggestion
suggestionsBox.addEventListener("click", (event) => {
  const item = event.target.closest(".suggestion-item");
  if (item) {
    const movieId = item.dataset.id;
    const mediaType = item.dataset.type;
    suggestionsBox.innerHTML = "";
    searchInput.value = "";
    suggestionsBox.classList.remove("Active");
    selectMovie(movieId, mediaType,item);
  }
});

// Handle form submit (search button or Enter)
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  const selectedType = searchTypeSelect.value;

  if (searchIcon.classList.contains("fa-xmark") && !query) {
    searchInput.value = "";
    suggestionsBox.innerHTML = "";
    searchIcon.classList.replace("fa-xmark", "fa-magnifying-glass");
    return;
  }

  if (query) {
    searchTime = 1;
    await searchonTmdb(query, 1);  // use updated function
  }
});

// Handle selection of a suggestion
function selectMovie(id, mediaType,data) {
 
  if(mediaType != "person"){
    moreDetails(mediaType, id);
  }
    else
   fetchPersonDetails(id,data);
    
}