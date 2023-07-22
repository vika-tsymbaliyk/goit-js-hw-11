import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

const API_KEY = '38398823-58dfcc6099d652ecdba70c123';
const apiAdress = 'https://pixabay.com/api/';

//  axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchPhotoByQ(q) {
    return axios.get(`${apiAdress}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(response => {
            if (response.status !== 200) {
             throw new Error(response.statusText);
            }
            return response.data;
        })
       
};

searchForm.addEventListener("submit", findPhoto);

function findPhoto(event) {
    event.preventDefault();
    // const formData = new FormData(searchForm);
    // const searchQuery = formData.get("searchQuery");
    const { searchQuery } = event.currentTarget.elements;
    console.log("Search query:", searchQuery.value);
    fetchPhotoByQ(searchQuery.value)
        .then(data => {
            if (data.totalHits === 0) {
                Report.failure(
                'Sorry,',
                'there are no images matching your search query. Please try again.',
                'Okay',
            );
            }
                Report.success(
                'Great!',
                '',
                'Okay',
                );
            gallery.innerHTML = createMarkup(data)
        })
        .catch(error => {
            console.log(error);           
            gallery.innerHTML = ''
        }
        )
};

function createMarkup(data) {
 return data.hits.map((item) => {
    const { webformatURL, tags, likes, views, comments, downloads } = item;
    return `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" class="card-image"/>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>`;
  }).join(''); 
}