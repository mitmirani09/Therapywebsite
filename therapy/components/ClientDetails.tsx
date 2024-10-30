import React, { use, useEffect } from 'react'
import { Dispatch, SetStateAction } from 'react';
import ViewResponse from './ViewResponse';
import { useState } from 'react';
import { ArrowBackOutlined,AddCircleOutlineOutlined, SendOutlined } from '@mui/icons-material';
import { Button, Input, TextField, Typography } from '@mui/material';
import fetchClientDetails from '../app/api/getClientsDetails';
import fetchClientDetailsById from '@/app/api/getClientDetailsById';
import createClient from '@/app/api/createClient';
import useUserStore from '../store/useUserStore';
import useTabStore from '@/store/useTabStore';
import CreateClientForm from './CreateClientForm';
import updateClientDetailsById from '@/app/api/updateClientDetailsByClientId';
import fetchFormsOfClient from '@/app/api/getClientFormsData';



const ClientDetails = ()=> {
  
  
  const [clientDataFromServer, setClientDataFromServer] = useState([]);
  const [clientFormsDataFromServerById,setClientFormsDataFromServerById] = useState(null);
  const [selectedClient, setSelectedClient] = useState([]);
  const [selectedForm, setSelectedForm] = useState([]);
    //const email = useUserStore((state) => state.email);
  const token = useUserStore((state) => state.token);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const isAdmin = useUserStore((state) => state.role);


  const fetchClients = async () => {
    if (isLoggedIn && isAdmin === 'therapist') {
      const data = await fetchClientDetails(token);
      
      setClientDataFromServer(data || []);
      setSelectedClient(data[0]);
      getClientFormsById(data[0].id);
      console.log("Selected client id: ",data[0].id);
      console.log(data);
    } else {
      setClientDataFromServer([]);
    }
  };

  const handleClientSelection = (client) => {
    setSelectedClient(client);
    getClientFormsById(client.id);
    };
 

  const getClientFormsById = async (client_id) => {
    try {
        if(client_id !== null){
         const data = await fetchFormsOfClient(token,client_id); // Using await instead of .then
        setClientFormsDataFromServerById(data || null);
        console.log(data);
        const pending = data.forms_status.filter(form => form.status === "pending");
        const responses = data.forms_status.filter(form => form.status === "filled");
        console.log(pending)
      } else {
        setClientFormsDataFromServerById(null);
      }
    } catch (error) {
      console.error('API Error:', error);
       //setError('Error fetching forms');
    }
    //   finally {
    //    setLoading(false);
    //  }
};




  
  useEffect(() => {
    fetchClients();
  }, []);




  
  
  const [note, setNote] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const [name, setName] = useState(selectedClient?.name || '');  // Managing the state of the name field
  const [email, setEmail] = useState(selectedClient?.email || ''); 
  const [contact, setContact] = useState(selectedClient?.contact || ''); 

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const [isViewResponseClicked,setViewResponseClicked] = useState(false);

  const [isEdit,setIsEdit] = useState(false);

  const [isCreateClient,setIsCreateClient] = useState(false);
  
  const handleEditDetails = () =>{
    setIsEdit(!isEdit);
  }


  

  const handleSaveDetails = async () => {

    if (name === selectedClient.name && note === selectedClient.note && contact === selectedClient.contact) {
      console.log("No changes made, update request will not be sent.");
      setIsEdit(false);  // Exit edit mode since no changes were made
      return;  // Exit the function without sending the API request
    }


    const payload = {
      name: name,
      email: selectedClient.email,
      contact: contact,
      note:note,
    };

    try {
      const updatedClient = await updateClientDetailsById(token, payload, selectedClient.id);  // Make the PUT request
      console.log('Client details updated successfully:', updatedClient);
      
    // Refresh the client list by fetching updated clients from the server
      await fetchClients();
      setSelectedClient(updatedClient);
      // Update the UI with the new client data
      setIsEdit(!isEdit);
      // onClientUpdated(updatedClient); // Call the parent function to refresh client details
    } catch (error) {
      console.error('Error updating client details:', error);
    }
  };

  


  const handleCreateClient = () =>{
    setIsCreateClient(!isCreateClient);
  };

  const toggleViewResponse = () => {
    setViewResponseClicked(!isViewResponseClicked);
  };

    
  return (
    <div className="flex flex-col-reverse w-[100%] gap-5 md:flex-row p-4 md:space-x-4">
                           {/* Left Part: Display selected client details */}
                          {!isViewResponseClicked && 

                          <div className="flex-1 overflow-y-auto p-4 bg-white shadow rounded-2xl">
                            <button className="mb-4 text-sm text-gray-500 hover:text-gray-700">
                              &larr; Back
                            </button>
                            {isEdit && 
                              <div className="flex flex-col max-w-[40%] space-y-2">
                                <Input id='name' placeholder='Name' value={name}
                                  onChange={(e) => setName(e.target.value)} />
                                <Input id='email' disabled type='email' placeholder='Email' value={selectedClient.email}
                              onChange={(e) => setEmail(e.target.value)} />
                                <Input id='contact' type='tel' placeholder='Contact' value={contact}
                              onChange={(e) => setContact(e.target.value)} />
                                <div className='mt-4 w-[40%]'>
                                    <TextField
                                      label="Notes"
                                      multiline
                                      rows={4}
                                      fullWidth
                                      value={note}
                                      onChange={(e) => setNote(e.target.value)}
                                      onBlur={handleBlur}
                                    />
                                </div>
                                <div className="flex justify-between">
                                  <Button variant="outlined" size="small" onClick={handleEditDetails}>
                                    Cancel
                                  </Button>
                                  <Button variant="outlined" size="small" onClick={handleSaveDetails}>
                                    Save
                                  </Button>
                                </div>
                              </div>
                              
                            }
                            {!isEdit && 
                            <>
                              <h2 className="text-xl font-semibold">{selectedClient.name }</h2>
                              <p className="text-sm text-gray-500">Email: {selectedClient.email}</p>
                              <p className="text-sm text-gray-500">Contact: {selectedClient.contact}</p>
                              <Typography
                                      variant="body1"
                                      onClick={handleFocus}
                                      style={{ minHeight: '100px', border: '1px solid #ccc', padding: '10px' }}
                                    >
                                      {selectedClient.note || 'Notes'}
                              </Typography>
                              <button onClick={handleEditDetails}>Edit details</button>
                            </>
                              
                            }
                            
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold mb-2">Responses</h3>
                              <div className="overflow-y-auto flex-grow space-y-2">
                                
                                {/* {selectedClient.responses.map((response, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-2 border rounded-lg shadow-sm"
                                  >
                                    
                                    <div className='cursor-pointer' onClick={() => toggleViewResponse()}>
                                      <p className="font-semibold">{response.form}</p>
                                      <p className="text-sm text-gray-500">
                                        Filled on {response.filledDate}
                                      </p>
                                    </div>
                                    <div
                                      className={`px-2 py-1 text-white rounded-lg ${
                                        response.responsesCount > 10
                                          ? 'bg-green-500'
                                          : 'bg-red-500'
                                      }`}
                                    >
                                      {response.responsesCount}
                                    </div>
                                  </div>
                                ))} */}
                              </div>
                            </div>
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold mb-2">Pending</h3>
                              <div className="overflow-y-auto flex-grow space-y-2">
                                {/* {selectedClient.pending.map((pending, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-2 border rounded-lg shadow-sm"
                                  >
                                    <div>
                                      <p className="font-semibold">{pending.form}</p>
                                    </div>
                                  </div>
                                ))} */}
                              </div>
                            </div>
                          </div>
}
                        {isViewResponseClicked && 
                        <div className={`flex flex-col bg-[#FFF5F5] flex-1`}>
                        <div className="flex gap-5 items-center mb-6 mt-10 ml-6">
                                          <button className="text-xs bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center mr-0" onClick={() => toggleViewResponse()}>
                                            <ArrowBackOutlined/>
                                            <span className='pl-1 pr-1'>Back</span>
                                          </button>
                                          <button className="text-xs bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center mr-0">
                                            <span className='pl-1 pr-1'>Create</span>
                                            <AddCircleOutlineOutlined/>
                                          </button>
                                          <button className="text-xs text-nowrap bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center">
                                            <span className='pl-1 pr-1'>Send to</span>
                                            <SendOutlined/>
                                          </button>
                           </div>
                        <ViewResponse/>
                     </div>
 
                    
                        }
                           {/* Right Part: Clients list */}
                           <div className="flex-1 p-4 bg-white shadow rounded-lg">
                           <h3 className="text-lg font-semibold mb-4">Clients</h3>
                           <button onClick={handleCreateClient}>Create Client</button>
                           {isCreateClient &&
                            <CreateClientForm setIsCreateClient={setIsCreateClient} onClientCreated={fetchClients}></CreateClientForm>
                           }
                           <ul className="overflow-y-auto h-[40%] space-y-2">
                              {clientDataFromServer.map((client, index) => (
                                 <li
                                 key={index}
                                 className={`p-2 border rounded-lg cursor-pointer ${
                                    client.name === selectedClient.name
                                       ? 'bg-red-100'
                                       : 'bg-gray-100 hover:bg-gray-200'
                                 }`}
                                 onClick={() => handleClientSelection(client)}
                                 >
                                    <p className="font-semibold">{client.name}</p>
                                    {/* <p className="text-sm text-gray-500">
                                       Joined on {client.responses[0].filledDate}
                                    </p> */}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
  )
}

export default ClientDetails