import {create} from 'zustand';

type TabStore = {
   activeTab: string | null;
   setActiveTab: (tab: string) => void;
   initializeActiveTab: () => void;
};

const useTabStore = create<TabStore>((set)=>({
   activeTab:'form',
   setActiveTab: (tab) => {
      set({activeTab:tab});
      sessionStorage.setItem('activeTab', tab);
   },
   initializeActiveTab:()=>{
      const savedTab = sessionStorage.getItem('activeTab');
      if(savedTab){
         set({activeTab:savedTab});
   }
},
}));


export default useTabStore;