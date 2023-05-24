import React, {useEffect, useState} from 'react'
import ClientForm from "./ClientForm";
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow, TextField, Snackbar, Alert,
} from '@mui/material';
import { Search} from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from "@mui/material/IconButton";
import Popup from "../components/Popup";
import useTable from "../components/useTable";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import {addClient, deleteClient, getClients, readData} from "../../services/services";
import ImageUpload from "./ImageUpload";
import ArticleIcon from '@mui/icons-material/Article';
import * as XLSX from "xlsx";
import CSVReaderComponent from "./CSVReaderComponent";
import XLSXReaderComponent from "./CSVReaderComponent";

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
    { id: 'order', label:'Order'},
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Phone Number' },
    { id: 'country', label: 'Country' },
    { id: 'vatNumber', label: 'Vat Number' },
    { id: 'currency', label: 'Currency'},
    { id: 'bank', label: 'Bank'},
    { id: 'iban', label: 'IBAN'},
    { id: 'swift', label: 'Swift No.'},
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


    useEffect(() => {
        const user = localStorage.getItem('Auth Token');
        if(user==null) navigate("/login")
    }, [0]);

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
        let clients = await deleteClient(client.name);
        setRecords(clients);
    }

    return (
        <div style={{marginBottom:'50px'}}>
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
            <div style={{margin:20}}>
                    <Paper sx={classes.pageContent}>
                        <div style={classes.toolBar}>
                            <Typography variant="h4" sx={{display:{xs:'none',md:'flex'}}} noWrap  component="div">
                                Companies
                            </Typography>
                            <div style={classes.searchToggle}>
                                {/*<CSVReaderComponent></CSVReaderComponent>*/}
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
                        <TblContainer >
                            <TblHead/>
                            <TableBody>
                                {
                                    recordsAfterPagingAndSorting().map(user =>
                                        (<TableRow key={user.name}>
                                            <TableCell>{("0000" + serialNumber++).slice(-5)}</TableCell>
                                            <TableCell>{serialNumber==2?0:user.order}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phoneNumber}</TableCell>
                                            <TableCell>{user.country}</TableCell>
                                            <TableCell>{user.vatNumber}</TableCell>
                                            <TableCell>{user.currency}</TableCell>
                                            <TableCell>{user.bank}</TableCell>
                                            <TableCell>{user.iban}</TableCell>
                                            <TableCell>{user.swift}</TableCell>
                                            <TableCell>
                                                <div style={{display:'flex'}}>
                                                    <IconButton
                                                        color='primary'
                                                        onClick={()=>{setImageView(true);setCurrentClient(user)}}
                                                    >
                                                        <ArticleIcon fontSize='small'/>
                                                    </IconButton>
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
            </div>
            <ImageUpload
                open={imageView}
                setOpen={setImageView}
                images_data={currentClient?currentClient.images:undefined}
                company={currentClient?currentClient:undefined}
            ></ImageUpload>
        </div>
    )
}
