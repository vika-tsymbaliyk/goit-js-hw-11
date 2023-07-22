import axios from 'axios';
import { API_KEY, apiAdress, itemsPerPage} from './refs.js'

//  axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchPhotoByQ(q, page)  {
    const config = {
    method: 'get',
    baseURL: apiAdress,
    params: {
        key: API_KEY,
        q: q,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: itemsPerPage,
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