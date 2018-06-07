'use strict';
require('dotenv').config();

const dal = require('../data/dal'),
    wrap = require("../utils/wrap"),
    moment = require('moment'),
    validator = require('../utils/validate');

//#region  Get
exports.getAllAppointments = () => {    
    console.log("In get all appointments");
    return dal.getAppointments();    
}

exports.getAppointmentByID = (id) => {
    console.log("In get appointment by ID");
    //First validate input
    if(id){
        return dal.getAppointmentByID(id);
    } else {
        return wrap.getEmptyResult("Error: Fetch existing appointment by id requires an id");
    }            
}

exports.getAppointmentByDate = (date) => {
    console.log("In get appointments by date");
    //First validate input
    if(date){
        return dal.getAppointmentByDate(date);
    } else {
        return wrap.getEmptyResult("Error: Fetch appointments by date requires a date");
    }
}
//#endregion

//#region Post
exports.addAppointment = (appointment) => {
    console.log("In add appointment");    
    //First validate input        
    let result = validator.validateAppointmentForCreate(appointment);
    if(result.isSuccess){
        return dal.addNewAppointment(appointment);
    } else {
        return wrap.getEmptyResult(result.message);
    }
}
//#endregion

//#region Put
exports.updateAppointment = (appointment) => {
    console.log("In update appointment");
    //First validate input
    let result = validator.validateAppointmentForEdit(appointment);
    if(result.isSuccess){
        return dal.updateAppointment(appointment);
    } else {
        return wrap.getEmptyResult(result.message);
    } 
}
//#endregion

