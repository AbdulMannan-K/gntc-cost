import React, {useEffect, useState} from "react";
import {Autocomplete, DialogActions, FormControl, InputLabel, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {useScheduler} from "@aldabil/react-scheduler";
import {addEvent, getClients} from "../services/services";

export const CustomEditor = ({ scheduler }) => {
    const event = scheduler.edited;
    const {events, setEvents, triggerLoading} = useScheduler();
    const [companies, setCompanies] = useState([]);
    const [banks, setBanks] = useState([]);

    // const banks = ["hbl","national bank","meezan bank","bank alf"];
    // const companies = ["company1","company2","company3","company4"];

    const [state, setState] = useState({
        company: event?.company || "",
        payment: event?.payment || "",
        bank: event?.bank || "",
    });
    const [error, setError] = useState({
        company: "",
        payment: "",
        bank: "",
    });

    useEffect(()=>{
        getClients(setCompanies);
    },[0])

    const handleChange = (value, name) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };
    const handleSubmit = async () => {
        // Your own validation
        if (state.company === '') {
            return setError({...error, company: "Company is required"});
        }
        if (state.payment === '') {
            return setError({...error, payment: "Payment is required"});
        }
        state.bank = companies.find((company)=>company.name === state.company)?.bank

        try {
            scheduler.loading(true);

            /**Simulate remote data saving */
            const added_updated_event = (await new Promise((res) => {
                /**
                 * Make sure the event have 4 mandatory fields
                 * event_id: string|number
                 * title: string
                 * start: Date|string
                 * end: Date|string
                 */
                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title:state.company,
                        start: scheduler.state.start.value,
                        end: scheduler.state.end.value,
                        company: state.company,
                        bank: state.bank,
                        payment: state.payment,
                        status: "pending",
                        currency: companies.find((company)=>company.name === state.company)?.currency,
                        color: "#ffffff"
                    });
                }, 100);
            })) ;
            addEvent(added_updated_event,false)
            console.log(events);
            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };

    return (
        <div >
            <p style={{margin:"1rem"}}>Add Event</p>
            <div style={{ padding: "1rem",display: "flex",flexDirection:"column",gap:10}}>
                <TextField
                    label="Date"
                    value={scheduler.state.start.value.toLocaleDateString('en-Gb')}
                    fullWidth
                    disabled
                />
                <Autocomplete
                    disablePortal
                    options={companies.map((option) => option.name)}
                    sx={{ width: 250 }}
                    onChange={(event, newValue) => {handleChange(newValue,'company')}}
                    renderInput={(params) => <TextField {...params} label="Company" />}
                />
                <TextField
                    label="Payment"
                    value={state.payment}
                    onChange={(e) => handleChange(e.target.value, "payment")}
                    error={!!error.payment}
                    helperText={error.payment}
                    type={"number"}
                    fullWidth
                />
                <TextField
                    value={companies.find((company)=>company.name === state.company)?.bank}
                    disabled
                    fullWidth
                />
            </div>
            <DialogActions>
                <Button onClick={scheduler.close}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
        </div>
    );
};
