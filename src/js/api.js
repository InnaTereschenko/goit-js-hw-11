import axios from 'axios';


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

async function fetchImages(q, page) {
     const response = await axios.get(
      `${axios.defaults.baseURL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  console.log(response.data);
    return response.data;
}

export { fetchImages };