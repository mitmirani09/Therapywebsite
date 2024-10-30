import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

const deleteFormResponse = (token,body) => {
const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-submissions/delete-submission/`;

return axiosInstance.delete(apiUrl,{
      headers:{
         Authorization:`${token}`,
      },
      data:body,
    })
    .then((response) => {
      console.log("Form deleted successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting form:", error);
      return error; // or throw error, depending on your requirements
    });
};

export default deleteFormResponse;
