import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


const refs = {
  form: document.querySelector('#search-form'),
  btnSubmit: document.querySelector('.btn-submit'),
  gallary: document.querySelector('.gallery'),
};


axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '36956826-672ab3f15608cce646c5c212d';
const params = {
  q: 'q',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,

};

let pageToFetch = 0;
let queryToFetch = "";


async function getImages() {
  const {data} = await axios
    .get(`${axios.defaults.baseURL}?key=${API_KEY}&${params}`)
    
      // incrementPage();
      console.log(data);
      return data;
    };


refs.form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  // const inputValue = evt.elements.value;

  const form = evt.currentTarget;
  const value = form.elements.value.trim();

  console.log(form);
  console.log(value);
  getImages();
  
}


function renderHtml() {
  const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
  }).join('');
   list.insertAdjacentHTML("beforeend", markup);
};

// function incrementPage() {
//     page += 1;
// };
  
  
// https://pixabay.com/api/?key=36956826-672ab3f15608cce646c5c212d&q=yellow+flowers&image_type=photo
