using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Web.Script.Serialization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using NodaTime;
using System.Globalization;

using Calendar.Models;

namespace Calendar.DataLayer
{
    public class DAL
    {      
        HttpClient client = new HttpClient();

        public DAL()
        {
            client.BaseAddress = new Uri("http://localhost:5000/appts/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }        

        public async Task<AppointmentData> GetAllAppointmentsAsync(string path = "")
        {            
            AppointmentData appts = null;
            HttpResponseMessage response = await client.GetAsync(path);
            if (response.IsSuccessStatusCode)
            {
                string result = response.Content.ReadAsStringAsync().Result;
                var JSONObj = new JavaScriptSerializer().Deserialize<AppointmentData>(result);
                appts = JSONObj;                
            }

            //Update start time and end time in each appointment
            return UpdateStartEndTimes(appts);
        }


        public async Task<AppointmentData> GetAppointmentsByDateAsync(long milliseconds, string path = "by_date/")
        {
            AppointmentData appts = null;
            HttpResponseMessage response = await client.GetAsync(path + milliseconds.ToString());
            if (response.IsSuccessStatusCode)
            {
                string result = response.Content.ReadAsStringAsync().Result;
                var JSONObj = new JavaScriptSerializer().Deserialize<AppointmentData>(result);
                appts = JSONObj;
            }

            //Update start time and end time in each appointment
            return UpdateStartEndTimes(appts);
        }

        #region Helpers
        
        private AppointmentData UpdateStartEndTimes(AppointmentData input)
        {
            //Update start time and end time in each appointment
            foreach (Appointment appointment in input.data)
            {
                Duration duration = Duration.FromHours(1);
                Instant startTime = Instant.FromUnixTimeMilliseconds(Convert.ToInt64(appointment.date));
                Instant endTime = startTime + duration;
                var timeZone = DateTimeZoneProviders.Tzdb["America/New_York"];
                appointment.startTime = startTime.InZone(timeZone).LocalDateTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);
                appointment.endTime = endTime.InZone(timeZone).LocalDateTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);
            }

            return input;
        }

        #endregion
    }
}