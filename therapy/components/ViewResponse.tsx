'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import {DeleteOutlineOutlined , ForwardToInboxOutlined, ContentCopyOutlined} from '@mui/icons-material';
import { Dispatch, SetStateAction } from 'react';
import useTabStore from '@/store/useTabStore';
import useUserStore from '@/store/useUserStore';
import fetchFormsById from '@/app/api/getFormsForTherapistByFormId';
import 'survey-core/defaultV2.min.css';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';




const ViewResponse = (
    {   formsListFromServer,
        selectedForm,
        viewResponse,
        setViewResponse,
      }: {
        formsListFromServer:any;
        selectedForm: any;
        viewResponse: boolean;
        setViewResponse: Dispatch<SetStateAction<boolean>>;
      }
) => {
    const { activeTab, setActiveTab } = useTabStore();
    
    const toggleViewResponse = () => {
        setViewResponse(!viewResponse);
      };
    
    // State to track the selected response and its total score
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [totalScore,setTotalScore] = useState(0);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    //Calculate the total score when a response is selected
    useEffect(() => {
      if (selectedResponse) {
        const transformedResponse = selectedResponse.responses.reduce((acc, response) => {
          acc[response.name] = response.value;
          return acc;
        }, {});
        console.log("Selected response",selectedResponse);
        const selectedSurvey = new Model(selectedResponse.forms);
        selectedSurvey.data = transformedResponse;
        selectedSurvey.mode = 'display';
        console.log("Transformed Response: ", transformedResponse);
        setSelectedSurvey(selectedSurvey);
        const score = selectedResponse.responses.reduce((sum, item) => sum + item.score, 0);
        setTotalScore(score); // Update the total score
      }
    }, [selectedResponse]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = useUserStore((state) => state.token);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const isAdmin = useUserStore((state) => state.role);
    //const formTitle = formsListFromServer.map((form)=> form.title);
    //const formDescription = formsListFromServer.map((form)=> form.description);
    //const formFields = formsListFromServer.map((form)=> form.fields);
    const [forms,setForms] = useState(null);
   

const getFormsById = async () => {
   try {
      if (isLoggedIn && isAdmin === 'therapist') {
        const data = await fetchFormsById(token,selectedForm.id); // Using await instead of .then
        setForms(data || null);
        console.log("Forms Data: ",data);
      } else {
        setForms(null);
      }
    } catch (error) {
      console.error('API Error:', error);
      setError('Error fetching forms');
    } finally {
      setLoading(false);
      
    }
};
useEffect(() => {
  getFormsById();
}, []);

if (loading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;


if (forms == null) {
  return <p>No Responses found</p>
}


  const survey = new Model(selectedForm.forms);
  survey.mode = 'display';
  const responses = forms.forms.filter(form => form.status === "Filled");
  const pending = forms.forms.filter(form => form.status === "Pending");
  

  

  //console.log("Questions:", questions);
  console.log("Responses:", responses);
  console.log("Pending:", pending);


  return (
    <div className={`flex-col-reverse flex md:flex-row gap-4`}>
                  {selectedResponse ? (
                    <Survey model = {selectedSurvey}/>
                        ):(
                            <Survey model = {survey}/>  
      )}
                                    
                                
                                
                                        <div className={`${activeTab === 'client-details'? 'hidden' : ''} flex-1 bg-white shadow-md rounded-2xl p-5  mb-6`}>
                                            <div className='ml-2 mb-2'>
                                                <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 ">Responses : {responses.length}
                                                </h2>
                                                <div className="overflow-y-auto h-[20%] space-y-2">
                                                    {responses.map((response, index) => (
                                                        <div className="px-4 py-2 flex flex-row gap-5 bg-[#FFF5F5] rounded-xl" key={index} onClick={() => setSelectedResponse(response)}>
                                                            <div>
                                                                <p className="text-gray-700">{response.client_name}</p>
                                                                {/* <p className="text-gray-500 text-sm">Filled on {response.date}</p> */}
                                                            </div>
                                                            {selectedResponse &&
                                                              <ConfirmDialog setSelectedResponse={setSelectedResponse} onDeleteResponse={getFormsById} id={selectedForm.id} token={token} name={selectedResponse.client_name} selectedDialog={'delete'} dialogTitle={"Delete"} dialogMessage={"Are you sure you want to delete this response?"}/>
                                                            }
                                                            
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                            </div>
                                            <div className='ml-2 mb-2'>
                                                <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2">Pending : {pending.length}</h2>
                                                <div className='overflow-y-auto h-[20%] space-y-2'>
                                                    {pending.map((pendingItem, index) => (
                                                        <div className="px-4 py-2 flex flex-row gap-5 bg-[#FFF5F5] rounded-xl  " key={index}>
                                                            <div>
                                                                <p className="text-gray-700">{pendingItem.client_name}</p>
                                                                {/* <p className="text-gray-500 text-sm">Sent on {pendingItem.date}</p> */}
                                                            </div>
                                                            
                                                            <ConfirmDialog pendingName={pendingItem.client_name} pending_form_id={selectedForm.id} token={token} selectedDialog={'send'} dialogTitle={"Re-Send Mail"} dialogMessage={"Are you sure you want to re-send mail?"}/>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                            

                                            
                                        </div>
                                </div>
  )}

export default ViewResponse;