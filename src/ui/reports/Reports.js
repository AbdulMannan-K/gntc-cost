import React, {useEffect, useReducer, useState} from 'react'
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography,
    Input,
    Button,
    TableRow,
    TextField,
    Snackbar,
    Alert,
    Chip,
    Autocomplete,
    ToggleButton,
    Select,
    FormControl, InputLabel,
} from '@mui/material';
import {Search} from "@mui/icons-material";
import useTable from "../components/useTable";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import {getClients, getReports} from "../../services/services";
import DateRangePicker from "react-bootstrap-daterangepicker";
import 'bootstrap-daterangepicker/daterangepicker.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import {SaveAltOutlined} from "@mui/icons-material";

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
        overflow: "auto",
        height: '6vh',
    },
    searchToggle: {
        display: 'flex' ,
        gap: 10,
        alignItems: "center",
    }
}

const headCells = [
    { id: 'serialNumber', label:'Nr.'},
    { id: 'start' , label: 'Date' },
    { id: 'company', label: 'Company Name' },
    { id: 'bank', label: 'Bank Name' },
    { id: 'status', label: 'Status'},
    { id: 'currency', label: 'Currency'},
    { id: 'payment', label: 'Amount'},
]

export default function Reports() {
    const classes = styles;
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({
        fn: clients => {
            return clients;
        }
    })
    const [open, setOpen] = React.useState(false);
    const [companies,setCompanies] = useState([]);
    const [currentCompany,setCurrentCompany] = useState(null);
    const [currentBank,setCurrentBank] = useState('All');
    const [currentCurrency,setCurrentCurrency] = useState('All');
    const [dateRangeStart,setDateRangeStart] = useState(null);
    const [dateRangeEnd,setDateRangeEnd] = useState(null);
    const [recordForEdit,setRecordForEdit] = useState([])
    const [selected, setSelected] = React.useState(false);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    let serialNumber=1;

    const navigate = useNavigate();


    useEffect(() => {
        const user = localStorage.getItem('Auth Token');
        if(user==null) navigate("/login")
    }, [0]);

    useEffect(()=>{
        getReports(setRecords);
        getReports(setRecordForEdit);
        getClients(setCompanies);
    },[0])

    useEffect(()=>{
        if (selected) {
            const filteredRecords = records.filter(record => {
                const isBankMatch = (currentBank === 'All' || currentBank == null) || record.bank.toLowerCase() === currentBank.toLowerCase();
                const isCompanyMatch = currentCompany === null || record.company === currentCompany;
                const isCurrencyMatch = (currentCurrency === 'All' || currentCurrency==null) || record.currency.toLowerCase() === currentCurrency.toLowerCase();
                const isDateRangeMatch = (record.start.getTime() > dateRangeStart) && (record.start.getTime() < dateRangeEnd);

                return isBankMatch && isCompanyMatch && isCurrencyMatch && isDateRangeMatch;
            });
            setRecordForEdit(filteredRecords);

        }else {
            const filteredRecords = records.filter(record => {

                const isBankMatch = (currentBank === 'All' || currentBank == null) || record.bank.toLowerCase() === currentBank.toLowerCase();
                const isCompanyMatch = currentCompany === null || record.company === currentCompany;
                const isCurrencyMatch =(currentCurrency === 'All' || currentCurrency==null) || record.currency.toLowerCase() === currentCurrency.toLowerCase();
                return isBankMatch && isCompanyMatch && isCurrencyMatch;
            });
            setRecordForEdit(filteredRecords);

        }
    },[currentCompany,dateRangeStart,dateRangeEnd,selected,currentBank,currentCurrency])

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(recordForEdit, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: users => {
                if (target.value === "")
                    return users;
                else
                    return users.filter(x => x.company.toLowerCase().includes(target.value) || x.start.toLocaleDateString().includes(target.value) || x.bank.toLowerCase().includes(target.value) || x.currency.toLowerCase().includes(target.value) || x.payment.toString().includes(target.value) || x.status.toLowerCase().includes(target.value))
            }
        })
    }


    const getColor = (status) => {
        if(status=='pending'){
            return '#A9A9A9'
        }else if (status=='approved'){
            return '#68AA3B'
        }else if (status=='cancelled'){
            return '#FF0000'
        }else if (status=='rescheduled'){
            return '#F7A500'
        }else if (status=='paid'){
            return '#00BFFF'
        }
    }


    function exportToCSV(recordsAfterPagingAndSorting1, reports) {
        //rcport file to csv
        const csvData = [];
        const headers = ["Nr.","Date","Company Name","Bank Name","Currency","Status","Amount"];
        csvData.push(headers);
        recordsAfterPagingAndSorting1.map((record,index) => {
            const rowData = [
                index+1,
                record.start.toLocaleDateString(),
                record.company,
                record.bank,
                record.currency,
                record.status,
                record.payment
            ];
            csvData.push(rowData);
        }
        );
        let csvString = '';
        csvData.forEach(function (rowArray) {
            let row = rowArray.join(',');
            csvString += row + '\r\n';
        }
        );
        let data = encodeURI(csvString);
        let link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,' + data);
        link.setAttribute('download', 'reports.csv');
        link.click();
    }

    function formatToCurrency(amount){
        return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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
                            Reports
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
                            <Autocomplete
                                disablePortal
                                size={'small'}
                                options={companies.map((option) => option.name)}
                                sx={{ width: 250 }}
                                onChange={(event, newValue) => {setCurrentCompany(newValue)}}
                                renderInput={(params) => <TextField {...params} label="Company" />}
                            />
                            <Autocomplete
                                disablePortal
                                size={'small'}
                                defaultValue={'All'}
                                options={['All',...new Set([...companies.map((option) => option.bank)])]}
                                sx={{ width: 150 }}
                                onChange={(event, newValue) => {setCurrentBank(newValue)}}
                                renderInput={(params) => <TextField {...params} label="Bank" />}
                            />
                            <FormControl>
                                <InputLabel>Currency</InputLabel>
                                <Select
                                    size={'small'}
                                    sx={{ width: 100 }}
                                    value={currentCurrency}
                                    label="Currency"
                                    onChange={(event) => {setCurrentCurrency(event.target.value)}}
                                >
                                    <MenuItem value={'All'}>All</MenuItem>
                                    <MenuItem value={'USD'}>USD</MenuItem>
                                    <MenuItem value={'EUR'}>EUR</MenuItem>
                                    <MenuItem value={'CHF'}>CHF</MenuItem>
                                </Select>
                            </FormControl>
                            <DateRangePicker initialSettings={{
                                locale: {
                                    format: 'DD/MM/YYYY'
                                }
                            }} onCallback={(start,end,label)=>{
                                setDateRangeStart(new Date(start).getTime())
                                setDateRangeEnd(new Date(end).getTime())
                            }
                            }>
                                <input type="text" id='dateRange'/>
                            </DateRangePicker>
                            <ToggleButton
                                size="small"
                                value="time"
                                selected={selected}
                                onChange={() => {
                                    setSelected(!selected);
                                }}
                            >
                                <AccessTimeIcon />
                            </ToggleButton>
                            <IconButton
                                size="small"
                                value="time"
                                onClick={() => {
                                    setRecordForEdit(records)
                                }}
                            >
                                <AllInclusiveIcon />
                            </IconButton>
                        </div>
                    </div>
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(record =>
                                    (<TableRow key={record.event_id}>
                                        <TableCell>{serialNumber++}</TableCell>
                                        <TableCell>{(record.start).toLocaleDateString("en-GB")}</TableCell>
                                        <TableCell>{record.company}</TableCell>
                                        <TableCell>{record.bank}</TableCell>
                                        <TableCell>
                                            {<Chip label={record.status} sx={{bgcolor:`${getColor(record.status)}`,color:'white'}} variant="outlined" />}
                                        </TableCell>
                                        <TableCell>{record.currency}</TableCell>
                                        <TableCell>{formatToCurrency(record.payment)}</TableCell>
                                    </TableRow>)
                                )
                            }
                            {
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            variant="filled"
                                            color="primary"
                                            size="small"
                                            sx={{display:{xs:'flex',md:'none'}}}
                                            onClick={() => {
                                                exportToCSV(recordsAfterPagingAndSorting(), 'reports')
                                            }}
                                        >
                                            <SaveAltOutlined />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Typography variant="p"  noWrap  component="div">
                                            {
                                                formatToCurrency(recordsAfterPagingAndSorting()
                                                    .reduce((a,b)=>a+parseFloat(b.status=='paid'?b.payment:0),0))}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </TblContainer>
                    <span style={{position:'absolute',marginTop:10, zIndex:100,}}>
                        <div style={{display:"block"    }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SaveAltOutlined />}
                                sx={{display:{xs:'none',md:'flex'}}}
                                onClick={() => {
                                    exportToCSV(recordsAfterPagingAndSorting(), 'reports')
                                }}
                            >
                                Export
                            </Button>
                        </div>
                    </span>
                    <TblPagination />

                </Paper>
            </div>
        </div>
    )
}
