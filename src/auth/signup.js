import {Form, useForm} from "../ui/components/useForm";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {signUp} from "../services/services";
import {Alert, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";


const initialValues = {
    email:'',
    firstName:'',
    secondName:'',
    password:'',
    role:'',
}

function Signup(props) {

    const auth = getAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [errorText,setErrorText] = React.useState('Please fill all the fields correctly')

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName ? "" : "This field is required."
        if ('secondName' in fieldValues)
            temp.secondName = fieldValues.secondName ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length>6 ? "" : "Password should be great then 6 digits"
        if ('role' in fieldValues)
            temp.role = fieldValues.role!=="" ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    async function handleSubmit() {
        console.log(values)
        console.log(errors)
        if((!values.email || !values.password || !values.role || !values.firstName || !values.secondName)){
            // alert('Please fill all the fields correctly')
            setErrorText('Please fill all the fields correctly')
            setOpen(true)
        }
        else {

            axios.get(`https://api.hunter.io/v2/email-verifier?email=${values.email}&api_key=2bc3901db054f5453dc64dc58ee629d28ee0093c`).then(async res => {
                let valid = (res.data.data.status)
                if (valid === 'valid') {
                    await createUserWithEmailAndPassword(auth, values.email, values.password).then(async (response) => {
                        await signUp(values)
                        navigate('/login');
                    }).catch(err => {
                        alert('User already exists')
                        console.log(err);
                    })
                }else{
                    setErrorText('Please enter a valid email')
                    setOpen(true)
                }
            } ).catch(err => {
                console.log(err)
            });


        }
    }
    return (
        <div  style={
            {
                display:'flex',
                flexDirection:'column',
                gap:'20px',
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
                    height:'100vh',
                    justifyContent:'center',
                    alignItems:'center',
                }
            }>
                <h1>Sign Up</h1>
                <TextField
                    onChange={handleInputChange}
                    value={values.firstName}
                    sx={{width:'400px'}}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    variant="outlined"
                    error={errors.firstName}
                />
                <TextField
                    onChange={handleInputChange}
                    value={values.secondName}
                    fullWidth
                    label="Second Name"
                    name="secondName"
                    variant="outlined"
                    error={errors.secondName}
                />
                <TextField
                    onChange={handleInputChange}
                    value={values.email}
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                    error={errors.email}
                />
                <TextField
                    onChange={handleInputChange}
                    value={values.password}
                    fullWidth
                    label="Password"
                    name="password"
                    variant="outlined"
                    type="password"
                    error={errors.password}
                />
                <FormControl fullWidth sx={{ minWidth: 120 }} error={!!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={values.role}
                        label="Role"
                        name="role"
                        defaultValue={""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Employee">Employee</MenuItem>
                        <MenuItem value="CEO">CEO</MenuItem>
                    </Select>
                    <FormHelperText>{errors.capsule}</FormHelperText>
                </FormControl>
                <p className="cursor-pointer" onClick={()=>navigate('/login')}>Already have an account? login</p>

                <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit}
                >Signup</Button>
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

export default Signup;