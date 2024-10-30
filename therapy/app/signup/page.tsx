import {SignUpForm} from "@/components/LoginForm";
import React from "react";
import firebaseApp from '../../config';
import { getAuth } from "firebase/auth";

const SignUpPage = () => {
    const auth = getAuth(firebaseApp);

    return <div><SignUpForm/></div>;
    }
export default SignUpPage;