import React, {useState} from "react";
import {getAuth,sendPasswordResetEmail} from "firebase/auth";
import {Alert, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function ForgotPassword() {
    const auth = getAuth();

  const [email, setEmail] = useState('')
    const [open, setOpen] = React.useState(false);
    const [text,setText] = React.useState('Please fill all the fields correctly')
    const [statuss,setStatuss] = React.useState('success')
    const navigate = useNavigate();

  const triggerResetEmail = async () => {
    await sendPasswordResetEmail(auth, email).then(() => {
        setText('Password reset email sent')
        setStatuss('success')
        setOpen(true)
        navigate('/login')
    }).catch((error) => {
        setText(error.message)
        setStatuss('error')
        setOpen(true)
    }
    );
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
                      onChange={(e)=>setEmail(e.target.value)}
                      value={email}
                      sx={{width:'400px'}}
                      fullWidth
                      label="Email"
                      name="email"
                      variant="outlined"
                  />
                  <Button
                      type="submit"
                      variant={"contained"}
                      onClick={triggerResetEmail}
                  >Reset Password</Button>
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
                  <Alert onClose={()=>setOpen(false)} severity={statuss} sx={{ width: '100%' }}>
                      {text}
                  </Alert>
              </Snackbar>
          </div>

  )
}

export default ForgotPassword;

