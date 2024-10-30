'use client';

import React from 'react'
import { useEffect } from 'react';
import useUserStore from '@/store/useUserStore';



// export default function ClientProvider({
//     children,
//   }: {
//     children: React.ReactNode;
//   }) {
//     const {checkAuth} = useUserStore();
//     // const logout = useUserStore((state) => state.logout);
  
//     useEffect(() => {
//       // Hydrate Zustand state from sessionStorage on page load/refresh
//         checkAuth();
  
//       // Clear sessionStorage when the tab is closed
//       //const handleTabClose = () => {
//         //sessionStorage.removeItem("user");
//         //logout(); // Clear Zustand state as well
//       //};
  
//       // Attach the event listener
//       //window.addEventListener("beforeunload", handleTabClose);
  
//       // Cleanup the event listener when the component is unmounted
//       //return () => {
//       //  window.removeEventListener("beforeunload", handleTabClose);
//       //};
//     }, [checkAuth]);
  
//     return <>{children}</>;
//   }



const ClientProvider = () => {
  const { checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth(); // This will hydrate the store on page load
  }, [checkAuth]);

  return null; // This component doesn't render anything visible
};

export default ClientProvider;
