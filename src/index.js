import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('#search-form'),
  btnSubmit: document.querySelector('.btn-submit'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let pageToFetch = 0;
let queryToFetch = '';
let totalHits = 0;

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, captionsData: 'alt', nav: true  });

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '36956826-672ab3f15608cce646c5c212d';
const params = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};


// https://pixabay.com/api/?key=36956826-672ab3f15608cce646c5c212d&q=yellow+flowers&image_type=photo

hideLoadMoreBtn();

async function getImages(q, page) {

  Loading.standard('Loading...Please wait');
  try {
    const { data } = await axios.get(
      `${axios.defaults.baseURL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageToFetch}&per_page=40`
    );

    totalHits = data.totalHits || 0;
    
    if (data.hits.length === 0) {
      Loading.remove();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          width: '360px',
          svgSize: '120px',
          fontSize: '20px',
          distance: '38%',
        }
      );
    } else incrementPage(page);
    renderHtml(data.hits);
   lightbox.refresh();
    Loading.remove(1500);
    // return data;

    if (totalHits > 40) {
      showLoadMoreBtn();
    }
  } catch (error) {
    console.error('Error:', error);
    Loading.remove();
    Notify.failure(
      'An error occurred while fetching images. Please try again later.',
      {
        width: '360px',
        svgSize: '120px',
        fontSize: '20px',
        distance: '45%',
        position: 'center-top',
      }
    );
    return;
  }
}
// довантаження наступної партії фото по кліку на кнопку Load more
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  queryToFetch = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(queryToFetch);
  if (queryToFetch === '') {
    Notify.warning('Please, enter text!', {
      width: '360px',
      svgSize: '120px',
      fontSize: '20px',
      distance: '38%',
    });
    return;
  }
  totalHits = 0;
  pageToFetch = 1;
  refs.gallery.innerHTML = '';
  await getImages(queryToFetch, pageToFetch);
  refs.form.reset();
}

function renderHtml(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
   <a href="${largeImageURL}" class="simple-lightbox">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function incrementPage(page) {
  pageToFetch += 1;
}

async function loadMoreImages() {
  await getImages(queryToFetch, pageToFetch);
  incrementPage(pageToFetch);
  if ((pageToFetch - 1) * 40 >= totalHits) {
    hideLoadMoreBtn();

    Notify.failure(
      'We are sorry, but you have reached the end of search results.',
      {
        width: '360px',
        svgSize: '120px',
        fontSize: '20px',
        distance: '45%',
        position: 'center-top',
      }
    );
    return;
  }
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('unvisible');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('unvisible');
}
