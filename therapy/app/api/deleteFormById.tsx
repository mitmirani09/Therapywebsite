import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

const deleteFormByID = (token,formId) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-templates/${formId}/`;

  return axiosInstance
    .delete(apiUrl,{
      headers:{
         Authorization: `${token}`,
      },
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

export default deleteFormByID;
