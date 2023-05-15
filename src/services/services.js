import { db } from "./firebase";
import { doc, setDoc, getDoc,deleteDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });
let clients = []
let events = []

// status types: pending, paid, cancelled, rescheduled

export const getEvents = async (setEvents) => {
    const eventSnapshot = await getDocs(collection(db, "events"));
    let eventList = eventSnapshot.docs.map(doc => doc.data());
    eventList = eventList.map(event => {
        return {
            ...event,
            start: (new Date(event.start.seconds * 1000)),
            end: new Date(event.end.seconds * 1000),
        }
    })
    events = eventList;

    setEvents(eventList);
    return eventList;
}

export const calculateDayTotal = (eventList)=>{
    const dayTotalPayments = {};
    eventList.forEach(event => {
        const date = event.start.toDateString();
        if (!dayTotalPayments[date]) {
            dayTotalPayments[date] = 0;
        }
        dayTotalPayments[date] += parseInt(event.payment);
    });
    return dayTotalPayments;
}

export const addEvent = async (event,toBeUpdated) => {
    if(!toBeUpdated) {
        event.event_id = uid();
        event.color = '#A9A9A9';
    }
    await setDoc(doc(db, "events", event.event_id), {
        event_id: event.event_id,
        title: event.company,
        start: event.start,
        end: event.end,
        company: event.company,
        bank: event.bank,
        payment: event.payment,
        color: event.color,
        currency: event.currency,
        status: event.status,
    });
    if(toBeUpdated){
        let temp_events = events.filter(e => e.event_id !== event.event_id);
        temp_events.push(event);
        events = temp_events
    }
    else
        events.push(event);
    return events;
}

export const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    events = events.filter(event => event.event_id !== id);
    return events;
}

export const getClients = async (setClients) => {
    const clientSnapshot = await getDocs(collection(db, "clients"));
    const clientList = clientSnapshot.docs.map(doc => doc.data());
    clients = clientList;
    console.log(clients)
    setClients(clientList);
}

export const addClient = async(client,toBeUpdated) => {


    const docRef = doc(db, "clients", client.uniqueNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && toBeUpdated) {
        return null;
    } else {

        await setDoc(doc(db, "clients", client.uniqueNumber), {

            name: client.name,
            vatNumber: client.vatNumber,
            uniqueNumber: client.uniqueNumber,
            phoneNumber: client.phoneNumber,
            email: client.email,
            country: client.country,
            currency: client.currency,
            bank: client.bank,
            iban: client.iban,
            swift: client.swift,
            images:[]

        });

        if(!toBeUpdated){
            //update client list
            clients = clients.filter(c=> c.uniqueNumber !== client.uniqueNumber);
            clients.push(client)
        }else{
            clients.push(client);
        }
        return clients;
    }
}

export const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
    clients = clients.filter(client => client.uniqueNumber !== id);
    return clients;
}

export const addImageToClient = async (client,image)=>{
    const docRef = doc(db, "clients", client.uniqueNumber);
    const docSnap = await getDoc(docRef);
    await setDoc(doc(db, "clients", client.uniqueNumber), {
        ...client,
        images: [...client.images,image]
    });
    clients = clients.filter(c=> c.uniqueNumber !== client.uniqueNumber);
    client.push(image)
    clients.push(client)
    return client;
}

export const delImageFromClient = async (client,image)=>{
    const docRef = doc(db, "clients", client.uniqueNumber);
    client.images = client.images.filter(img=>img!=image)
    const docSnap = await getDoc(docRef);
    await setDoc(doc(db, "clients", client.uniqueNumber), {
        ...client,
        images: client.images
    });
    clients = clients.filter(c=> c.uniqueNumber !== client.uniqueNumber);
    clients.push(client)
    return client;
}


export const getReports=async(setReports,timeRange,companyName,bankName,currency)=>{
    const eventSnapshot = await getDocs(collection(db, "events"));
    let eventList = eventSnapshot.docs.map(doc => doc.data());
    eventList = eventList.map(event => {
        return {
            ...event,
            start: (new Date(event.start.seconds * 1000)),
            end: new Date(event.end.seconds * 1000),
        }
    })
    events = eventList;
    console.log(eventList[0].start)
    setReports(eventList);
    return eventList;
}