'use client';
import React, { useEffect, useRef, useState } from 'react';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';
import 'survey-core/defaultV2.min.css';
import 'survey-creator-core/survey-creator-core.min.css';
import { Button, Modal, TextField, Checkbox, FormGroup, FormControlLabel, Autocomplete } from '@mui/material';
import useUserStore from '../store/useUserStore';
import fetchClientDetails from '@/app/api/getClientsDetails';
import { useRouter } from 'next/navigation';

const CreateForm = () => {
  const creatorRef = useRef<SurveyCreator | null>(null);
  const [formTitle, setFormTitle] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [sendToClients, setSendToClients] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const token = useUserStore((state) => state.token);
  // Dummy list of emails for selection
  const [availableClients,setAvailableClients] = useState([]);
  const router = useRouter();


  const fetchClients = async () => {
      const data = await fetchClientDetails(token);
      setAvailableClients(data || []);
      console.log(data);
  };
  
  useEffect(() => {
    fetchClients();
  }, []);


  useEffect(() => {
    if (!creatorRef.current) {
      const creator = new SurveyCreator({
        showLogicTab: true,
        isAutoSave: false, // Disable auto-saving
        allowEditSurveyTitle: true,
      });

      // Define how the survey is saved
      creator.saveSurveyFunc = (saveNo, onSavedCallback) => {
        setModalOpen(true);
      };

      creatorRef.current = creator;
    }
  }, []);

  const handleClose = () => setModalOpen(false);


 // handleEmailChange to directly update selected values
const handleEmailChange = (event, value) => {
  setSelectedEmails(value);
};

  //When user confirms form save
  const handleConfirmSave = () => {
    const surveyJson = creatorRef.current?.JSON || {};
    const emailStrings = selectedEmails.map((client) => client.email);

    const finalSurveyJson = {
      forms: surveyJson, // The form content
      sent_to_client: emailStrings.length > 0 ? emailStrings : [] // Emails or null
    };
    
    //console.log(finalSurveyJson);
    // Post the modified JSON to the backend
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-templates/`, {
      method: 'POST',
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalSurveyJson),
    })
    .then((response) => response.json())
    .then((data) => console.log("Survey saved successfully:", data))
    .catch((error) => console.error("Error saving survey:", error));

    handleClose(); // Close the modal
    router.replace('/admin/form')
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Create a Survey</h1>
      
      <div style={{ height: '80vh', width: '100%' }}>
        {/* Render the SurveyCreatorComponent */}
        {creatorRef.current && <SurveyCreatorComponent creator={creatorRef.current} />}
      </div>
      {/* Modal for sending to clients */}
      <Modal open={modalOpen} onClose={handleClose}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20">
          <h2 className="text-xl font-semibold mb-4">Send Form to Clients?</h2>
          <Autocomplete
            multiple
            options={availableClients}
            getOptionLabel={(option) => `${option.name}`}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                {option.name}: {option.email}
              </li>
            )}
            value={selectedEmails}
            onChange={handleEmailChange} // Updated to handle selection correctly
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Emails" placeholder="Select Clients" />
            )}
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleClose} className="mr-2">Cancel</Button>
            <Button variant="contained" onClick={handleConfirmSave}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateForm;
