const form = document.querySelector("form");
const mainContainer = document.querySelector(".main-container");
const API_KEY = 'd1becbefc947f6d6af137051548adf7f';
const BASE_URL = 'https://api.themoviedb.org/3';
const btnForLatest = document.querySelector(".btn-for-lates");
const btnforSearch = document.querySelector(".btn-for-search");
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
       ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
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
       imgcart.addEventListener("click",(e)=>{
        moreDetails('movie',item.id);
       });
    });
    btnForLatest.style.display="flex";
    btnforSearch.style.display="none";
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
}

function loadMoreREsultLates(){
   
   getLatestMovies(++pageNumber);
}

const SearchResult = document.createElement('div');
SearchResult.classList.add("SearchResult");

pageNumber=1;
async function searchonTmdb(query,pageNumber) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=Hi&page=${pageNumber}&include_adult=false`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
        if(searchTime==1)
        mainContainer.innerHTML="";
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
       imgcart.addEventListener("click",(e)=>{
        moreDetails(item.media_type,item.id);
       });

      });
      console.log(data);
      btnForLatest.style.display="none";
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

function moreDetails(category,id){

   fetch(`https://api.themoviedb.org/3/${category}/${id}?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    console.log('TV Show:', data);
  })
  .catch(error => console.error('Error fetching TV show:', error));

}
