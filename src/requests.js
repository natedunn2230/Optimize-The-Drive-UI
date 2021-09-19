import axios from "axios";

let optimizerUrl = process.env.REACT_APP_OTD_API;

export const getLocationByCoord = async (lat, long) =>{
    const response = await axios.get(`${optimizerUrl}/locations?lat=${lat}&lng=${long}`);
    return response.data['locations'][0];
};

export const getLocationsByAddress = async (address, limit) => {
    const response = await axios.get(`${optimizerUrl}/locations?name=${address}&limit=${limit}`);
    return response.data['locations'];
};

export const postUnoptimizedLocations = async (locations) => {
    const response = await axios.post(`${optimizerUrl}/optimize`, {'locations': locations});
    return response.data;
};

export const pollOptimizedLocationsResult = async (resultId) => {
    const response = await axios.get(`${optimizerUrl}/optimize/result/${resultId}`);
    return response.data;
};
