// store/useUserStore.ts
import { stringify } from 'querystring';
import {create} from 'zustand';

type Store = {
  email: string | null;
  token: string | null;
  isLoggedIn: boolean;
  role: 'customer' | 'therapist' | null;
  hydrated:boolean;
  login: (email: string, token:string, role: 'customer' | 'therapist') => void;
  logout: () => void;
  checkAuth:() => void; // This will initialize the state from sessionStorage if available
}

const useUserStore = create<Store>((set) => ({
  email: '',
  token: null,
  isLoggedIn: false,
  role: null,
  hydrated:false,
  login: (email, token, role) => {
    set({ email, token, isLoggedIn: true, role,hydrated:true })

    sessionStorage.setItem('user', JSON.stringify({email,token,isLoggedIn:true,role,hydrated:true}));
  },
  logout: () => {
    set({ email: null, token:null, isLoggedIn: false, role: null });
    sessionStorage.removeItem('user');
  },

  // Hydrate method: Initialize Zustand state from sessionStorage if available
  checkAuth: () => {
    const savedUser = sessionStorage.getItem('user');
    console.log(savedUser)
    if (savedUser) {
      const {email, token, isLoggedIn,role} = JSON.parse(savedUser);
      if (isLoggedIn) {
        set({ email, token, isLoggedIn, role, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    }else{
      set({hydrated:true});
    }
  },
}));

export default useUserStore;
