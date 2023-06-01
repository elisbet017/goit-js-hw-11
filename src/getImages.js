import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.name = '';
    this.page = 1;
    this.per_page = 40;
    this.totalHits;
  }

  async getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
      key: '36706034-f5193b0f10336721a563577c8',
      q: this.name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: this.per_page,
    });

    try {
      const response = await axios.get(`${BASE_URL}?${params}`);
      this.page += 1;
      this.totalHits = response.data.totalHits;
      return response.data.hits;
    } catch (error) {
      throw new Error(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get image() {
    return this.name;
  }

  set image(newName) {
    this.name = newName;
  }
}
