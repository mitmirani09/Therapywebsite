'use client'
import ProtectedRoute from '@/components/ProtectedRoute';
import { MenuOutlined, CloseOutlined } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useUserStore from '@/store/useUserStore';
import useTabStore from '@/store/useTabStore';

const AdminLayout = ({ children }) => {
   const router = useRouter();
   const {checkAuth} = useUserStore();
   const { activeTab, setActiveTab , initializeActiveTab} = useTabStore();

   const handleTabClick = useCallback((tab) => {
      router.push(`/admin/${tab}`);
      setActiveTab(tab);
   }, [router, setActiveTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


   useEffect(() => {
      initializeActiveTab();
    }, [initializeActiveTab]);

   useEffect(()=>{
      console.log('re-rendered')
   },[activeTab])

   useEffect(()=>{
      checkAuth();
   },[])

   useEffect(() => {
      const handleClickOutside = (event) => {
        if (isSidebarOpen && !event.target.closest('#sidebar')) {
          setIsSidebarOpen(false);
        }
      };
  
      if (isSidebarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown',   
   handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isSidebarOpen]);


   

  return (
   <ProtectedRoute role="therapist">
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
        <button
            className="md:hidden p-2 fixed focus:outline-none" // Show only on medium screens and below
            onClick={toggleSidebar}
        > 
            <MenuOutlined className='top-[10px] left-[10px]'/>
        </button>
        <aside className={`h-screen w-[250px] bg-white p-6 transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 fixed top-0 left-0 z-10 md:relative`}>
                        <button
                           className="md:hidden p-2 fixed focus:outline-none" // Show only on medium screens and below
                           onClick={toggleSidebar}
                        > 
                           <CloseOutlined className=''/>
                        </button>
                        <div className="mt-10 mb-10">
                           <img src="https://placehold.co/100x100" alt="North Star Logo" className="mb-4"/>
                           <h1 className="text-xl font-bold">North Star</h1>
                           <p className="text-sm">Counseling and Therapy</p>
                        </div>
                        <nav>
                           <ul>
                              <li className={`${activeTab === 'dashboard' ? 'font-bold ' : ''} cursor-pointer transition-all duration-300 rounded-lg mb-10 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 `} 
                              onClick={
                                 () =>{
                                    handleTabClick('dashboard') 
                                    setIsSidebarOpen(false);
                                 } 
                                 }>Dashboard</li>
                              <li className={`mb-10 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 cursor-pointer transition-all duration-300 rounded-lg  ${activeTab === 'form' ? 'font-bold' : ''}`} 
                              onClick={
                                 () =>{
                                    handleTabClick('form');
                                    setIsSidebarOpen(false);
                                 } 
                                 }>Forms</li>
                              <li className={`mb-10 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 cursor-pointer transition-all duration-300 rounded-lg ${activeTab === 'client-details' ? 'font-bold' : ''}`} 
                              onClick={
                                 () =>{
                                    handleTabClick('client-details');
                                    setIsSidebarOpen(false);
                                 } 
                                 }>Clients</li>
                              <li className={`mb-10 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 cursor-pointer transition-all duration-300 rounded-lg ${activeTab === 'settings' ? 'bg-pink-50 font-bold' : ''}`} 
                              onClick={
                                 () =>{
                                    handleTabClick('settings');
                                    setIsSidebarOpen(false);
                                 } 
                                 }>Settings</li>
                           </ul>
                        </nav>
         
         </aside>

      {/* Content Area */}
        {children}
    </div>
   </ProtectedRoute>
  );
};

export default AdminLayout;
