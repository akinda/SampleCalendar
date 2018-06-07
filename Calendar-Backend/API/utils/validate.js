let moment = require("moment");

let validateAppointmentForCreate = (appointment) => {
    let result = {};   
    
    if(!appointment){
        result.isSuccess = false;
        result.message = "Error: Appointment is missing";
        return result;
    }

    if(!appointment.date){
        result.isSuccess = false;
        result.message = "Error: Appointment date is missing";
        return result;
    }
     
    if(appointment && appointment.date){
        //Validate date is not in the past              
        let validateResult = validateDateNotPast(appointment.date) ?  true : false;
        result.isSuccess = validateResult;
        if(!validateResult)
            result.message = "Error: date is in the past and has to be in the future";
        return result;
    } 
};

let validateAppointmentForEdit = (appointment) => {    
    let result = {};

    if(!appointment){
        result.isSuccess = false;
        result.message = "Error: Appointment is missing";
        return result;
    }

    if(!appointment.id){
        result.isSuccess = false;
        result.message = "Error: Appointment id is missing";
        return result;
    }

    if(!appointment.date){
        result.isSuccess = false;
        result.message = "Error: Appointment date is missing";
        return result;
    }
    
    if(appointment && appointment.id && appointment.date){
        //Validate date is not in the past              
        let validateResult = validateDateNotPast(appointment.date) ?  true : false;
        result.isSuccess = validateResult;
        if(!validateResult)
            result.message = "Error: date is in the past and has to be in the future";
        return result;
    }
};

let validateDateNotPast = (date) => {
    var now = moment.utc();
    var nowInteger = now.toDate().getTime();
    let result = date < nowInteger ? false : true;
    return result;
}

//exports
exports.validateAppointmentForCreate = validateAppointmentForCreate;
exports.validateAppointmentForEdit = validateAppointmentForEdit;