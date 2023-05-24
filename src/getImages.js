import axios from 'axios';

export async function getImages(name) {
  const BASE_URL = 'https://pixabay.com/api/';
  const options = {
    params: {
      key: '36706034-f5193b0f10336721a563577c8',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };
  try {
    const response = await axios.get(`${BASE_URL}`, options);
    const imagesArr = response.data.hits;
    console.log(imagesArr);
    return imagesArr;
  } catch (error) {
    throw new Error();
  }
}
