import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './getImages';

const refs = {
  form: document.querySelector('#search-form'),
  btnSearch: document.querySelector('[type="submit"]'),
};

refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

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
  if (imagesArr.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  onRenderMarkup();
}

function onError() {}

function onRenderMarkup() {}
