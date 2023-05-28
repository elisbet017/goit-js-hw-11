import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './getImages';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMorebtn: document.querySelector('.load-more'),
};

const NewsService = new NewsApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMorebtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  // onResetMarkup();
  NewsService.image = e.currentTarget.elements.searchQuery.value;
  NewsService.getImages()
    .then(res => {
      onCheckField(res);
    })
    .catch(error => {
      onError();
    });
}

function onCheckField(res) {
  if (res.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  onRenderMarkup(res);
}

function onError() {}

function onRenderMarkup(res) {
  const markup = res
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card"><img class='photo-img' src="${webformatURL}" alt="${tags}" loading="lazy" width='300' height='200'/><div class="info"><p class="info-item"><b>Likes</b><span>${likes}</span></p><p class="info-item"><b>Views</b><span>${views}</span></p><p class="info-item"><b>Comments</b><span>${comments}</span></p><p class="info-item"><b>Downloads</b><span>${downloads}</span></p></div></div>`
    )
    .join('');
  refs.gallery.innerHTML += markup;
}

function onLoadMore() {
  NewsService.getImages()
    .then(res => {
      onCheckField(res);
    })
    .catch(error => {
      onError();
    });
}

function onResetMarkup() {
  refs.gallery.innerHTML = '';
}
