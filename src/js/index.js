import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { searchForm, gallery, loadMoreBtn, itemsPerPage} from './refs.js'
import {fetchPhotoByQ} from './api.js'

searchForm.addEventListener("submit", findPhoto);
loadMoreBtn.addEventListener('click', onLoadMore);

let searchValue;
let currentPage = 1;

const galleryBox = new SimpleLightbox('.gallery a');

function findPhoto(event) {
    event.preventDefault();
    const { searchQuery } = event.currentTarget.elements;
    searchValue = searchQuery.value;
    currentPage = 1;
    hideLoadMoreBtn();
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
                gallery.innerHTML = createMarkup(data);
                // const galleryBox = new SimpleLightbox('.gallery a').refresh();
                galleryBox.refresh();
                if (data.hits.length < data.totalHits) {
                displayLoadMoreBtn();
                } else {
                 
                    Report.info(
                    'Info',
                    `We're sorry, but you've reached the end of search results.`,
                    'Okay',
                    );
                }
                // if (data.totalHits < itemsPerPage * currentPage) {
                //     Report.info(
                //     'Info',
                //     `We're sorry, but you've reached the end of search results.`,
                //     'Okay',
                //     );
                     
                // } else {
                //     displayLoadMoreBtn();
                // };
                
            }
        })
        .catch(error => {
            console.log(error);
            gallery.innerHTML = ''
        }
    );
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

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}

function displayLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function onLoadMore() {
    currentPage += 1;
    
    fetchPhotoByQ(searchValue, currentPage)
        .then(data => {
            gallery.insertAdjacentHTML('beforeend', createMarkup(data));
            // const galleryBox = new SimpleLightbox('.gallery a').refresh();
            galleryBox.refresh();
            if (gallery.children.length >= data.totalHits) {
                hideLoadMoreBtn();
                Report.info(
                    'Info',
                    `We're sorry, but you've reached the end of search results.`,
                    'Okay',
                    );
            }
        });
}


