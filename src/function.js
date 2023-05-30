import axios from "axios";


const MEDIA_API_KEY = '36804181-9c5d5f31163c379def57751b4';

export async function fetchPhotos(query, { key = MEDIA_API_KEY, page = 1, per_page = 20 } = {}) {
    let res = await axios(`https://pixabay.com/api/?key=${key}&q=${query}&orientation=horizontal&safesearch=true&image_type=photo&page=${page}&per_page=${per_page}`);
    if (res.status !== 200) {
        throw new Error("failed to fetch photos status: " + res.status);
    }
    return res.data;
}


