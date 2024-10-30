import axios from "axios";

const axiosInstance = axios.create({
   headers: {
   "ngrok-skip-browser-warning": "69420",
   },
});

const fetchClientDetailsById = (token,id) => {

   const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}users/clients/get-client-by-id/?id=${id}`;  
   

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


export default fetchClientDetailsById;