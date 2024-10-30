import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import createClient from '@/app/api/createClient';
import useUserStore from '../store/useUserStore';
import { Dispatch, SetStateAction } from 'react';
import {getAuth,sendPasswordResetEmail, createUserWithEmailAndPassword} from 'firebase/auth';
import firebaseApp from "@/config";




const CreateClientForm = ({
    setIsCreateClient,
    onClientCreated,
}:{
    setIsCreateClient:Dispatch<SetStateAction<boolean>>,
    onClientCreated: Dispatch<SetStateAction<any>>
}) => {
    const token = useUserStore((state) => state.token);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [createdClientData, setCreatedClientData] = useState(null);
    const [errors, setErrors] = useState({ name: '', email: '', contact: '', password:'' });
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setIsModalVisible(true); // Trigger modal appearance with animation
    }, []);


    // Function to handle API call when 'Create' button is clicked
    const validateForm = () => {
        let valid = true;
        const newErrors = { name: '', email: '', contact: '', password:'' };

        if (!name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Valid email is required';
            valid = false;
        }

        if (!contact || contact.length < 10) {
            newErrors.contact = 'Valid contact is required (at least 10 digits)';
            valid = false;
        }
        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            valid = false;
          }

        setErrors(newErrors);
        return valid;
    };




    const handleCreateClient = async () => {
        if(!validateForm()) return;

        try {
            //Signup client in firebase:
            const auth = getAuth(firebaseApp);
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            console.log('Client created in firebase: ', userCredential.user)


            const payload = {
                name: name,
                email: email,
                contact:contact,
            };

            // Replace this URL with your create client API endpoint
            createClient(token,payload).then(data =>{
                console.log(data);
                setIsCreateClient(false);
                onClientCreated();
            });

            // Send reset password email to new client 
            await sendPasswordResetEmail(auth,email);
            console.log('Password reset email sent to the client');

        } catch (error:any) {
            const errorCode = error.code;
            if(errorCode === 'auth/invalid-email'){
                alert('Please enter a valid email address');
            }
            else if(errorCode === 'auth/weak-password'){
                alert('Password should be at least 6 characters');
            }
            else if(errorCode === 'auth/email-already-in-use'){
                alert('Email already in use');
            }
            else if(errorCode === 'auth/missing-password'){
                alert('Password should be at least 6 characters');
            }
            else{
                alert('An error occurred, please contact admin');
            }
            console.error('Error during client creation:', error);
            setIsCreateClient(false);
        }
    };

    // handle outside click to close the modal..
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if ((event.target as HTMLElement).classList.contains('modal-bg')) {
                setIsCreateClient(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, []);

    return (
        <div className="modal-bg fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out">
            <div
                className={`bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-500 ease-in-out ${
                    isModalVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
            >
                <h2 className="text-xl font-semibold mb-4">Create Client</h2>
                <div className="flex flex-col space-y-4">
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        value={name}
                        error={!!errors.name}
                        helperText={errors.name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        error={!!errors.email}
                        helperText={errors.email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        id="contact"
                        label="Contact"
                        variant="outlined"
                        value={contact}
                        error={!!errors.contact}
                        helperText={errors.contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        error={!!errors.password}
                        helperText={errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    <div className="flex justify-end space-x-4">
                        <Button variant="outlined" size="medium" onClick={() => {
                            setIsModalVisible(false);
                            setTimeout(() => setIsCreateClient(false), 300); // Delay to close modal smoothly
                        }}>
                            Cancel
                        </Button>
                        <Button variant="contained" size="medium" onClick={handleCreateClient}>
                            Create
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateClientForm;
