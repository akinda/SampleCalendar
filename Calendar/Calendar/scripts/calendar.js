
var calendarModule = (function ($, ko) {

    //Knockout Models
    function Appointment(data) {
        var self = this;
        self.id = data.id;
        self.startTime = data.startTime;
        self.endTime = data.endTime;
        self.message = data.message;
        self.date = data.date;
    }

    //Knockout View Models
    function calendarViewModel() {

        //////  DATA  //////
        var self = this;
        self.selectedDate = ko.observable("");
        self.appointmentsForDay = ko.observableArray([]);
        self.openTimeSlotsForDay = ko.observableArray([]);
        self.timeBlockIncrements = 1000 * 3600; //1 hour
        self.currentDateUTCString = "";
        self.dateIsPast = ko.observable(false);
        self.editClickedItem = ko.observable({});
        self.editStagingDate = "";
        self.itemId = ko.computed(function () {
            return self.editClickedItem().id;
        }, self);
        
        //////  HELPERS  ////////
        self.getAppointments = () => {
            //Load appointments for current date
            fetchAppointments(`http://localhost:5000/appts/by_date/${Date.parse(self.currentDateUTCString)}`)
                .then(function (response) {
                    if (response.isSuccess) {
                        //parse start and calculate end time assuming blocks of 1 hour each
                        let mappedData = self.getDateBlocks(response.data);
                        self.appointmentsForDay(mappedData);
                    } else {
                        self.appointmentsForDay([]);
                    }
                    //Updated available time slots for the day
                    self.getAvailableTimeSlots();
            });
        }

        self.getDateBlocks = (data) => {
            //parse start and calculate end time assuming blocks of 1 hour each
            let mappedData = data.map(x => {
                return {
                    id: x.id,
                    message: x.message,
                    startTime: moment(parseInt(x.date)).format('hh mm A'),
                    endTime: moment((parseInt(x.date) + self.timeBlockIncrements)).format('hh mm A'),
                    date: parseInt(x.date)
                };
            });
            return mappedData;
        }

        self.getOpenDateBlocks = (data) => {
            //parse start and calculate end time assuming blocks of 1 hour each
            let mappedData = data.map(x => {
                return {
                    id: null,
                    message: null,
                    startTime: moment(parseInt(x)).format('hh mm A'),
                    endTime: moment((parseInt(x) + self.timeBlockIncrements)).format('hh mm A'),
                    date: parseInt(x)
                };
            });
            return mappedData;
        }

        self.showAddAppointments = () => {
            if (self.dateIsPast == true) {                
                $("#addAppt").hide();
            } else {
                $("#addAppt").show();
            }
        }

        self.isDatePast = (date) => {
            var now = moment.utc();
            var nowInteger = now.toDate().getTime();
            let result = date < nowInteger ? true : false;
            return result;
        }

        self.getAvailableTimeSlots = () => {

            //console.log(`Selected date is: ${self.selectedDate}`);
            //console.log(`Date string is ${self.currentDateUTCString}`);
            //console.log(`Time from Date String is ${Date.parse(self.currentDateUTCString)}`);

            //calculate all time slots
            let timeAtStart = parseInt(Date.parse(self.currentDateUTCString))
            //console.log(`Time at start is ${timeAtStart}`);
            let allSlots = [];
            let initTime = timeAtStart;
            for (let i = 0; i < 24; i++) {
                allSlots.push(initTime);
                initTime += self.timeBlockIncrements; //increment by an hour
            }
            //console.log(allSlots);

            //remove time slots that are already taken
            let scheduledAppointments = self.appointmentsForDay();
            for (let i = 0; i < scheduledAppointments.length; i++) {                                
                let temp = scheduledAppointments[i].date;
                //console.log(temp);
                let index = allSlots.indexOf(temp);
                if ( index != -1) {
                    //remove item from available slots
                    allSlots.splice(index, 1);
                }
            }
            //console.log(allSlots.length);
            //console.log(allSlots);

            let mappedData = self.getOpenDateBlocks(allSlots);
            console.log(mappedData);
            self.openTimeSlotsForDay(mappedData);
            console.log(`Open time slots for day is ${self.openTimeSlotsForDay()} with length of ${self.openTimeSlotsForDay().length}`);
        }

        //////  EVENT HANDLERS  ////////
        self.dateChanged = () => {
            //Get date
            let dateString = $("#datepicker").datepicker("getDate");                        
            
            //Show selected date string
            self.currentDateUTCString = new Date(dateString.toUTCString()).toISOString();
            self.selectedDate = new Date(self.currentDateUTCString).toDateString();
            $("#selectedDate").text(self.selectedDate);

            //get appointments
            self.getAppointments();

            //update whether date is in the past            
            let time = Date.parse(self.currentDateUTCString);            
            self.dateIsPast = self.isDatePast(time);
            console.log(`past is ${self.dateIsPast}`);

            //Hide controls for adding new appointments if date in past
            self.showAddAppointments();

            //Updated clicked item
            self.editClickedItem({});            
        }

        self.newSlotClicked = (item) => {
            console.log(`new slot selected with time of ${item.startTime} and date of ${item.date}`);

            //update selection of date
            self.editStagingDate = item;

            //make button stay highlighted
            $(".timeSlot").removeClass("active");

            let fullTime = item.startTime + " - " + item.endTime;

            let found = -1;
            let allTimeBlocks = $(".timeSlot");
            for (let i = 0; i < allTimeBlocks.length; i++) {
                if (allTimeBlocks[i].innerText == fullTime) {
                    found = i;
                }
            }
            $(allTimeBlocks[found]).addClass("active");            
        }

        self.saveUpdatedAppointmentClicked = () => {
            console.log("Save appointment called");
            console.log("id needed is: " + self.itemId());
            console.log("message is " + self.editClickedItem().message);
            console.log("date needed is " + self.editStagingDate.date);
            
            let data = {
                id: self.itemId(),
                message: $("#newMessage").val(),
                date: self.editStagingDate.date
            };

            if (data.id == -1) {
                if (!data.date) {
                    alert("Choosing a time is required for saving new appointment");
                    return;
                }
                //save new appointment 
                //save data to back-end
                fetch(`http://localhost:5000/appts/`, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        date: data.date,
                        message: data.message
                    })
                }).then(res => {
                    console.log("Save appointment changes successful");

                    //hide eidt panel
                    self.closeEditBoxClicked();

                    //get appointments
                    self.getAppointments();
                }).catch(error => alert(error.message));
            } else {
                //We are editing

                //Make sure edit 
                if (!self.editStagingDate) {
                    data.date = self.editClickedItem().date;
                }

                //save data to back-end
                fetch(`http://localhost:5000/appts/${data.id}`, {
                    method: "PUT",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(res => {
                    console.log("Save appointment changes successful");

                    //hide eidt panel
                    self.closeEditBoxClicked();

                    //get appointments
                    self.getAppointments();
                }).catch(error => alert(error.message));
            }
        }

        self.closeEditBoxClicked = () => {
            //hided eidt panel            
            self.editClickedItem({});
            self.editStagingDate = "";
            $("#newMessage").val("");
            $(".timeSlot").removeClass("active");
        }

        self.editAppointmentClicked = (item) => {
            console.log("Edit appointment clicked");
            console.log(item);
            self.editClickedItem(item);
        }

        self.newAppointmentClicked = () => {
            console.log("New appointment clicked");
            //console.log(item);
            self.editClickedItem({
                id: -1,
                message: null,                
            });
        }



        $("#datepicker").datepicker({
            onSelect: function (dateText, input) {
                //console.log(`Selected date: ${dateText}; input's last value: ${input.lastVal} and new value is ${this.value}`);
                $(this).change();
            }
        });

        $("#datepicker").change(function () {
            self.dateChanged();
        });

        self.dateChanged();
    }


    // API Method Calls 
    function fetchAppointments(url) {
        var d = $.Deferred();
        var self = this;

        var request = $.ajax({
            url: url,
            type: "GET",
            dataType: "json",   //We're expecting a JSON response.
            cache: false
        });

        request.done(function (data, textStatus, jqXHR) {
            d.resolve(data);
        });

        request.fail(function (jqXHR, textStatus, errorThrown) {
            if (errorThrown != "abort") {
                alert("error fetching appointments for current day");
                console.log("[fetchAppointments] Error getting data from: " + url);
            }
            d.reject();
        });

        return d.promise();
    }

    // init
    function init() {
        //Activate Knockout.js
        ko.applyBindings(new calendarViewModel());
    }

    $(document).ready(function () {                        
        init();
    });


})(jQuery, ko);

