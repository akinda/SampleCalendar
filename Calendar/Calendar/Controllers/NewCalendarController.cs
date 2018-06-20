using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using Calendar.Models;
using Calendar.DataLayer;

using NodaTime;
using System.Globalization;

namespace Calendar.Controllers
{
    public class NewCalendarController : Controller
    {
        ApptModel model = new ApptModel();
        DAL dataLayer = new DAL();
        static HttpClient client = new HttpClient();

        // GET
        public async Task<ActionResult> Index()
        {
            //Set default appointment date to today
            model.AppointmentDate = DateTime.UtcNow;

            //Fetch appointments from API 
            model.Appointments = await GetAppointments(DateTime.UtcNow);

            //Return view with model included
            return View(model);
        }

        //POST
        [HttpPost]
        public async Task<ActionResult> Index(ApptModel input)
        {            
            if (input.AppointmentDate == null)
            {
                model.AppointmentDate = DateTime.Now;
            }

            else
            {
                model.AppointmentDate = input.AppointmentDate;
            }

            //Fetch appointments from API             
            model.Appointments = await GetAppointments(input.AppointmentDate);

            //return view with updated model
            return View(model);
        }

        #region helpers

        private async Task<AppointmentData> GetAppointments(DateTime temp)
        {            
            var date = new DateTime(temp.Year, temp.Month, temp.Day, 0, 0, 0);
            var instant = Instant.FromDateTimeUtc(date.ToUniversalTime());
            var unixTime = instant.ToUnixTimeMilliseconds();

            return await dataLayer.GetAppointmentsByDateAsync(unixTime);
        }

        public bool isPast(DateTime input)
        {
            var now = DateTime.UtcNow;            
            var instant = Instant.FromDateTimeUtc(now);
            var unixTimeNow = instant.ToUnixTimeMilliseconds();

            var dateInput = new DateTime(input.Year, input.Month, input.Day, 0, 0, 0);
            var instantInput = Instant.FromDateTimeUtc(dateInput.ToUniversalTime());
            var unixTimeInput = instantInput.ToUnixTimeMilliseconds();

            return unixTimeInput < unixTimeNow ? true : false;
        }
        #endregion

    }
}