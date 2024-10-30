'use client';


import { useRouter } from 'next/navigation'; 
import {useEffect} from 'react';
import useUserStore from '../store/useUserStore';

interface ProtectedRouteProps{
    role: 'customer' | 'therapist';
    children: React.ReactNode;
}

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
    const router = useRouter();
    const { isLoggedIn, role: userRole, checkAuth,hydrated } = useUserStore();
    

    //  useEffect(()=>{
    //    checkAuth();
    //  },[checkAuth]);
    
    const handleRedirect = () =>{
      if (!isLoggedIn) {
        router.push('/login');
      } else if (userRole !== role) {
        if (role === 'customer') {
          router.push('/customer-not-authorized');
        } else if (role === 'therapist') {
          router.push('/therapist-not-authorized');
        }
      }
    };


    useEffect(() => {
      if(hydrated){
        handleRedirect();
      }
    }, [hydrated,isLoggedIn, userRole, router, role]);
    
    if(!hydrated){
      return <div>Loading...</div>
    }
    if (isLoggedIn && userRole === role) {
      return <>{children}</>;
    }
  
    // Optionally, render a loading state or nothing while redirecting
    return null;
  };
  
  export default ProtectedRoute;