const form = document.querySelector("form");
const mainContainer = document.querySelector(".main-container");
const btnforSearch = document.querySelector(".btn-for-search");
const moreDetailsContaner = document.querySelector(".more-details");

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
  replaceLazyImages();
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
async function searchonTmdb(query,pageNumber) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${pageNumber}&include_adult=false`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
        if(searchTime==1){
        mainContainer.innerHTML="";
        SearchResult.innerHTML="";
        }
        searchTime++;
        const data = await response.json();
        data.results.forEach(item => {
        if (item.media_type === 'person') return
  
        const imgcart = document.createElement('div');
        imgcart.classList.add("imgcart");
  
        const posterUrl = item.poster_path
          ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
          : 'images/logo.png';
        
         mainContainer.appendChild(SearchResult);

         imgcart.innerHTML = `
         <img 
           src="images/lodar.webp"
           data-src="${posterUrl}" 
           class="movie-img lazy-load" 
           loading="lazy"
         >
       `;
        SearchResult.appendChild(imgcart);
        replaceLazyImages();

        const cartInfo = document.createElement('div');
        cartInfo.classList.add("cartInfo");
  
        const title = item.media_type === 'movie' ? item.title : item.name;
        const vote = item.vote_average || 'N/A';
      
        let ratingClass = '';
        let ratingText = '';
        
        if (item.vote_average === null || item.vote_average === 0) {
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
           <h4>${title}</h4>
        `;
       imgcart.append(cartInfo);

       imgcart.addEventListener("click",(e)=>{
        moreDetails(item.media_type,item.id);
       });

      });
      if(data.page<data.total_pages)
      btnforSearch.style.display="flex";
      else
      btnforSearch.style.display="none";
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
 
 function loadMoreREsultSearch() {
    searchonTmdb(query,++pageNumber)
 }
 // lazay 
 function replaceLazyImages() {
  const lazyImages = document.querySelectorAll('.lazy-load');

  lazyImages.forEach(img => {
    const realSrc = img.getAttribute('data-src');
    const tempImg = new Image();
    tempImg.src = realSrc;

    tempImg.onload = () => {
      img.src = realSrc;
      img.classList.add('loaded');
    };
  });
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

 function moreDetails(category, id) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  fetch(`https://api.themoviedb.org/3/${category}/${id}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const posterSize = window.innerWidth <= 580 ? 'w300' : 'w780';
      const posterPath = data.poster_path
        ? `https://image.tmdb.org/t/p/${posterSize}${data.poster_path}`
        : 'images/logo.png';

      moreDetailsContaner.style.background = `linear-gradient(rgba(0, 0, 0, .85), rgba(0, 0, 0, 1)), url("${posterPath}") center/cover no-repeat`;
      moreDetailsContaner.innerHTML = '';
      const personDetails = document.querySelector(".personDetails");
      personDetails.style.transform = "scale(0)";

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.className = 'close-btn';
      closeBtn.addEventListener('click', () => {
        mainContainer.style.display = "block";
        moreDetailsContaner.style.transform = "scale(0)";
        moreDetailsContaner.innerHTML = '';
      });
      moreDetailsContaner.appendChild(closeBtn);

      // Trailer fetch
      fetch(`https://api.themoviedb.org/3/${category}/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
          const youtubeTrailer = videoData.results.find(
            vid => vid.site === 'YouTube' && vid.type === 'Trailer'
          );

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
              ></iframe>
            `;
          } else {
            trailerWrapper.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w780/${data.backdrop_path || data.poster_path}" alt="Trailer not available" class="fallback-image">
              <p class="trailer-notice">Trailer not available.</p>
            `;
          }

          wrapper.appendChild(trailerWrapper);

          // Details section
          const content = document.createElement('div');
          content.className = 'details-content';
          content.innerHTML = `
            <h2 class="movie-title">${data.name || data.title}</h2>
            <p class="movie-release">Release: ${data.release_date || data.first_air_date || 'N/A'}</p>
            <p class="movie-overview">${data.overview || 'No overview available.'}</p>
          `;
          wrapper.appendChild(content);

          moreDetailsContaner.appendChild(wrapper);
          moreDetailsContaner.style.transform = "scale(1)";
          mainContainer.style.display = "none";

          // Fetch cast FIRST (above episodes)
          fetch(`https://api.themoviedb.org/3/${category}/${id}/credits?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(castData => {
              const castSection = document.createElement('div');
              castSection.className = 'cast-section';
              castSection.innerHTML = `<h3>Cast</h3>`;

              const castGrid = document.createElement('div');
              castGrid.className = 'cast-grid';

              if (castData.cast && castData.cast.length > 0) {
                castData.cast.slice(0, 12).forEach(actor => {
                  const actorCard = document.createElement('div');
                  actorCard.className = 'actor-card';

                  actorCard.innerHTML = `
                    <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path : 'images/castplaceholder.png'}" alt="${actor.name}">
                    <p><i>${actor.name}<i></p>
                    <p>${actor.character}</p>
                  `;
                  castGrid.appendChild(actorCard);
                  actorCard.addEventListener("click",(e)=>{
                    fetchPersonDetails(actor.id,actor);
                   });
                });
              }
               else {
                castGrid.innerHTML = `<p class="no-cast">No cast information available.</p>`;
              }
              castSection.appendChild(castGrid);

              moreDetailsContaner.appendChild(castSection);
            });

          // Then handle TV shows: seasons/episodes
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
            loadSeason(latestSeason.season_number);

            function loadSeason(seasonNumber) {
              fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`)
                .then(res => res.json())
                .then(seasonData => {
                  episodeContainer.innerHTML = `
                    <h3 class="season-header">Season ${seasonNumber} Overview</h3>
                    <p>${seasonData.overview || 'No season overview available.'}</p>
                  `;
            
                  const episodes = seasonData.episodes;
                  const limitedEpisodes = episodes.slice(0, 3);
                  const remainingEpisodes = episodes.slice(3);
            
                  const episodeList = document.createElement('div');
                  episodeList.className = 'episode-list';
            
                  // Add first 3 episodes
                  limitedEpisodes.forEach(ep => {
                    const epCard = createEpisodeCard(ep);
                    episodeList.appendChild(epCard);
                  });
            
                  // Hidden container for remaining episodes
                  const moreList = document.createElement('div');
                  moreList.className = 'more-episodes';
                  moreList.style.display = 'none';
            
                  remainingEpisodes.forEach(ep => {
                    const epCard = createEpisodeCard(ep);
                    moreList.appendChild(epCard);
                  });
            
                  episodeContainer.appendChild(episodeList);
                  episodeContainer.appendChild(moreList);
            
                  // Add toggle button at the bottom
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
                    
                    episodeContainer.appendChild(toggleBtn); // Add it at the end
                  }
                });
            }
            
            
          }
        });
    })
    .catch(error => console.error('Error fetching details:', error));
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
function fetchPersonDetails(personId, actor) {
  moreDetailsContaner.style.transform = "scale(0)";

  // First: Fetch biography
  fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(actorDetails => {
      const bio = shortenBio(actorDetails.biography);

      // Second: Fetch recent credits
      fetch(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          console.log(data, actor);

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
              <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : 'images/placeholder.png'}" alt="${movie.title || movie.name}">
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





