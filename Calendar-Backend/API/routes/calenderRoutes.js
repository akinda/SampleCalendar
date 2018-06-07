'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/calendarController');

//#region  Get
router.get('/appts', function(req, res, next){
    let results = controller.getAllAppointments();
    res.json(results);       
});

router.get('/appts/:apptID', function(req, res, next){
    let apptID = req.params.apptID;
    let result = controller.getAppointmentByID(apptID);
    res.json(result);       
});

router.get('/appts/by_date/:date', function(req, res, next){    
    let date = req.params.date;
    let results = controller.getAppointmentByDate(date);
    res.json(results);       
});
//#endregion

//#region Post
router.post('/appts', function(req, res, next){      
    let result = controller.addAppointment(req.body);
    res.json(result);
});
//#endregion

//#region Put
router.put('/appts/:apptID', function(req, res, next){
    let result = controller.updateAppointment(req.body);
    res.json(result);
});
//#endregion

module.exports = router;