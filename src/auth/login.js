import {Form, useForm} from "../ui/components/useForm";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {getEmp} from "../services/services";
import {Alert, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import React from "react";


const initialValues = {
    email:'',
    password:'',
}

function Login(props) {

    const auth = getAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

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

    async function handleSubmit() {

        await signInWithEmailAndPassword(auth,values.email,values.password).then(async(response)=>{
            const user = await getEmp(values.email)
            localStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
            localStorage.setItem('Role', user.role)
            localStorage.setItem('employee', (user.firstName + ' ' + user.secondName))
            navigate('/calendar');
        }).catch(err=>{
            console.log(err);
            setOpen(true)
            // alert('Wrong Login Details, Please Enter again')
        })

    }

    const keypress = (e) => {
        if(e.keyCode === 13){
            handleSubmit();
        }
    }
    // className="flex flex-col gap-4 w-1/3 h-1/1 justify-center align-middle"
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
                <h1 >Login</h1>
                <TextField
                    onChange={handleInputChange}
                    value={values.email}
                    sx={{width:'400px'}}
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                />
                <TextField
                    onChange={handleInputChange}
                    value={values.password}
                    fullWidth
                    label="Password"
                    name="password"
                    variant="outlined"
                    type="password"
                    onKeyDown={keypress}
                />
                {/*<div style={{margin:0,display:"flex",justifyContent:"space-between",width:'100%'}}>*/}
                {/*    <p style={{textDecoration:"underline",margin:0}} className="cursor-pointer" onClick={()=>navigate('/signup')}>Signup</p>*/}
                {/*    <p style={{textDecoration:"underline",margin:0}} className="cursor-pointer" onClick={()=>navigate('/forgotPassword')}>Reset Password</p>*/}
                {/*</div>*/}
                <Button
                    type="submit"
                    variant={"contained"}
                    onClick={handleSubmit}
                >Login</Button>
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
                    Wrong Login Details, Please Enter again
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;