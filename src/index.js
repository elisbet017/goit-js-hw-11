// SimpleLightbox
// плавне прокручування
// нескінченний скрол
// змінити пер пейдж на 40

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './getImages';
import LoadMoreBtn from './loadMoreButton';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const newsService = new NewsApiService();
const loadMore = new LoadMoreBtn({
  selector: '.load-more',
});
// const simplelightbox = new SimpleLightbox({
//   elements: document.querySelectorAll('.link'),
// });

loadMore.hide();

refs.form.addEventListener('submit', onSearch);
loadMore.refs.btn.addEventListener('click', onLoadMore);
// document.addEventListener('scroll')
// refs.gallery.addEventListener('click', onCardClick)

function onSearch(e) {
  e.preventDefault();
  loadMore.hide();

  newsService.image = e.currentTarget.elements.searchQuery.value;
  newsService.resetPage();
  newsService
    .getImages()
    .then(res => {
      onResetMarkup();
      onCheckElementsInBase(res);
    })
    .catch(error => {
      onError();
    });
}

function onCheckElementsInBase(res) {
  if (res.length === 0) {
    return onBadChecking(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  onCheckCountElementsInBase(res);
  onShowCountArticles(newsService.totalHits);
}

function onCheckCountElementsInBase(res) {
  if (res.length < newsService.per_page) {
    onRenderMarkup(res);
    // simplelightbox.refresh();
    return onBadChecking(
      "We're sorry, but you've reached the end of search results."
    );
  }
  onRenderMarkup(res);
  loadMore.show();
}

// function onCardClick() {
//   simplelightbox.show()
// }

function onError() {}

function onRenderMarkup(res) {
  // const
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
        `<div class="photo-card"><a href="${largeImageURL}" class='link'><img class='photo-img' src="${webformatURL}" alt="${tags}" loading="lazy" width='300' height='200'/></a><div class="info"><p class="info-item"><b>Likes</b><span>${likes}</span></p><p class="info-item"><b>Views</b><span>${views}</span></p><p class="info-item"><b>Comments</b><span>${comments}</span></p><p class="info-item"><b>Downloads</b><span>${downloads}</span></p></div></div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  onLoadMoreScroll();
}

function onLoadMore(res) {
  loadMore.disable();
  newsService
    .getImages()
    .then(res => {
      onCheckCountElementsInBase(res);
      loadMore.enable();
    })
    .catch(error => {
      onError();
    });
}

function onLoadMoreScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onResetMarkup() {
  refs.gallery.innerHTML = '';
}

function onBadChecking(message) {
  loadMore.hide();
  Notify.failure(message);
  return;
}

function onShowCountArticles(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}
