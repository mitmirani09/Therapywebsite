'use client'

import 'survey-core/defaultV2.min.css';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { useState , useEffect} from "react";
import "@/componentstyles/Sidebar.css";
import fetchPendingFormsOfClient from '../app/api/getPendingFormsByClient';
import useUserStore from '@/store/useUserStore';
import { title } from 'process';



const ClientForm = () =>{
    const [activeTab, setActiveTab] = useState('');
    const [pendingFormData,setPendingFormData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = useUserStore((state) => state.token);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const isClient = useUserStore((state) => state.role);
    const [activeForm, setActiveForm] = useState<any>(); 


    const getPendingForms = async () => {
      try {
        if (isLoggedIn && isClient === 'customer') {
          const data = await fetchPendingFormsOfClient(token); 
          console.log(data)
            if (data && data.pending_forms) {
              setPendingFormData(data.pending_forms);
            }else {
              setPendingFormData([]);
            }
        }else {
          setPendingFormData([]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setError('Error fetching forms');
      } finally {
        setLoading(false);
      }
  };
  useEffect(() => {
    getPendingForms();
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

    
// Function to handle survey submission and send the result to the backend
  const handleSurveyCompletion = (survey,form_id) => {
  console.log(survey.data);
  const resultData = [];
  for (const key in survey.data) {
    const question = survey.getQuestionByName(key);
    if(!!question) {
      const item = {
        name:key,
        value:question.value,
        title:question.title,
        displayValue:question.displayValue
      };
      resultData.push(item);
    }
  }





  // Send the survey result to the backend API
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}forms/form-submissions/`, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_id: form_id,
        survey_result: resultData,  // The survey result from SurveyJS  // Assuming each form has a unique identifier
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Survey result submitted successfully:', data))
      .catch((error) => console.error('Error submitting survey result:', error));

  };

    const handleFormClick = (tab) => {
        setActiveTab(tab.form_title);
        // Create a new Survey model only when a form is selected
        const formData = tab.forms
        const surveyModel = new Model(formData);
        setActiveForm(surveyModel);
        // onSurveyComplete event to capture the surey result..

        surveyModel.onComplete.add((sender) => {
          const form_id = tab.form_id;
          handleSurveyCompletion(sender,form_id);
        });
  };




    return(
    <div className="bg-[#d691eb] h-screen">

      <div className="flex flex-row h-screen">
        {/* sidebar div */}
        <div className="flex flex-col w-[20%] bg-white px-4 py-4">
          <div className="logo">
            {/* Replace with actual logo */}
            <img src="/your-logo.png" alt="Logo" />
          </div>
          {pendingFormData.length > 0 ?(
            <div className="pending-section">
            <h3 className=" font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500  mb-3 ">Pending</h3>
            <ul>
              {pendingFormData.map((tab) => (
                <>
                  <li
                  key={tab}
                  className={activeTab === tab.form_title ? 'active' : ''}
                  onClick={() => handleFormClick(tab)}
                  >
                  {tab.form_title}
                  </li>
                  <p>{tab.sent_at}</p>
                </>
                
              ))}
            </ul>
          </div>
          ):(
            <div>
              <h2>No Pending Forms</h2>
              <p>There are no forms pending at the moment.</p>
            </div>
          )}
          
        </div>
        {/* survey div */}
        <div className='w-screen'>
          {activeForm && <Survey model={activeForm}/>}
        </div>
      </div>
    </div>
    )
}
export default ClientForm;