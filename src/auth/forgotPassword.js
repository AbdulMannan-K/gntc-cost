import {Form, useForm} from "../ui/components/useForm";
import {
  EmailAuthProvider, getAuth,
  updatePassword,
  reauthenticateWithCredential, signInWithEmailAndPassword
} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {getEmp, signUp} from "../services/services";
import {Alert, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import { enc, SHA256 } from 'crypto-js';
import axios from "axios";


const initialValues = {
  email:'',
  password:'',
  code:''
}


function ForgotPassword(props) {

  const auth = getAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [errorText,setErrorText] = React.useState('Please fill all the fields correctly')
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [isCodeVerified, setIsCodeVerified] = React.useState(false);
  const [employee, setEmployee] = React.useState({});
  const sendVerificationCode = async () => {
    const emp = await getEmp(values.email);
    if (!emp) {
        setErrorText('No user found with this email!');
        setOpen(true);
        return;
    }
    setEmployee(emp)
    let code = generateVerificationCode();
    setVerificationCode(code);
    axios.put('http://localhost:4000/forgotpassword',{email:values.email,code:code}).then((res)=>{
        console.log(res);
        setIsCodeSent(true);
    }).catch((err)=>{
        setErrorText('Something went wrong!');
        setOpen(true);
    }
    )
  };

  const generateVerificationCode = () => {
    const secretKey = Math.random().toString(36).substring(2, 8);
    const verificationCode = SHA256(secretKey).toString(enc.Hex).substring(0, 6);
    return verificationCode;
  };

  const verifyCode = () => {
    if (verificationCode === values.code) {
      setIsCodeVerified(true);
    } else {
      setIsCodeVerified(false);
    }
  }

  const handleSubmit = async () => {
    if (isCodeVerified) {
      const oldPassword = employee.password;
      // const credential = EmailAuthProvider.credential(
      //     employee.email,
      //     oldPassword
      // );
      // console.log(auth);
      // await reauthenticateWithCredential(auth.currentUser, credential);
      await signInWithEmailAndPassword(auth,employee.email,oldPassword).then(async(response)=>{
      }).catch(err=>{
      })
      updatePassword(auth.currentUser, values.password).then(
        async () => {
          let updatedEmployee = ({...employee, password: values.password})
          await signUp(updatedEmployee)
          navigate('/login');
          auth.signOut();
        }
      ).catch(
        (error) => {
          console.log(error);
            setErrorText('Something went wrong!');
            setOpen(true);
        }
      )
    }
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('email' in fieldValues)
      temp.email = fieldValues.email ? "" : "This field is required."
    if ('password' in fieldValues)
      temp.password = fieldValues.password ? "" : "This field is required."
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

  const keypress = (e) => {
    if(e.keyCode === 13){
      sendVerificationCode();
    }
  }

  return (
      <div style={
        {
          display:'flex',
          flexDirection:'column',
          gap:'20px',
          width:'100%',
          height:'90vh',
          justifyContent:'center',
          alignItems:'center',
        }
      }>
        <div style={
          {
            display:'flex',
            flexDirection:'column',
            gap:'20px',
            height:'90vh',
            justifyContent:'center',
            alignItems:'center',
          }
        }>
          <h1 >Reset Password</h1>
          <TextField
              onChange={handleInputChange}
              value={values.email}
              sx={{width:'400px',display:isCodeSent?'none':'block'}}
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
          />
          <TextField
              onChange={handleInputChange}
              value={values.code}
              sx={{width:'400px',display:isCodeSent&&!isCodeVerified?'block':'none'}}
              fullWidth
              label="Code"
              name="code"
              variant="outlined"
          />
          <TextField
              onChange={handleInputChange}
              value={values.password}
              sx={{width:'400px',display:isCodeVerified?'block':'none'  }}
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              onKeyDown={keypress}
          />
          <Button
              sx={{display:isCodeSent?'none':'block'}}
              variant={"contained"}
              onClick={sendVerificationCode}
          >Send Code</Button>
          <Button
              sx={{display:isCodeVerified?'block':'none'}}
              type="submit"
              variant={"contained"}
              onClick={handleSubmit}
          >Submit</Button>
          <Button
              sx={{display:isCodeSent&&!isCodeVerified?'block':'none'}}
              type="submit"
              variant={"contained"}
              onClick={verifyCode}
          >Verify</Button>
        </div>
        <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            autoHideDuration={2000}
            onClose={()=>setOpen(false)}
        >
          <Alert onClose={()=>setOpen(false)} severity="error" sx={{ width: '100%' }}>
            {errorText}
          </Alert>
        </Snackbar>
      </div>
  );
}

export default ForgotPassword;