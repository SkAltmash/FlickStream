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

  const posterUrl = item.poster_path? `https://image.tmdb.org/t/p/w500/${item.poster_path} `: 'images/logo.png';

 imgcart.innerHTML = ` <img 
           src="images/lodar.webp"
           data-src="${posterUrl}" 
           class="movie-img lazy-load" 
           loading="lazy"
         >` ;
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

  cartInfo.innerHTML = ` <h4 class="${ratingClass}">
      <i class="fa-solid fa-star"></i> ${ratingText}
    </h4>
    <h4>${type === 'movie' ? item.title : item.name}</h4>`
  ;

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
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${pageNumber}&include_adult=false;`
  
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
  
        const posterUrl = item.poster_path ? https://image.tmdb.org/t/p/w500/${item.poster_path} : 'images/logo.png';
        
         mainContainer.appendChild(SearchResult);

         imgcart.innerHTML = `  <img 
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
      
        cartInfo.innerHTML = `  <h4 class="${ratingClass}">
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

  fetch(`https://api.themoviedb.org/3/${category}/${id}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const posterSize = window.innerWidth <= 580 ? 'w300' : 'w780';
      const posterPath = data.poster_path ?` https://image.tmdb.org/t/p/${posterSize}${data.poster_path}` : 'images/logo.png';

      moreDetailsContaner.style.background = `linear-gradient(rgba(0, 0, 0, .85), rgba(0, 0, 0, 1)), url("${posterPath}") center/cover no-repeat`;
    

      moreDetailsContaner.innerHTML = '';

      // Close Button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.className = 'close-btn';
      closeBtn.addEventListener('click', () => {
        mainContainer.style.display = "block";
        moreDetailsContaner.style.transform = "scale(0)";
        moreDetailsContaner.innerHTML = '';
      });
      moreDetailsContaner.appendChild(closeBtn);
    
      const script = document.createElement('script');

  

      // Fetch trailer
      fetch(`https://api.themoviedb.org/3/${category}/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {
          const youtubeTrailer = videoData.results.find(
            vid => vid.site === 'YouTube' && vid.type === 'Trailer'
          );

          const wrapper = document.createElement('div');
          wrapper.className = 'details-wrapper';

          if (youtubeTrailer) {
            const trailerContainer = document.createElement('div');
            trailerContainer.className = 'video-wrapper';
            trailerContainer.innerHTML = ` <iframe 
                src="https://www.youtube.com/embed/${youtubeTrailer.key}?autoplay=1&mute=0&rel=0" 
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
              ></iframe>`;
            wrapper.appendChild(trailerContainer);
          } else {
            const fallbackImg = document.createElement('img');
            fallbackImg.src = `https://image.tmdb.org/t/p/w780/${data.backdrop_path || data.poster_path}`;
            fallbackImg.alt = 'Trailer not available';
            fallbackImg.className = 'fallback-image';
                 
            const notice = document.createElement('p');
            notice.textContent = "Trailer not available.";
            notice.className = 'trailer-notice';

            wrapper.appendChild(fallbackImg);
            wrapper.appendChild(notice);
          }
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

        });
    })
    
    .catch(error => console.error('Error fetching details:', error));
}