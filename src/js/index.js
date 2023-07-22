import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { searchForm, gallery, loadMoreBtn} from './refs.js'
import {fetchPhotoByQ} from './api.js'

searchForm.addEventListener("submit", findPhoto);
loadMoreBtn.addEventListener('click', onLoadMore);

let searchValue;
let currentPage = 1;

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
    galleryLightBox.refresh();
};

function createMarkup(data) {
 return data.hits.map((item) => {
    const { webformatURL,largeImageURL, tags, likes, views, comments, downloads } = item;
    return `<a href="${largeImageURL}" class = "gallery__link"><div class="photo-card">
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
    </div></a>`;
 }).join(''); 
    
};

const galleryLightBox = new SimpleLightbox('.gallery a');

function displayLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function onLoadMore() {
    console.log(searchValue);
    currentPage += 1;
    
    fetchPhotoByQ(searchValue, currentPage)
        .then(data => gallery.insertAdjacentHTML('beforeend', createMarkup(data)));
    galleryLightBox.refresh();
}


