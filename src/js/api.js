import axios from 'axios';
import { searchForm, gallery, API_KEY, apiAdress } from './refs.js'

//  axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchPhotoByQ(q)  {
    const config = {
    method: 'get',
    baseURL: apiAdress,
    params: {
        key: API_KEY,
        q: q,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    }
}
    try {
    const response = await axios.get('', config);
        console.log(response);
        return response.data;
  } catch (error) {
    console.error(error);
  }
}

export {fetchPhotoByQ}