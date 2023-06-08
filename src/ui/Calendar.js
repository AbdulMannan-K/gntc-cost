    import {Scheduler,useScheduler} from "@aldabil/react-scheduler";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {CustomEditor} from "./CustomEditor";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import {addEvent, calculateDayTotal, deleteEvent, getEvents, getEventsByDateRange} from "../services/services";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import {Paper, Stack} from "@mui/material";
    import {useNavigate} from "react-router-dom";

export const Calendar = () => {

    const {events,setEvents,view} = useScheduler();
    const [dayTotal,setDayTotal] = useState({})
    const [width, setWidth] = React.useState(0);
    const [secondWidth, setSecondWidth] = React.useState(0);
    const [mobileWidth,setMobileWidth] = React.useState(0)
    const [dayTotalElement, setDayTotalElement] = React.useState(null);
    // const [viewMode,setViewMode] = useState('week')
    let viewMode = 'week'
    const navigate = useNavigate();


    useEffect(() => {
        const user = localStorage.getItem('Auth Token');
        if(user==null) navigate("/login")
    }, [0]);

    let colors = {
        green : '#68aa3b',
        blue : '#376ac4',
        orange : '#f7a500',
        red : '#ff0000',

    }

    const month = {
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 6,
        startHour: 7,
        endHour: 13,
        navigation: true,
        disableGoToDay: false,
        cellRenderer: ({height, start, onClick, ...props}) => {
            // Fake some condition up
            const day = start.getDay();
            const disabled = day === 0;
            // const restProps = disabled ? {} : props;
            return (<div className={`min-h-full ${disabled ? 'bg-pink-100' : ''} flex flex-row gap-2`}>
                <div className=" bg-red-600"></div>
                {/*<div></div>*/}
                {/*<div></div>*/}
            </div>);
        },
    }

    const week = {
        weekDays: [0, 1, 2, 3, 4, 5, 6], weekStartOn: 1, startHour: 7, endHour: 13, step: 60,  navigation: true,
    }

    const day = {
        startHour: 7, endHour: 13, step: 60, navigation: true
    }

    const payEvent = async (event) => {
        event.color = colors.green
        event.status = 'paid'
        setEvents([...(await addEvent(event, true))])
    }

    const approveEvent = async (event) => {
        event.color = colors.green
        event.status = 'approved'
        setEvents([...(await addEvent(event, true))])
    }

    const cancelEvent = async (event) => {
        event.color = colors.red
        event.status = 'cancelled'
        setEvents([...(await addEvent(event, true))])
    }

    const rescheduleEvent = async (event) => {
        event.color = colors.orange
        event.status = 'rescheduled'
        setEvents([...(await addEvent(event, true))])
    }

    const delEvent = async (event) => {
        setEvents(await deleteEvent(event))
    }

    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    }

    useEffect( () => {
        getEvents(setEvents)
    },[0])


    const getTotal = (viewMode) => {
        if(viewMode=='month'){      
            setDayTotalElement([])
        }else if(viewMode=='week') {
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let day = parseInt(dateString.split(' ')[0])
            let end = parseInt(dateString.split(' ')[2].split('<')[0])
            let month = getMonthFromString(dateString.split(' ')[3]) - 1
            let year = parseInt(dateString.split(' ')[4].split('<')[0])
            let dayTotalElems = [];
            if(day>end){
                month=month-1
            }
            for (let i = 0; i < 7; i++) {
                dayTotalElems.push(dayTotal[new Date((year), (month), (day) + i).toDateString()])
            }
            setDayTotalElement(dayTotalElems)
        }else if(viewMode=='day'){
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let day = parseInt(dateString.split(' ')[0])
            let month = getMonthFromString(dateString.split(' ')[1]) - 1
            let year = parseInt(dateString.split(' ')[2].split('<')[0])
            let dayTotalElems = [];
            dayTotalElems.push(dayTotal[new Date((year), (month), (day)).toDateString()])
            setDayTotalElement(dayTotalElems)
        }
    }

    const getEventsByDate=(viewMode)=>{
        if(viewMode=='month'){
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let month = getMonthFromString(dateString.split(' ')[0]) - 1
            let year = parseInt(dateString.split(' ')[1].split('<')[0])
            let startDateTime = new Date((year), (month-1), 25)
            let endDateTime = new Date((year), (month) + 1, 0)
            console.log(month, year, startDateTime, endDateTime)
            getEventsByDateRange(startDateTime, endDateTime, setEvents)
        }else if(viewMode=='week') {
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let day = parseInt(dateString.split(' ')[0])
            let end = parseInt(dateString.split(' ')[2].split('<')[0])
            let month = getMonthFromString(dateString.split(' ')[3]) - 1
            let year = parseInt(dateString.split(' ')[4].split('<')[0])
            if(day>end){
                month=month-1
            }
            let startDateTime = new Date((year), (month), (day))
            let endDateTime = new Date((year), (month), (day) + 7)
            getEventsByDateRange(startDateTime, endDateTime, setEvents)
        }else if(viewMode=='day'){
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let day = parseInt(dateString.split(' ')[0])
            let month = getMonthFromString(dateString.split(' ')[1]) - 1
            let year = parseInt(dateString.split(' ')[2].split('<')[0])
            let startDateTime = new Date((year), (month), (day))
            let endDateTime = new Date((year), (month), (day+1))
            getEventsByDateRange(startDateTime, endDateTime, setEvents)
        }
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useEffect(()=>{
        let dt = calculateDayTotal(events)
        setDayTotal(dt)
    },[events])

    useInterval(() => {
        getTotal(view)
        getEventsByDate(view)
        setWidth(document.querySelectorAll(".rs__cell.rs__time")[0].offsetWidth)
        setSecondWidth(document.querySelectorAll(".rs__cell>button")[0].offsetWidth)
        setMobileWidth(document.querySelectorAll(".rs__cell>button")[0]?document.querySelectorAll(".rs__cell>button")[0].offsetWidth:0)
    }, 500);

    function formatToCurrency(amount){
        return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    return (
        <div style={{margin:20}} id="calendar">
            <Scheduler
                month={month}
                week={week}
                day={day}
                onDelete={(event) => {delEvent(event)}}
                customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                view="week"
                onViewChange={(view) => console.log('View : ',view)}
                onEventDrop={
                        async (droppedOn, updatedEvent, event) => {
                            await addEvent(updatedEvent,true)
                            return updatedEvent
                        }
                }
                viewerExtraComponent={(fields, event) => {
                    const role = localStorage.getItem('Role');
                    return (<div>
                        <div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <p style={{display:'inline',marginBottom:'0px'}}>Company Name: {event.company} </p>
                                <BeenhereIcon sx={{display:event.status=='paid'?'flex':'none'}} size='large'  fontSize="large" color='primary'></BeenhereIcon>
                            </div>
                            <p>{formatToCurrency(event.payment)} {event.currency=='EUR'?'€':event.currency=='USD'?'$':'₣'}</p>
                            <p>Bank: {event.bank}</p>
                        </div>
                        <div style={{display:'flex', justifyContent:'stretch',gap:'5px' ,marginBottom:'10px'}}>
                            <Button sx={{width:'50%'}} disabled={event.status=='cancelled'||event.status=='paid' || role=='Employee'?true:false} variant="outlined" type="button" color="success"
                                onClick={() => {approveEvent(event)}}
                            >Approve</Button>
                            <Button sx={{width:'50%'}} disabled={(event.status=='pending' || event.status=='rescheduled')&& role!='Employee'?false:true} variant="outlined" type="button" color="warning"
                                    onClick={() => {rescheduleEvent(event)}}
                            >Reschedule</Button>
                            <Button sx={{width:'50%'}} disabled={event.status=='approved'||event.status=='paid'|| role=='Employee'?true:false} variant="outlined" type="button" color="error"
                                onClick={() => {cancelEvent(event)}}
                            >Cancel</Button>
                        </div>
                        <Button fullWidth disabled={event.status!='approved' && event.status!='paid'?true:false} variant="contained" type="button" color="primary"
                                onClick={() => {payEvent(event)}}
                        >{event.status=='paid'?'Paid':'Pay'}</Button>
                    </div>);
                }}
                eventRenderer={(event) => {
                    return (
                        <div className="event-render" style={{color:'black',textAlign:'left'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <h3 style={{display:'inline',marginBottom:'0px'}}>{event.company} </h3>
                                <BeenhereIcon sx={{display:event.status=='paid'?'flex':'none'}} size='small' color='primary'></BeenhereIcon>
                            </div>
                            <h3 style={{marginBottom:0}}>{formatToCurrency(event.payment)} {event.currency=='EUR'?'€':event.currency=='USD'?'$':'₣'}</h3>
                            <h3 style={{marginBottom:0}}>{event.bank}</h3>
                        </div>
                    );
                }}
            />
            <Stack direction="row" sx={{ flexWrap: 'wrap',gap:'1px' ,display:view!=='day'?{xs:'none',md:'flex'}:'' }}>
                {view!=='month'?<Paper sx={{width: `${width-2}px`, fontWeight:'bold' , backgroundColor:'#29AB87', textAlign: 'center', paddingTop: '10px',paddingLeft:'10px',display:{xs:'none',md:'flex'}}}>Total :</Paper>:null}
                {
                    dayTotalElement?dayTotalElement.map((date) => {
                        return (
                            <>
                                <Paper sx={{width:`${secondWidth}px`, padding:'10px' , fontWeight:'bold' , backgroundColor:'#29AB87',display:{xs:'none',md:'flex'}}}>{date?formatToCurrency(date):'0'}</Paper>
                                <Paper sx={{width:`${width+mobileWidth}px`, padding:'10px' , fontWeight:'bold' , backgroundColor:'#29AB87',display:{xs:'flex',md:'none'}}}>Total: {date?formatToCurrency(date):'0'}</Paper>
                            </>
                        )
                    }):null
                }
            </Stack>
        </div>
    )
}