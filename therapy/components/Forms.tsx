import React from 'react';
import { useState, useEffect } from 'react';
import {DeleteOutlineOutlined , AddCircleOutlineOutlined, ContentCopyOutlined, ArrowBackOutlined, SendOutlined } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { Dispatch, SetStateAction } from 'react';
import useUserStore from '@/store/useUserStore';
import useTabStore from '@/store/useTabStore';
import fetchFormsList from '@/app/api/getFormsList';
import ViewResponse from './ViewResponse';
import SendDialog from './SendDialog';
import ConfirmDialog from './ConfirmDialog';
import { useRouter } from "next/navigation";
import deleteFormById from '@/app/api/deleteFormById';

const Forms = (
    {
      formsListFromServer,
      onFormDelete,
    }: {
      formsListFromServer: any,
      onFormDelete:Dispatch<SetStateAction<any>>;
      }
) => {
   const router = useRouter();
   const { activeTab, setActiveTab } = useTabStore();
   const token = useUserStore((state) => state.token);
   const [viewResponse,setViewResponse] = useState(false);
   const [selectedForm, setSelectedForm] = useState<any>(null);
   const toggleViewResponse = (form:any) => {
      console.log("Selected form: ",form);
      setSelectedForm(form);
      setViewResponse(!viewResponse);
   };
   const handleBack = () => {
      setViewResponse(!viewResponse);
   };
   
   const handleCreateFormClick = () => {
      router.push('/admin/create-form');
   };


   





return (
   <div className='mt-10'>
      {
         viewResponse ? (
            <main className={`bg-[#FFF5F5] ${activeTab === 'form'? 'flex-1 p-6' : 'hidden'}`}>
                           <div className="flex gap-5 items-center mb-6 ml-4 mt-10">
                                          <button className="text-xs bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center mr-0" onClick={() => handleBack()}>
                                             <ArrowBackOutlined/>
                                             <span className='pl-1 pr-1'>Back</span>
                                          </button>
                                          <button className="text-xs bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center mr-0">
                                             <span className='pl-1 pr-1'>Create</span>
                                             <AddCircleOutlineOutlined/>
                                          </button>
                                          <SendDialog/>
                                          
                           </div>
                           <ViewResponse formsListFromServer={formsListFromServer} selectedForm={selectedForm} viewResponse={viewResponse} setViewResponse={setViewResponse}
                  />
            </main>
         ):(<>
         <div className="flex mb-6 ml-4">
                                    <button  onClick={handleCreateFormClick} className="bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center">
                                       <span className='pr-1'>Create</span>
                                       <AddCircleOutlineOutlined/>
                                    </button>
                              </div>
                              <div className="flex-wrap justify-center overflow-y-auto h-[420px] ml-4 p-8 rounded-2xl space-y-6 bg-white min-w-[280px] max-w-[65%]">
                                 {formsListFromServer.map(form => (
                                          <div key={form.id} className="bg-[#FFF5F5] p-4 rounded-xl shadow-md">
                                             <div className="flex justify-between items-center leading-relaxed">
                                                   <div>
                                                      <h2 className="text-lg font-bold">{form.forms.title}</h2>
                                                      <p className="text-wrap text-sm text-gray-500">{form.forms.description}</p>
                                                      <a href="#" className="text-sm text-purple-500" onClick={()=> toggleViewResponse(form)}>View Responses</a>
                                                   </div>
                                                   <div className="flex flex-col space-y-3 cursor-pointer">
                                                      <ContentCopyOutlined/>
                                                      <ConfirmDialog onFormDelete={onFormDelete} formId={form.id} token={token} selectedDialog={'deleteForm'} dialogTitle={"Delete"} dialogMessage={"Are you sure you want to delete this response?"}/>
                                                   </div>
                                             </div>
                                          </div>
                                       ))}
                              </div>
            </>
            
         )
      }
                              
                           </div>
)
}

export default Forms