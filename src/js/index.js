
import { Report } from 'notiflix/build/notiflix-report-aio';
import { searchForm, gallery, API_KEY, apiAdress, loadMoreBtn, itemsPerPage, currentPage } from './refs.js'
import {fetchPhotoByQ} from './api.js'

searchForm.addEventListener("submit", findPhoto);
loadMoreBtn.addEventListener('click', onLoadMore);

let searchValue;

function findPhoto(event) {
    event.preventDefault();
    const { searchQuery } = event.currentTarget.elements;
    searchValue = searchQuery.value;
    console.log(searchValue);
    console.log(searchQuery.value);
    currentPage = 1;
    fetchPhotoByQ(searchQuery.value, currentPage)
        .then(data => {
            if (data.totalHits === 0) {
                Report.failure(
                    'Sorry,',
                    'there are no images matching your search query. Please try again.',
                    'Okay',
                );
            } else {
                Report.success(
                    'Great!',
                    `We found ${data.totalHits} images`,
                    'Okay',
                );
                gallery.innerHTML = createMarkup(data)
            }
        })
        .catch(error => {
            console.log(error);
            gallery.innerHTML = ''
        }
    );
    displayLoadMoreBtn();
    
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

function displayLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function onLoadMore() {
    console.log(searchValue);
    currentPage += 1;
    
    fetchPhotoByQ(searchValue, currentPage)
        .then(data => gallery.insertAdjacentHTML('beforeend', createMarkup(data)));
    
}