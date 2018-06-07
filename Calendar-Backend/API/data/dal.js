'use strict';
require('dotenv').config();

const moment = require("moment"),
    wrap = require("../utils/wrap"),
    db = require('../data/loki_db');

let getCollection = () => {
    //get collection
    let appointmentsColl = db.getCollection("appointments");

    if(appointmentsColl === null){
        //init collection if null
        appointmentsColl = db.addCollection("appointments");
        console.log("DB Collection in controller was empty so initializing...");
    }

    return appointmentsColl;
}

//#region Gets
exports.getAppointments = () => {      
    let appointmentsColl = getCollection();    
    let appts = appointmentsColl.find();
    return wrap.wrapDataSuccess(appts);
}

exports.getAppointmentByID = (id) => {
    let appointmentsColl = getCollection();  
    let appts = appointmentsColl.get(id);
    if(appts){
        return wrap.wrapDataSuccess(appts);
    } else {
        return wrap.wrapDataFailure(appts, "Could not find the appointment");
    }           
}

exports.getAppointmentByDate = (date) => {        
    let appointmentsColl = getCollection();  
    //calc high date - as 24 hours from provided date
    var dateHigh = parseInt(date) + (1000 * 3600 * 24);
    console.log(`${dateHigh-1} is the high`);

    let appts = appointmentsColl.find({
        date: {
            '$between': [date, dateHigh-1] //includes dateHigh -1
        }
    });
    return wrap.wrapDataSuccess(appts);       
}
//#endregion

//#region Add
exports.addNewAppointment = (appointment) => {
    let appointmentsColl = getCollection();

    //Save to DB
    let appt = appointmentsColl.insert(appointment);
    if(appt){
        return wrap.wrapDataSuccess(appt);
    } else {
        return wrap.wrapDataFailure(appt, "Could not insert the new appointment");
    }    
}
//#endregion

//#region Update
exports.updateAppointment = (appointment) => {
    let appointmentsColl = getCollection();

    //Fetch appt by ID
    let temp = appointmentsColl.get(appointment.id);

    if(temp){
        temp.date = appointment.date;    
        temp.message = appointment.message;
        
        //Save to DB
        let appt = appointmentsColl.update(temp);
        return wrap.wrapDataSuccess(appt);
    } else {
        return wrap.wrapDataFailure(appt, "Could not find the appointment to update");
    }    
}
//#endregion

//#region Delete

//#endregion