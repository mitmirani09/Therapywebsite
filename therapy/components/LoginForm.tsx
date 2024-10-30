'use client'
import React from "react";
import { useState,useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import firebaseApp from "@/config";
import useUserStore from '../store/useUserStore';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import fetchUserRole from "@/app/api/getUserRole";
import ForgotPassword from "./ForgotPassword";


export const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()

    const handleEmailChange = (e:any) => {
        console.log("hereeee")
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e:any) => {
        setPassword(e.target.value);
    };

    //password must contain atleast 6 chars and one number
    const passwordValidation = (password: string) => {
        if(password.length < 6){
            return false;
        }
        const re = new RegExp('(?=.*[0-9])');
        return re.test(password);
    }

    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        const auth = getAuth(firebaseApp);
        if(passwordValidation(password) === false){
            setErrorMessage('Password should contain at least 6 characters and one number');
            return;
        }
        

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            //router.replace(`/dashboard?userName=${user.displayName}`);
        })
        .catch((error) => {
            const errorCode = error.code;
            if(errorCode === 'auth/invalid-email'){
                setErrorMessage('Please enter a valid email address');
            }
            else if(errorCode === 'auth/weak-password'){
                setErrorMessage('Password should be at least 6 characters');
            }
            else if(errorCode === 'auth/email-already-in-use'){
                setErrorMessage('Email already in use');
            }
            else if(errorCode === 'auth/missing-password'){
                setErrorMessage('Password should be at least 6 characters');
            }
            else{
                setErrorMessage('An error occurred, please contact admin');
            }
        });

    };
    
    return (
        <div className="flex bg-[#d7dbdb] h-screen flex-col w-screen justify-center items-center">
            <div className="flex px-4 py-4 max-w-[500px] rounded-lg bg-[white] h-[50%] flex-col w-[50%] justify-evenly border-black border shadow-lg border-opacity-20">
            <h1 className="text-3xl text-[#151716]">Signup</h1>
            <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={handleEmailChange} />
            <TextField id="outlined-basic" label="Password" variant="outlined" value={password} onChange={handlePasswordChange} />
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            {errorMessage===''?null:<p className="text-red-500">{errorMessage}</p>}
            </div>
        </div>
    );
    }

const LoginForm = () => {
    const [email, setEmail] = useState('');
    // const [savedToken, setSavedToken] = useState('');
    // const [userRole, setUserRole] = useState<'customer' | 'therapist' | ''>('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('');
    const [roleResponse,setRoleResponse] = useState(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const login = useUserStore((state) => state.login);

    const handleLogin = (userEmail,userToken,userRole) =>{
        login(userEmail,userToken,userRole);
        if (userRole === 'customer') {
            router.push('/client');
          } else if (userRole === 'therapist') {
            router.push('/admin/form');
          }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        
        e.preventDefault();
        const auth = getAuth(firebaseApp);
        console.log(email);

        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;

            const userDetails = {
                email: user.email,
                uid: user.uid,
            }

            // Fetch the ID token
            const token = await user.getIdToken();
            console.log("Token:", token);

            // Fetch the user role
            const data = await fetchUserRole(token);
            console.log(data);
            const userRole = data.Role;
             // Get the role from the response

            if (user.email && userRole) {
              console.log(userRole)
              handleLogin(user.email, token, userRole); // Pass the role correctly
            } else {
              console.log(userRole)
              console.log("Email or role is not valid");
            }


            // user.getIdToken().then(token =>{
            //     setSavedToken(token);
            //     console.log("Token:", token);
            //     fetchUserRole(token).then(data=>{
            //         setRole(data.Role);
            //     })
            //     if(userDetails.email){
            //       handleLogin(userDetails.email,savedToken,role);
            //     }else{
            //       console.log("Email or role is not valid")
            //     }
            // });
            
            //const role = 'therapist';
            // fetchUserRole(token).then(data => {

            //     setRoleResponse(data);
            //     console.log(data);
            //     if (data && data.Role) {
            //         const userRole = data.Role;
            //         handleLogin(userDetails.email,token,userRole);
            //         console.log(userRole);  // "therapist"
            //     } else {
            //         console.error("Role is null or undefined");
            //     }
                
            //   });
            //const userRoleResponse = await fetchUserRole(token);
            
            
            // ...
            // router.replace(`/dashboard?userName=${user.email}`);
        })
        .catch((error) => {
            const errorCode = error.code;
            if(errorCode === 'auth/invalid-email'){
                setErrorMessage('Please enter a valid email address');
            }
            else if(errorCode === 'auth/invalid-credential'){
                setErrorMessage('Please check if you have entered email or password correctly.');
            }
            else if(errorCode === 'auth/uid-already-exists'){
                setErrorMessage('The provided uid is already in use by an existing user.');
            }
            else if(errorCode === 'auth/user-not-found'){
                setErrorMessage('There is no existing user ');
            }
            else{
                setErrorMessage('An error occurred, please contact admin');
            }
        });

    };

    useEffect(()=>{
        console.log("UserRoleResponse: ",roleResponse)
      },[roleResponse]);
    
    
    return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#d7dbdb">
      <Box component="form" onSubmit={handleSubmit} maxWidth="400px" width="100%" bgcolor="#FFF3F3" p={4} borderRadius={4} boxShadow={3}>
        <h1 className="text-3xl text-[#65558F] mb-4">Login</h1>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          margin="normal"
        />

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
          <Button variant="text" href="/signup" sx={{ textTransform: 'none' }}>
            Sign Up
          </Button>
          <Button onClick={() => setShowForgotPassword(true)} variant="text" sx={{ textTransform: 'none', color: 'gray' }}>
            Forgot Password?
          </Button>
        </Box>
        {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-md shadow-md relative w-96">
                <ForgotPassword showForgotPassword = {showForgotPassword}  setShowForgotPassword={setShowForgotPassword}/>
              </div>
            </div>
          )}
        <Button
          type="submit"
          fullWidth
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm py-2"
        >
          Submit
        </Button>
      </Box>
    </Box>
    );
    }

export default LoginForm;