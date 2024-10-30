import React, { useState} from 'react';
import { getAuth , sendPasswordResetEmail } from 'firebase/auth'; 
import firebaseApp from "@/config";
import {Dispatch, SetStateAction} from 'react';

const ForgotPassword = ({
    showForgotPassword,
    setShowForgotPassword,
}:{
    showForgotPassword:boolean;
    setShowForgotPassword:Dispatch<SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true); // State for email validation
   // Modal state

  // Simple email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(firebaseApp);
      console.log(email);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('auth/user-not-found')) {
        setError('No user found with this email address.');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Invalid email address format.');
      } else {
        setError('Error sending reset email. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Modal open/close handler
  const toggleModal = () => setShowForgotPassword(!showForgotPassword);

  return (
    <>
      {/* Modal */}
      {showForgotPassword && (
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ease-in-out ${
            showForgotPassword ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`bg-white w-full max-w-md p-8 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out ${
              showForgotPassword ? 'scale-100' : 'scale-95'
            }`}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>

            <form noValidate>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    !emailValid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {/* Error message for invalid email */}
                {!emailValid && <p className="text-red-500 mt-1">Please enter a valid email address.</p>}
              </div>

              <button
                onClick= {handleForgotPassword}
                disabled={loading || !validateEmail(email)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
            </form>

            {/* Display success or error messages */}
            {message && <p className="text-green-500 mt-4">{message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Close button */}
            <button
              onClick={toggleModal}
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;

