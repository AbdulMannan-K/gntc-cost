import React, {useEffect} from 'react';
import {Form, useForm} from "../components/useForm";
import {Button, FormControl, Grid, InputLabel, Select, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const initialValues = {
    serialNumber:2,
    name:'',
    vatNumber:'',
    uniqueNumber:'',
    phoneNumber:'',
    email:'',
    country:'',
    currency:'EUR',
    bank:'',
    iban:'',
    swift:'',
}

function ClientForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('vatNumber' in fieldValues)
            temp.vatNumber = fieldValues.vatNumber ? "" : "This field is required."
        if ('uniqueNumber' in fieldValues)
            temp.uniqueNumber = fieldValues.uniqueNumber ? "" : "This field is required."
        if ('phoneNumber' in fieldValues)
            temp.phoneNumber = fieldValues.phoneNumber ? "" : "This field is required."
        if ('country' in fieldValues)
            temp.country = fieldValues.country ? "" : "This field is required."
        if ('currency' in fieldValues)
            temp.currency = fieldValues.currency ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        if ('bank' in fieldValues)
            temp.bank = fieldValues.bank ? "" : "This field is required."
        if ('iban' in fieldValues)
            temp.iban = fieldValues.iban ? "" : "This field is required."
        if ('swift' in fieldValues)
            temp.swift = fieldValues.swift ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    function handleSubmit(e){
        e.preventDefault();
        if(validate()){
            props.addItem(values,resetForm);
        }
    }


    useEffect(() => {
        if (props.recordForEdit != null)
            setValues({
                ...props.recordForEdit
            })
    }, [props.recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid >
                <TextField
                    sx={{marginBottom:2}}
                    label="Company Name"
                    value={values.name}
                    name="name"
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="Vat Number"
                    value={values.vatNumber}
                    name="vatNumber"
                    onChange={handleInputChange}
                    error={!!errors.vatNumber}
                    helperText={errors.vatNumber}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="Unique Number"
                    value={values.uniqueNumber}
                    name="uniqueNumber"
                    onChange={handleInputChange}
                    error={!!errors.uniqueNumber}
                    helperText={errors.uniqueNumber}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="Phone Number"
                    value={values.phoneNumber}
                    name="phoneNumber"
                    onChange={handleInputChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="Country"
                    value={values.country}
                    name="country"
                    onChange={handleInputChange}
                    error={!!errors.country}
                    helperText={errors.country}
                    fullWidth
                />
                <FormControl fullWidth
                             sx={{marginBottom:2}}
                >
                    <InputLabel >Currency</InputLabel>
                    <Select
                        value={values.currency}
                        label={"Currency"}
                        error={!!errors.currency}
                        onChange={(e)=>{setValues({...values,currency:e.target.value})}}
                    >
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="CHF">CHF</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    sx={{marginBottom:2}}
                    label="Email"
                    value={values.email}
                    name="email"
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="Bank"
                    value={values.bank}
                    name="bank"
                    onChange={handleInputChange}
                    error={!!errors.bank}
                    helperText={errors.bank}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="IBAN"
                    value={values.iban}
                    name="iban"
                    onChange={handleInputChange}
                    error={!!errors.iban}
                    helperText={errors.iban}
                    fullWidth
                />
                <TextField
                    sx={{marginBottom:2}}
                    label="Swift Number"
                    value={values.swift}
                    name="swift"
                    onChange={handleInputChange}
                    error={!!errors.swift}
                    helperText={errors.swift}
                    fullWidth
                />
            <div style={{display:'block'}}>
                <Button
                    type="submit"
                    variant="outlined"
                    size="large"
                    onClick={handleSubmit}
                    sx={{margin:"5px"}}
                >Submit</Button>
                <Button
                    sx={{margin:"5px"}}
                    size="large"
                    variant="outlined"
                    onClick={resetForm}>Reset</Button>
            </div>
            </Grid>
        </Form>
    );
}

export default ClientForm;