import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import { fetchImages } from './js/api';

let pageToFetch = 0;
let queryToFetch = '';
let totalHits = 0;

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) loadMoreImages(queryToFetch, pageToFetch);
    });
  },
  { rootMargin: '200px' }
);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  nav: true,
});

// hideLoadMoreBtn();

async function getImages(q, page) {
  Loading.standard('Loading...Please wait');

  try {
    const data = await fetchImages(q, page);
    totalHits = data.totalHits;
    if (totalHits === 0) {
      Loading.remove();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          fontSize: '20px',
          distance: '40%',
        }
      );
    } else {
      renderHtml(data.hits);

      if (page === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`, {
          fontSize: '20px',
          distance: '40%',
        });
      }
      lightbox.refresh();
      Loading.remove(500);

      if (pageToFetch === Math.ceil(totalHits / 40)) {
        // hideLoadMoreBtn();
        observer.unobserve(refs.guard);
        Notify.failure(
          'We are sorry, but you have reached the end of search results.',
          {
            fontSize: '20px',
            distance: '45%',
            position: 'center-top',
          }
        );

        return;
      }
      // if (totalHits > 40) {
      //   showLoadMoreBtn();
      // }
      observer.observe(refs.guard);
      incrementPage(pageToFetch);
    }
  } catch (error) {
    console.log('Error:', error);
    Loading.remove();
    Notify.failure(
      'An error occurred while fetching images. Please try again later.',
      {
        fontSize: '20px',
        distance: '45%',
        position: 'center-top',
      }
    );
    return;
  } finally {
    refs.form.reset();
  }
}

// refs.loadMoreBtn.addEventListener('click', loadMoreImages);

refs.form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  queryToFetch = evt.currentTarget.elements.searchQuery.value.trim();
  // console.log(queryToFetch);
  if (queryToFetch === '') {
    Notify.warning('Please, enter text!', {
      fontSize: '20px',
      distance: '40%',
    });
    return;
  }
  totalHits = 0;
  pageToFetch = 1;
  refs.gallery.innerHTML = '';
  observer.unobserve(refs.guard);
  getImages(queryToFetch, pageToFetch);
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
        return `<div class="photo-card hover-image-scale">
   <a href="${largeImageURL}" class="simple-lightbox">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="hover-image-scale"/>
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
  
}

function incrementPage(page) {
  pageToFetch += 1;
}

function loadMoreImages() {
  getImages(queryToFetch, pageToFetch);
}

// function showLoadMoreBtn() {
//   refs.loadMoreBtn.classList.remove('unvisible');
// }

// function hideLoadMoreBtn() {
//   refs.loadMoreBtn.classList.add('unvisible');
// }

// function scrollPage() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
