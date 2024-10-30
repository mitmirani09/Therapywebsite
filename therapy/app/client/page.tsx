'use client';

import ClientForm from "@/components/ClientForm";
import React from "react";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect } from "react"; 
import useUserStore from '@/store/useUserStore';


const ClientPage = () => {
    const {checkAuth} = useUserStore();
    
    useEffect(()=>{
        checkAuth();
     },[])
    return (
        <ProtectedRoute role="customer">
            <div><ClientForm/></div>
        </ProtectedRoute>
        
    )
    }
export default ClientPage;