'use client'
import React from 'react';
import ClientDetails from '@/components/ClientDetails';
import { useState } from "react";
import AdminLayout from '../AdminLayout';

const ClientDetailsPage = () => {
   //  const clientsData = [
   //      {
   //      name: 'John Doe',
   //      email: 'johndoe@gmail.com',
   //      contact: '+91 8888888888',
   //      responses: [
   //         { form: 'Form 1', filledDate: '12/10/2002', responsesCount: 25 },
   //         { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   //         { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   //         { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   //         { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   //         { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   //         { form: 'Form 2', filledDate: '12/10/2002', responsesCount: 8 },
   //      ],
   //      pending: [
   //         { form: 'Form A', filledDate: '12/10/2002', responsesCount: 25 },
   //         { form: 'Form B', filledDate: '12/10/2002', responsesCount: 8 },
     
   //      ],
   //      },
   //      {
   //      name: 'Bob Ken',
   //      email: 'bobken@gmail.com',
   //      contact: '+91 9999999999',
   //      responses: [
   //         { form: 'Form A', filledDate: '10/10/2002', responsesCount: 15 },
   //         { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
   //         { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
   //         { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
   //         { form: 'Form B', filledDate: '11/10/2002', responsesCount: 5 },
   //      ],
   //      pending: [
   //         { form: 'Form X', filledDate: '10/10/2002', responsesCount: 15 },
   //         { form: 'Form Y', filledDate: '11/10/2002', responsesCount: 5 },
   //         { form: 'Form Z', filledDate: '11/10/2002', responsesCount: 5 },
   //      ],
   //      },
   //      {
   //      name: 'Jane Daniel',
   //      email: 'janedaniel@gmail.com',
   //      contact: '+91 7777777777',
   //      responses: [
   //         { form: 'Form X', filledDate: '01/01/2003', responsesCount: 30 },
   //         { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
   //         { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
   //         { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
   //         { form: 'Form Y', filledDate: '02/01/2003', responsesCount: 12 },
   //      ],
   //      pending: [
   //         { form: 'Form 1', filledDate: '01/01/2003', responsesCount: 30 },
   //         { form: 'Form 2', filledDate: '02/01/2003', responsesCount: 12 },
   //         { form: 'Form 3', filledDate: '02/01/2003', responsesCount: 12 },
   //      ],
   //      },
   //   ];
    const [viewResponse,setViewResponse] = useState(true);

    const handleViewResponse = () =>{
        setViewResponse(!viewResponse)
    }

    


  return (
    <AdminLayout>
        <main className={`p-6 bg-[#FFF5F5] w-[100%]`}>
            <ClientDetails/>
        </main>
    </AdminLayout>
        
  )
}

export default ClientDetailsPage;