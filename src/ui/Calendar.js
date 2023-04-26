import {Scheduler,useScheduler} from "@aldabil/react-scheduler";
import React, {Fragment, useEffect, useState} from "react";
import {CustomEditor} from "./CustomEditor";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import {addEvent, calculateDayTotal, deleteEvent, getEvents} from "../services/services";
import {Paper, Stack} from "@mui/material";

export const Calendar = () => {

    const {events,setEvents} = useScheduler();
    const [dayTotal,setDayTotal] = useState({})
    const [width, setWidth] = React.useState(0);
    const [secondWidth, setSecondWidth] = React.useState(0);
    const [dayTotalElement, setDayTotalElement] = React.useState(null);

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
        disableGoToDay: false
    }

    const week = {
        weekDays: [0, 1, 2, 3, 4, 5, 6], weekStartOn: 1, startHour: 7, endHour: 13, step: 60,  navigation: true,
    }

    const day = {
        startHour: 7, endHour: 13, step: 60, navigation: true
    }

    const approveEvent = async (event) => {
        event.color = colors.green
        setEvents([...(await addEvent(event, true))])
    }

    const cancelEvent = async (event) => {
        event.color = colors.red
        setEvents([...(await addEvent(event, true))])
    }

    const rescheduleEvent = async (event) => {
        event.color = colors.orange
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
        setWidth(document.querySelectorAll(".css-z3jy29 .rs__cell.rs__time")[0].offsetWidth)
        setSecondWidth(document.querySelectorAll(".css-z3jy29 .rs__cell>button")[0].offsetWidth)


    },[0])

    const getTotal = () => {
        let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
        let day = parseInt(dateString.split(' ')[0])
        let month = getMonthFromString(dateString.split(' ')[3])-1
        let year = parseInt(dateString.split(' ')[4].split('<')[0])
        let dayTotalElems = [];
        for(let i = 0; i < 7; i++){
            dayTotalElems.push(dayTotal[new Date((year),(month),(day)+i).toDateString()])
        }
        console.log(dayTotal)
        setDayTotalElement(dayTotalElems)
    }

    useEffect(()=>{
        let dt = calculateDayTotal(events)
        setDayTotal(dt)
    },[events])

    useEffect(()=>{
        const interval = setInterval(() => getTotal(), 500);
        return () => {
            clearInterval(interval);
        };
    },[dayTotal])

    return (
        <Container maxWidth="xl">
            <Scheduler
                month={month}
                week={week}
                day={day}
                onDelete={(event) => {delEvent(event)}}
                customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                view="week"
                onEventDrop={
                        async (droppedOn, updatedEvent, event) => {
                            await addEvent(updatedEvent,true)
                            return updatedEvent
                        }
                }
                viewerExtraComponent={(fields, event) => {
                    return (<div>
                        <div>
                            <p>Company Name: {event.company} </p>
                            <p>{event.payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p>Bank: {event.bank}</p>
                        </div>
                        <div style={{display:'flex', justifyContent:'stretch',gap:'5px' ,marginBottom:'10px'}}>
                            <Button sx={{width:'50%'}} variant="outlined" type="button"
                                onClick={() => {approveEvent(event)}}
                            >Approve</Button>
                            <Button sx={{width:'50%'}} variant="outlined" type="button" color="error"
                                onClick={() => {cancelEvent(event)}}
                            >Cancel</Button>
                            <Button sx={{width:'50%'}} variant="outlined" type="button" color="warning"
                                    onClick={() => {rescheduleEvent(event)}}
                            >Reschedule</Button>
                        </div>
                    </div>);
                }}
                eventRenderer={(event) => {
                    return (
                        <div className="event-render" style={{color:'black',textAlign:'left'}}>
                            <h3>{event.company} </h3>
                            <h3>{event.payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €</h3>
                            <h3>{event.bank}</h3>
                        </div>
                    );
                }}
            />
            <Stack direction="row">
                <Paper sx={{width:`${width}px`}}></Paper>
                {
                    dayTotalElement?dayTotalElement.map((date) => {
                        return (
                            <Paper sx={{width:`${secondWidth}px` , padding:'10px'}}>{date?date.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):'0'}</Paper>
                        )
                    }):null
                }
                {/*<Paper sx={{width:`${secondWidth}px`}}>{dayTotal[new Date().toDateString()]}</Paper>*/}
                {/*<Paper sx={{width:`${secondWidth}px`}}>Item 1</Paper>*/}
                {/*<Paper sx={{width:`${secondWidth}px`}}>Item 1</Paper>*/}
            </Stack>
        </Container>
    )
}