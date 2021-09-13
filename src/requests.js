import axios from "axios";

let optimizerUrl = process.env.REACT_APP_OTD_API;
let geocodeUrl = process.env.REACT_APP_GEOCODE_API;
let geocodeKey = process.env.REACT_APP_GEOCODE_KEY;

export const reverseAddressLookup = async (lat, long) =>{
    const response = await axios.get(`${geocodeUrl}/reverse.php?key=${geocodeKey}&lat=${lat}&lon=${long}&format=json`);
    return response.data.display_name;
};

export const addressLookup = async (address) => {
    const response = await axios.get(`${geocodeUrl}/search.php?key=${geocodeKey}&q=${address}&format=json&limit=5`);
    return response.data;
};

export const postUnoptimizedLocations = async (locations) => {
    const response = await axios.post(`${optimizerUrl}/optimize`, {'locations': locations});
    return response.data;
};

export const pollOptimizedLocationsResult = async (resultId) => {
    const response = await axios.get(`${optimizerUrl}/optimize/result/${resultId}`);
    return response.data;
};
