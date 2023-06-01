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
const lightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
});

loadMore.hide();

refs.form.addEventListener('submit', onSearch);
loadMore.refs.btn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  try {
    e.preventDefault();
    loadMore.hide();
    newsService.image = e.currentTarget.elements.searchQuery.value.trim();
    if (newsService.image === '') {
      Notify.failure('Please enter something');
      return;
    }
    newsService.resetPage();
    const articles = await newsService.getImages();
    onResetMarkup();
    onCheckElementsInBase(articles);
  } catch (error) {
    onError(error);
  }
}

function onCheckElementsInBase(articles) {
  if (articles.length === 0) {
    return onBadChecking(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  onCheckCountElementsInBase(articles);
  onShowCountArticles(newsService.totalHits);
}

function onCheckCountElementsInBase(articles) {
  onRenderMarkup(articles);

  if (articles.length < newsService.per_page) {
    return onBadChecking(
      "We're sorry, but you've reached the end of search results."
    );
  }
  loadMore.show();
}

function onRenderMarkup(articles) {
  const markup = articles
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
  lightbox.refresh();
  onLoadMoreScroll();
}

async function onLoadMore(articles) {
  loadMore.disable();
  try {
    const articles = await newsService.getImages();
    onCheckCountElementsInBase(articles);
    loadMore.enable();
  } catch (error) {
    onError(error);
  }
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

function onError(error) {
  Notify.failure('Error');
}
