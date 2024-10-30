'use client';
import LoginForm from "@/components/LoginForm";
import React from "react";
import firebaseApp from '../../config';
import { getAuth } from "firebase/auth";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import {useEffect} from 'react';

const LoginPage = () => {
    const auth = getAuth(firebaseApp);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const role = useUserStore((state) => state.role);
    const router = useRouter();
    useEffect(()=>{
        if(isLoggedIn){
            if(role === 'customer'){
                router.push('/client');
            }else if(role === 'therapist'){
                router.push('/admin/form')
            }
        }
    },[isLoggedIn,role,router]);

        return <div><LoginForm/></div>;
    }
export default LoginPage;


