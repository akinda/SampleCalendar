using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NodaTime;
using System.Globalization;

namespace Calendar.Models
{
    public class ApptModel
    {
        /// <summary>  
        /// datetime data type property to display date type control  
        /// </summary>  
        [Display(Name = "Appointment Date")]        
        [DisplayFormat(DataFormatString = "{0:dd-MMM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime AppointmentDate { get; set; }

        /// <summary>  
        /// List of Appointments
        /// </summary>  
        public AppointmentData Appointments { get; set; }

        /// <summary>  
        /// Method to determine if the current date selected is past or not        
        /// </summary>  
        public bool isPast()
        {
            var now = DateTime.UtcNow;
            var instant = Instant.FromDateTimeUtc(now);
            var unixTimeNow = instant.ToUnixTimeMilliseconds();

            var dateInput = new DateTime(AppointmentDate.Year, AppointmentDate.Month, AppointmentDate.Day, 0, 0, 0);
            var instantInput = Instant.FromDateTimeUtc(dateInput.ToUniversalTime());
            var currentUnixTime = instantInput.ToUnixTimeMilliseconds();

            return currentUnixTime < unixTimeNow ? true : false;
        }
    }

    public class Appointment
    {
        public int id { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
        public String date { get; set; }
        public String message { get; set; }        
    }

    public class AppointmentData
    {
        public List<Appointment> data { get; set; }
    }
}