## Description

To run navigate to the folder - Calendar - and open the project with Visual Studio

#Various versions of the UI
- There are 2 routes
  - http://localhost:{$port}/Calendar/Index - This version of the front-end is built with Knockout only and is complete
  - http://localhost:{$port}/NewCalendar/Index - This version of the front-end is built with Razor / C# only and is not complete
    - Enough was done to show understanding of MVC/Razor
    - What wasn't completed is Add / Edit pages, but I was going to give those pretty much the same UI as was created originally, and use JS or Knockout for an easy-to-use UI

#Important Notes
- Project is of type MVC 5 created with Visual Studio 2015
- All relevant code is in calendar.js and Index.cstml
- Move hard-coded URLs to 1 place in file, and subsequently into the web.config

#Future Improvements
- Use Bundling to shrink size of css and js      
- Use external style sheet
- Unit Testing 
- Fix known bugs
  - Past logic not 100% correct
