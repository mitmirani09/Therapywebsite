import axios from "axios";

const axiosInstance = axios.create({
   headers: {
   "ngrok-skip-browser-warning": "69420",
   },
});

const notifyClientById = (token,body) => {

   const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-submissions/notify-client-pending-forms/`;  
   

   return axiosInstance.post(apiUrl, body,{
      headers:{
         Authorization: `${token}`,
      },
   })
   .then(response => {
      return response.data;
   })
      .catch(error => {
      console.error(error);
        return error; // or throw error, depending on your requirements
   });
   };


export default notifyClientById;