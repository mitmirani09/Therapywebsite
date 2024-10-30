
import axios from 'axios';

// const auth = getAuth();

const axiosInstance = axios.create({
  headers: {
    "ngrok-skip-browser-warning": "69420",
    //'Access-Control-Allow-Origin': '*',
    //'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning',
  },
});




const fetchClientDetails = (token) => {

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}users/clients/`;  
    

    return axiosInstance.get(apiUrl, {
        headers:{
          Authorization: `${token}`,
        },
      })
      .then(response => {
        return response.data;
      })
       .catch(error => {
        console.error(error);
         return null; // or throw error, depending on your requirements
      });
    };
  

export default fetchClientDetails;