
import axios from 'axios';



const axiosInstance = axios.create({
headers: {
   "ngrok-skip-browser-warning": "69420",
},
});




const fetchFormsList = (token) => {

   const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-templates/get-forms-by-therapist-id/`;  

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


export default fetchFormsList;