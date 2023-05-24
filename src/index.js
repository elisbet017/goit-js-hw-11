import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './getImages';

const refs = {
  form: document.querySelector('#search-form'),
  btnSearch: document.querySelector('[type="submit"]'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  onResetMarkup();

  const name = refs.form.elements.searchQuery.value;
  getImages(name)
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

function onResetMarkup() {
  refs.gallery.innerHTML = '';
}
