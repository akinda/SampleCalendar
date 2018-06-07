const loki = require('lokijs'),
    moment = require("moment"),
    db = new loki('loki_db.json', {
        autoload: true,
        autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 4000 // save every four seconds for our example
    });

//Create appointment collection as needed
function databaseInitialize() {
    //get collection
    let appointmentColl = db.getCollection("appointments");

    if(appointmentColl == null){

        console.log("Database init started...");

        appointmentColl = db.addCollection("appointments");

        let moment1 = moment().utc();
        moment1.set('year', 2018); //2018
        moment1.set('month', 5);  // June
        moment1.set('date', 6); //6th
        moment1.set('hour', 8);
        moment1.set('minute', 0);
        moment1.set('second', 0);
        moment1.set('millisecond', 0);

        //Create integer dates from the date above
        let date1 = parseInt(moment1.toDate().getTime());   //same     
        let date2 = date1 + (1000 * 3600 * 24 * 7);   // +1 hour + 7 days        
        let date3 = date2 + (1000 * 3600 * 3);   // + 3 hours + 4 days        
        
        let appointments = [
            {
                date: date1,
                message: "Appointment with Cacy Carter"
            }, {                
                date: date2,
                message: "Appointment with Rochelle Williams"
            }, {                
                date: date3,
                message: "Appointment with Amber Rose"
            }];
        
        appointments.forEach((item) => {
            appointmentColl.insert(item);
        });
        
        db.saveDatabase();

        console.log("Database init complete ...");
    }

    //Log number of entries in db collection
    console.log(`Appointments Collection has ${appointmentColl.data.length} items`);
}

//Export
module.exports = db;
