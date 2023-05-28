export default class NewsApiService {
  constructor() {
    this.name = '';
  }

  getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: '36706034-f5193b0f10336721a563577c8',
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: 1,
        per_page: 40,
      },
    };
    try {
      const response = axios.get(`${BASE_URL}`, options);
      return response.data.hits;
    } catch (error) {
      throw new Error();
    }
  }

  get image() {
    return this.name;
  }

  set image(newName) {
    this.name = newName;
  }
}
