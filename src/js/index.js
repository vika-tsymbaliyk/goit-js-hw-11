
import { Report } from 'notiflix/build/notiflix-report-aio';
import { searchForm, gallery, API_KEY, apiAdress } from './refs.js'
import {fetchPhotoByQ} from './api.js'

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