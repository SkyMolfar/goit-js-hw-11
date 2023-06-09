import notiflix from 'notiflix';
import { fetchPhotos } from './function';

const PHOTOS_PER_PAGE = 40;

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

visibility(loadMore).hide();

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  try {
    await onSearch();
  } catch (err) {
    console.error(err);
    notiflix.Notify.failure('Failed to fetch photos');
  }
});

async function onSearch() {
  visibility(loadMore).hide();
  loadMore.dataset.page = 1;
  gallery.innerHTML = '';

  let photosRes = await fetchPhotos(getSerachFormQuery(), {
    page: 1,
    per_page: PHOTOS_PER_PAGE,
  });
  if (!photosRes.hits.length) {
    notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (photosRes.hits.length < PHOTOS_PER_PAGE) {
    notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  gallery.innerHTML = buildGallery(photosRes.hits);

  photosRes.hits.length < PHOTOS_PER_PAGE
    ? visibility(loadMore).hide()
    : visibility(loadMore).show();
  loadMore.dataset.page = 2;
}

const searchQuery = getSerachFormQuery();
if (!searchQuery.trim()) {
  notiflix.Notify.info('Please enter a search query.');
  return;
}

loadMore.addEventListener('click', onLoadMore);
async function onLoadMore() {
  let page = parseInt(loadMore.dataset.page);

  let photosRes = await fetchPhotos(getSerachFormQuery(), {
    page: page,
    per_page: PHOTOS_PER_PAGE,
  });
  if (!photosRes.hits.length) {
    notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (photosRes.totalHits == 0) {
    notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (photosRes.totalHits == 0) {
    notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMore.attributes.hidden = true;
    return;
  }

  gallery.innerHTML += buildGallery(photosRes.hits);

  photosRes.hits.length < PHOTOS_PER_PAGE
    ? visibility(loadMore).hide()
    : visibility(loadMore).show();
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
  </div>`;
}

function visibility(elem) {
  return {
    hide: () => {
      elem.style.display = 'none';
    },
    show: () => {
      elem.style.display = '';
    },
  };
}

async function onLoadMore() {
  let page = parseInt(loadMore.dataset.page);

  let photosRes = await fetchPhotos(getSerachFormQuery(), {
    page: page,
    per_page: PHOTOS_PER_PAGE,
  });
  if (!photosRes.hits.length) {
    notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (
    photosRes.hits.length < PHOTOS_PER_PAGE ||
    photosRes.totalHits <= page * PHOTOS_PER_PAGE
  ) {
    notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMore.attributes.hidden = true;
    return;
  }

  gallery.innerHTML += buildGallery(photosRes.hits);

  photosRes.hits.length < PHOTOS_PER_PAGE
    ? visibility(loadMore).hide()
    : visibility(loadMore).show();
  loadMore.dataset.page = page + 1;
}
