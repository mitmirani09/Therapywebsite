import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

//const auth = getAuth();


const axiosInstance = axios.create({
  headers: {
     "ngrok-skip-browser-warning": "69420",
  },
  });
  
const fetchFormsOfClient = (token,id) => {
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-submissions/form-list-by-client/`;  

    return axiosInstance.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
        params:{
            client_id:id
        }
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error(error);
        return null; // or throw error, depending on your requirements
      });
    };
  

export default fetchFormsOfClient;