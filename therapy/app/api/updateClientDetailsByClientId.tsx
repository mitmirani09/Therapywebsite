import axios from "axios";

const axiosInstance = axios.create({
   headers: {
   "ngrok-skip-browser-warning": "69420",
   },
});

const updateClientDetailsById = (token,body,clientId) => {

   const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}users/clients/${clientId}/`;  
   

   return axiosInstance.put(apiUrl, body,{
      headers:{
         Authorization: `${token}`,
      },
   })
   .then(response => {
      return response?.data;
   })
      .catch(error => {
      console.error(error);
        return error; // or throw error, depending on your requirements
   });
   };


export default updateClientDetailsById;