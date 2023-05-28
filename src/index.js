import axios from "axios";
import notiflix from "notiflix";

const MEDIA_API_KEY = '36804181-9c5d5f31163c379def57751b4';
const PHOTOS_PER_PAGE = 40;

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

visibility(loadMore).hide();

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    try {
        await onSearch();
    } catch (err) {
        console.error(err);
        notiflix.Notify.failure('Failed to fetch photos');
    }
});


async function onSearch() {
    visibility(loadMore).hide()
    loadMore.dataset.page = 1;
    gallery.innerHTML = '';

    let photosRes = await fetchPhotos(getSerachFormQuery(), { page: 1, per_page: PHOTOS_PER_PAGE });
    if (!photosRes.hits.length) {
        notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
        return;
    }

    gallery.innerHTML = buildGallery(photosRes.hits);
 
    photosRes.hits.length < PHOTOS_PER_PAGE ? visibility(loadMore).hide() : visibility(loadMore).show();
    loadMore.dataset.page = 2;
}

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
    let page = parseInt(loadMore.dataset.page);

    let photosRes = await fetchPhotos(getSerachFormQuery(), { page: page, per_page: PHOTOS_PER_PAGE });
    if (!photosRes.hits.length) {
        notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
        return;
    }

    if (photosRes.totalHits == 0) {
        notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        loadMore.attributes.hidden = true;
        return;
    }

    gallery.innerHTML += buildGallery(photosRes.hits);

    photosRes.hits.length < PHOTOS_PER_PAGE ? visibility(loadMore).hide() : visibility(loadMore).show();
    loadMore.dataset.page = page + 1;
}

function getSerachFormQuery() {
    let form = new FormData(searchForm);
    return form.get('searchQuery');
}

function buildGallery(photos) {
    return photos.reduce((res, photo) => {
        res += buildPhoto(photo);
        return res;
    }, '');
}

function buildPhoto(photo) {
    return `<div class="photo-card" >
    <img src="${photo.webformatURL}" alt="" loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${photo.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${photo.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${photo.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${photo.downloads}
      </p>
    </div>
  </div>`
}



async function fetchPhotos(query, { key = MEDIA_API_KEY, page = 1, per_page = 20 } = {}) {
    let res = await axios(`https://pixabay.com/api/?key=${key}&q=${query}&orientation=horizontal&safesearch=true&image_type=photo&page=${page}&per_page=${per_page}`);
    if (res.status !== 200) {
        throw new Error("failed to fetch photos status: " + res.status);
    }
    return res.data;
}

function visibility(elem) {

    return {
        hide: () => { elem.style.display = 'none'; },
        show: () => { elem.style.display = ''; },
    }
}
