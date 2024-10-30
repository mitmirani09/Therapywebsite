'use client'
import React from 'react';
import { useState,useEffect } from 'react';
import {DeleteOutlineOutlined, MenuOutlined , AddCircleOutlineOutlined, ContentCopyOutlined, ArrowBackOutlined, SendOutlined } from '@mui/icons-material';

import Forms from './Forms';
import ClientDetails from './ClientDetails';
import Dashboard from './Dashboard';
import SendDialog from './SendDialog';
import useTabStore from '@/store/useTabStore';
import useUserStore from '@/store/useUserStore';
import fetchFormsList from '@/app/api/getFormsList';


const AdminForm = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { activeTab, setActiveTab } = useTabStore();
   
   
const clientsData = [
   {
   name: 'John Doe',
   email: 'johndoe@gmail.com',
   contact: '+91 8888888888',
   responses: [
      { form: 'Form 1', filledDate: '12/10/2002', responsesCount: 25 },
      { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
      { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
      { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
      { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
      { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
      { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   ],
   pending: [
      { form: 'Form A', filledDate: '12/10/2002', responsesCount: 25 },
      { form: 'Form B', filledDate: '12/10/2002', responsesCount: 8 },

   ],
   },
   {
   name: 'Bob Ken',
   email: 'bobken@gmail.com',
   contact: '+91 9999999999',
   responses: [
      { form: 'Form A', filledDate: '10/10/2002', responsesCount: 15 },
      { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
      { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
      { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
      { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
   ],
   pending: [
      { form: 'Form X', filledDate: '10/10/2002', responsesCount: 15 },
      { form: 'Form Y', filledDate: '11/10/2002', responsesCount: 5 },
      { form: 'Form Z', filledDate: '11/10/2002', responsesCount: 5 },
   ],
   },
   {
   name: 'Jane Daniel',
   email: 'janedaniel@gmail.com',
   contact: '+91 7777777777',
   responses: [
      { form: 'Form X', filledDate: '01/01/2003', responsesCount: 30 },
      { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
      { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
      { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
      { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
   ],
   pending: [
      { form: 'Form 1', filledDate: '01/01/2003', responsesCount: 30 },
      { form: 'Form 2', filledDate: '02/01/2003', responsesCount: 12 },
      { form: 'Form 3', filledDate: '02/01/2003', responsesCount: 12 },
   ],
   },
];




const [formsListFromServer, setFormsListFromServer] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const token = useUserStore((state) => state.token);
const isLoggedIn = useUserStore((state) => state.isLoggedIn);
const isAdmin = useUserStore((state) => state.role);

const getFormsList = async () => {
   try {
      if (isLoggedIn && isAdmin === 'therapist') {
        const data = await fetchFormsList(token); // Using await instead of .then
        setFormsListFromServer(data || []);
      } else {
        setFormsListFromServer([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setError('Error fetching forms');
    } finally {
      setLoading(false);
    }
};
useEffect(() => {
   getFormsList();
}, []);

if (loading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;
   

     // State to track selected client
   //const [selectedClient, setSelectedClient] = useState(clientsData[0]);


   return (
      <div className='w-[100%]'>
                        <main className={`${
                           isSidebarOpen ? 'md :w-[85%]' : 'md:w-full'
                         } h-screen transition-width duration-300 ease-in-out p-6 bg-[#FFF5F5] ${activeTab === 'form'? 'flex-1' : 'hidden'}`}>
                        {activeTab === 'form' && (
                           <Forms formsListFromServer={formsListFromServer} onFormDelete={getFormsList} />
                        )}
                  </main>
                     

               </div>
         
)
}

export default AdminForm;
