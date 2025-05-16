const form = document.querySelector("form");
const mainContainer = document.querySelector(".main-container");
const API_KEY = 'd1becbefc947f6d6af137051548adf7f';
const BASE_URL = 'https://api.themoviedb.org/3';
let pageNumber = 1;

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let query=form.querySelector('input').value;
    searchonTmdb(query);

})
getLatestMovies(pageNumber);

async function getLatestMovies(pageNumber) {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${pageNumber}
`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
   
    const data = await response.json();
    const latestMovies = document.createElement('div');
    latestMovies.classList.add("latestMovies");
    mainContainer.appendChild(latestMovies);
    data.results.forEach(item => {
       const imgcart = document.createElement('div');
       imgcart.classList.add("imgcart");
       const posterUrl = item.poster_path
       ? `https://image.tmdb.org/t/p/w1280/${item.poster_path}`
       : 'images/logo.png';
       imgcart.innerHTML=`<img src=${posterUrl} loading="lazy" onload="this.classList.add('loaded')" class="movie-img">`
       latestMovies.appendChild(imgcart);
       const cartInfo = document.createElement('div');

      let ratingClass = '';
      let ratingText = '';

      if (item.vote_average === null || item.vote_average === 0) {
      ratingClass = 'rating-no';    
      ratingText = 'N/A';          
      }  
       else if (item.vote_average >= 7) {
       ratingClass = 'rating-high';
       ratingText = item.vote_average.toFixed(1);
      }
       else if (item.vote_average >= 5) {
        ratingClass = 'rating-mid';
        ratingText = item.vote_average.toFixed(1);
      } 
      else{
      ratingClass = 'rating-low';
      ratingText = item.vote_average.toFixed(1);
      }

        cartInfo.innerHTML = `
        <h4 class="${ratingClass}">
        <i class="fa-solid fa-star"></i> ${ratingText}</h4>
        <h4>${item.title}
        `;
       cartInfo.classList.add("cartInfo");
       imgcart.append(cartInfo);
    });
   
  
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
}

function loadMoreREsult(){
  getLatestMovies(++pageNumber);
}

const SearchResult = document.createElement('div');
SearchResult.classList.add("SearchResult");
async function searchonTmdb(query) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
        mainContainer.innerHTML="";
        SearchResult.innerHTML="";
        const data = await response.json();
        data.results.forEach(item => {
        if (item.media_type === 'person') return
  
        const imgcart = document.createElement('div');
        imgcart.classList.add("imgcart");
  
        const posterUrl = item.poster_path
          ? `https://image.tmdb.org/t/p/w1280/${item.poster_path}`
          : 'images/logo.png';
        
         mainContainer.appendChild(SearchResult);
        imgcart.innerHTML = `<img src="${posterUrl}" alt="${item.title || item.name}">`;
        SearchResult.appendChild(imgcart);
  
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
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

