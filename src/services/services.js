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

    // setEvents(eventList);
    return eventList;
}

export const calculateDayTotal = (eventList)=>{
    const dayTotalPayments = {};
    eventList.forEach(event => {
        const date = event.start.toDateString();
        if (!dayTotalPayments[date]) {
            dayTotalPayments[date] = 0;
        }
        dayTotalPayments[date] += event.status!=='cancelled'?parseFloat(event.payment):0;
    });
    return dayTotalPayments;
}

export const getEventsByDateRange = (start,end,setEvents) => {
    let eventsFiltered = events.filter(event => event.start >= start && event.start <= end);
    setEvents(eventsFiltered);
}

export const signUp = async (user) => {
    try {
        const docRef = await setDoc(doc(db, "users",user.email), {
            email:user.email,
            firstName:user.firstName,
            secondName:user.secondName,
            role:user.role
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}



export const getEmp= async (emp) => {
    const docc = doc(db, "users", emp);
    const docSnap = await getDoc(docc);
    let findEmp = docSnap.data();
    return findEmp;
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
    clients = clientList.sort((a, b) => (a.order > b.order ? 1 : -1));
    setClients(clients);
}

export const addClient = async(client,toBeUpdated) => {


    const docRef = doc(db, "clients", client.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && toBeUpdated) {
        return null;
    } else {
        if(toBeUpdated){
            client.order=clients.length+1
        }
        await setDoc(doc(db, "clients", client.name), {
            // await setDoc(doc(db, "clients", client.uniqueNumber), {
            name: client.name,
            order: client.order,
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
            clients = clients.filter(c=> c.name !== client.name);
            clients.push(client)
        }else{
            clients.push(client);
        }
        return clients;
    }
}

export const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
    clients = clients.filter(client => client.name !== id);
    return clients;
}

export const addImageToClient = async (client,image)=>{
    const docRef = doc(db, "clients", client.name);
    const docSnap = await getDoc(docRef);
    await setDoc(doc(db, "clients", client.name), {
        ...client,
        images: [...client.images,image]
    });
    clients = clients.filter(c=> c.name !== client.name);
    client.images.push(image)
    clients.push(client)
    return client;
}

export const delImageFromClient = async (client,image)=>{
    const docRef = doc(db, "clients", client.name);
    client.images = client.images.filter(img=>img!=image)
    const docSnap = await getDoc(docRef);
    await setDoc(doc(db, "clients", client.name), {
        ...client,
        images: client.images
    });
    clients = clients.filter(c=> c.name !== client.name);
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
    setReports(eventList);
    return eventList;
}

export const deleteEmployee = async (employee) => {
    try {
        await deleteDoc(doc(db, "users", employee));
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const getAllEmployees = async (setRecords)=>{
    const querySnapshot = await getDocs(collection(db, "users"));
    let employees = [];
    querySnapshot.forEach((doc) => {
        employees.push({
            id:doc.id,
            ...(doc.data()),
        })
    });
    setRecords(employees)

}
