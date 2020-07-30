var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
fetch("https://api.covid19api.com/summary", requestOptions)
    .then(response => response.json())
    .then((result) => {
     const global = result.Global
     const countries = result.Countries
     document.querySelector('#covid19Global').innerHTML=`<div class="uk-width-1-2@m uk-width-1-2@s uk-width-1-1 uk-text-center"><div class="uk-card uk-card-default"><div class="uk-card-body"><h3 class="uk-card-title"><strong>Global</strong></h3><p>New Confirmed Cases : +${global.NewConfirmed},<br><span  style="color:green;">New Recovered Cases : +${global.NewRecovered} </span> ,<br><span  style="color:red;">New Deaths : +${global.NewDeaths} </span> <br></p><p>Total Confirmed Cases : ${global.TotalConfirmed} ,<br><span  style="color:green;"> Total Recovered : ${global.TotalRecovered} </span>,<br> Total Deaths : ${global.TotalDeaths} <br></p></div></div></div>`
    //  console.log(global)
     count=1;
     formatedText=`<table class="uk-table uk-table-hover">
                            <caption><h3>Covid-19 Tally</h3></caption>
                            <thead>
                                <tr>
                                    <th class="uk-text-center">#</th>
                                    <th class="uk-text-center">Country</th>
                                    <th class="uk-table-shrink">Total Confirmed</th>
                                    <th class="uk-table-shrink">New Confirmed</th>
                                    <th class="uk-table-shrink">TotalDeaths</th>
                                    <th class="uk-table-shrink">New Deaths</th>
                                    <th class="uk-table-shrink">TotalRecovered</th>
                                    <th class="uk-table-shrink">NewRecovered</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td class="uk-text-right">Total =</td>
                                    <td class="uk-text-right">${global.TotalConfirmed}</td>
                                    <td class="uk-text-right" style="background-color:#FFEB3B; color: black">+${global.NewConfirmed}</td>
                                    <td class="uk-text-right">${global.TotalDeaths}</td>
                                    <td class="uk-text-right" style="background-color:#D32F2F; color: white">+${global.NewDeaths}</td>
                                    <td class="uk-text-right">${global.TotalRecovered}</td>
                                    <td class="uk-text-right" style="background-color:#8BC34A; color: black">+${global.NewRecovered}</td>
                                    <td>-</td>
                                </tr>
                            </tfoot>
                        <tbody>`
     countries.forEach(function(country, index) {
        countr=country.Country;
        NewConfirmed=country.NewConfirmed;
        TotalConfirmed = country.TotalConfirmed;
        NewDeaths = country.NewDeaths;
        TotalDeaths=country.TotalDeaths;
        NewRecovered=country.NewRecovered;
        TotalRecovered=country.TotalRecovered;
        date=country.Date
        formatedText +=`<tr>
                            <td class="uk-text-center">${count}</td>
                            <td class="uk-text-center"><a href="#">${countr}</a></td>
                            <td class="uk-text-right">${TotalConfirmed}</td>`
        if(NewConfirmed==0)
            formatedText +=`<td class="uk-text-right"></td>`
        else
            formatedText +=`<td style="background-color:#FFF9C4; color: black" class="uk-text-right">+${NewConfirmed}</td>`
        formatedText +=`<td class="uk-text-right">${TotalDeaths}</td>`
        if(NewDeaths==0)
            formatedText +=`<td class="uk-text-right"></td>`
        else
            formatedText +=`<td style="background-color:#FFCDD2; color: black" class="uk-text-right">+${NewDeaths}</td>`
        formatedText +=`<td class="uk-text-right">${TotalRecovered}</td>`
        if(NewRecovered==0)
            formatedText +=`<td class="uk-text-right"></td>`
        else
            formatedText +=`<td style="background-color:#DCEDC8; color: black" class="uk-text-right">+${NewRecovered}</td>`
        formatedText +=`<td>${date}</td>
                        </tr>`
        count=count+1;
      //   formatedText += "<div class='dish-image-div'><a " + " href='" + href + "' target='_blank'><img class='dish-image' style='inline' width='80' src='" + thumbnail + "' alt='recipe picture, link to recipe page'></a></div>";
      //   formatedText += "<div " + "class='dish-title-div'><a href='" + href + "' target='_blank'>" + recipe.title + "</a></div>";
      //   formatedText += "<div class='dish-ingredients-div'>Cooking Time: " + recipe.readyInMinutes + "</div>"; 
    });
    formatedText+=`</tbody></table>`
    document.querySelector('#covid19Data').innerHTML=formatedText;
    // console.log(countries)
})
.catch(error => console.log('error', error));
    