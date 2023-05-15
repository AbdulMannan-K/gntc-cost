import React, {useEffect, useState} from 'react'
import ClientForm from "./ClientForm";
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow, TextField, Snackbar, Alert,
} from '@mui/material';
import {PreviewOutlined, Search} from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from "@mui/material/IconButton";
import Popup from "../components/Popup";
import useTable from "../components/useTable";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import {addClient, deleteClient, getClients} from "../../services/services";
import ImageUpload from "./ImageUpload";


const styles = {
    pageContent: {
        marginTop: (theme)=> theme.spacing(5),
        padding: (theme)=> theme.spacing(3)
    },
    searchInput: {
    },
    toolBar: {
        display: "flex",
        alignItems: "center",
        justifyContent:"space-between",
    },
    searchToggle: {
        display: 'flex' ,
        gap: 10,
        alignItems: "center",
    }
}

const headCells = [
    { id: 'serialNumber', label:'Sr.'},
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Phone Number' },
    { id: 'country', label: 'Country' },
    { id: 'vatNumber', label: 'Vat Number' },
    { id: 'uniqueNumber', label: 'Unique Number' },
    { id: 'currency', label: 'Currency'},
    { id: 'bank', label: 'Bank'},
    { id: 'iban', label: 'IBAN'},
    { id: 'swift', label: 'Swift No.'},
    { id: 'documents', label: 'Documents'},
    { id: 'edit', label: 'Edit', disableSorting: true}
]

export default function Clients() {
    const classes = styles;
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({
        fn: clients => {
            return clients;
        }
    })
    const [openPopup, setOpenPopup] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [imageView,setImageView] = useState(false);
    const [currentClient,setCurrentClient] = useState(null)
    let serialNumber=1;

    const navigate = useNavigate();

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: users => {
                if (target.value === "")
                    return users;
                else
                    return users.filter(x => x.name.toLowerCase().includes(target.value))
            }
        })
    }

    useEffect(()=>{
        getClients(setRecords);
    },[0])

    const addOrEdit = async (user, resetForm) => {
        let update= recordForEdit==undefined
        let client = await addClient(user,update);
        if(client==null){
            setOpen(true)
            return;
        }else{
            setRecords(client);
        }
        setOpenPopup(false)
        // setRecordForEdit(null);
    }

    const openInPopup = async item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const delClient = async (client) => {
        let clients = await deleteClient(client.uniqueNumber);
        setRecords(clients);
    }

    return (
        <>
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
                    Client already exists
                </Alert>
            </Snackbar>
            <Container maxWidth="xl">
                    <Paper sx={classes.pageContent}>
                        <div style={classes.toolBar}>
                            <Typography variant="h4" sx={{display:{xs:'none',md:'flex'}}} noWrap  component="div">
                                Companies
                            </Typography>
                            <div style={classes.searchToggle}>
                                <TextField
                                    placeholder="Search"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                            <Search/>
                                        </InputAdornment>)
                                    }}
                                    sx={classes.searchInput}
                                    onChange={handleSearch}
                                />
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    sx={{display:{xs:'none',md:'flex'}}}
                                    startIcon={<AddIcon/>}
                                    onClick={async () => {
                                        setOpenPopup(true);
                                        setRecordForEdit(null);
                                    }}
                                >Add Company</Button>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    sx={{display:{xs:'flex',md:'none'}}}
                                    startIcon={<AddIcon/>}
                                    onClick={async () => {
                                        setOpenPopup(true);
                                        setRecordForEdit(null);
                                    }}
                                >Add</Button>
                            </div>
                        </div>
                        <TblContainer>
                            <TblHead/>
                            <TableBody>
                                {
                                    recordsAfterPagingAndSorting().map(user =>
                                        (<TableRow key={user.phoneNumber}>
                                            <TableCell>{("0000" + serialNumber++).slice(-5)}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phoneNumber}</TableCell>
                                            <TableCell>{user.country}</TableCell>
                                            <TableCell>{user.vatNumber}</TableCell>
                                            <TableCell>{user.uniqueNumber}</TableCell>
                                            <TableCell>{user.currency}</TableCell>
                                            <TableCell>{user.bank}</TableCell>
                                            <TableCell>{user.iban}</TableCell>
                                            <TableCell>{user.swift}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color='primary'
                                                    onClick={()=>{setImageView(true);setCurrentClient(user)}}
                                                >
                                                    <PreviewOutlined fontSize='small'/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <div style={{display:'flex'}}>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => { openInPopup(user) }}
                                                    ><EditOutlinedIcon fontSize="small"/>
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => { delClient(user) }}
                                                    ><DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>)
                                    )
                                }
                            </TableBody>
                        </TblContainer>
                        <TblPagination/>
                    </Paper>
                    <Popup
                        title="Company Information Form"
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                    >
                        <ClientForm
                            recordForEdit={recordForEdit}
                            addItem={addOrEdit}
                        />
                    </Popup>
            </Container>
            <ImageUpload
                open={imageView}
                setOpen={setImageView}
                images_data={currentClient?currentClient.images:undefined}
                company={currentClient?currentClient:undefined}
            ></ImageUpload>
        </>
    )
}
