// fetch('http://localhost:3000/weathr?address=!').then((response)=>{
//   response.json().then((data)=>{
//       if(data.error){
//           console.log(data.error)
//       }
//       else{
//           console.log(data.location)
//           console.log(data.forecast)
//       }
//   })
// })
import {getCookie} from './modules/getCookie.js'
const socket=io()
const weatherForm=document.querySelector('#loacationsearchform')
const search=document.querySelector('#inputLocation')
const loationpara=document.querySelector('#locationpara')
const currentpara=document.querySelector('#currentpara')
const forecastpara=document.querySelector('#forecastpara')
const datepara=document.querySelector('#datepara')
const datalist=document.querySelector('#Autocompleter')
const acceptedDisclaimer = document.querySelector('#CookieDisclaimerAccepted')
const mapShower= document.querySelector('#mapShower')

mapShower.addEventListener('click',(e)=>{
    e.preventDefault()
    document.querySelector('#map').style.display=''
})

//#########################################################
//Google map suuport starts here
var latitude=0,longitude=0,accuracy;
if(!navigator.geolocation){
    alert('Geolocation is not supportted by your browser')
  }
navigator.geolocation.watchPosition((position)=>{
    
    latitude=position.coords.latitude
    longitude=position.coords.longitude
    accuracy=position.coords.accuracy
    initMap()
    // console.log(latitude,longitude)
  })


var markers = [];
var map;
function initMap() {
  // console.log(latitude,longitude)
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: latitude,
      lng: longitude
      },
    zoom: 18
    });
  addMarker({
      lat: latitude,
      lng: longitude
      });
  map.addListener("click", function(event) {
    addMarker(event.latLng);
  });
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
var marker = new google.maps.Marker({
  position: location,
  map: map
});
deleteMarkers()
markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(map);
}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
clearMarkers();
markers = [];
}

//Google maps support ends here
//################################################################
//weather form support starts here

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    // console.log('SEcond')
    const location =search.value
    loationpara.textContent='Loading...'
    currentpara.textContent=''
    forecastpara.textContent=''
    document.getElementById('imageBox').src ='';
    fetch('/weather?address='+location).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                loationpara.innerHTML="<div style=\"z-index: 0\" class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Location Not Found.Try Another Search</p></div>"  
                currentpara.textContent=''
                forecastpara.textContent=''
            }
            else{
                let isday=data.is_day
                var d = new Date(data.timestamp*1000);
                var weekday = new Array(7);
                weekday[0] = "Sunday";
                weekday[1] = "Monday";
                weekday[2] = "Tuesday";
                weekday[3] = "Wednesday";
                weekday[4] = "Thursday";
                weekday[5] = "Friday";
                weekday[6] = "Saturday";
                var date =d.getDate() +'-'+(d.getMonth()+1)+'-'+d.getFullYear();
                var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                var dateTime = date+' '+time;
                var n = weekday[d.getDay()];
                loationpara.textContent='Location : '+data.location+'\n'+n + '(Last Updated : '+ dateTime+')\n'+data.current_text ;
                if(isday===1){
                    currentpara.textContent='Current Temp(in C): '+(data.current_temp-2)+"\nFeels like : " + data.feelslike_c
                    document.getElementById('imageBox').src = data.icon;
                }
                else{
                    currentpara.textContent='Current Temp(in C): '+(data.current_temp)+"\nFeels like : " + data.feelslike_c 
                   document.getElementById('imageBox').src = data.icon;
                }
                forecastpara.textContent='Today\'s forecast : '+data.forecast
            }
        })
     })
})

search.addEventListener('keyup',async(e)=>{
    datalist.innerHTML=''
    if(search.value){
        socket.emit('getoptions',search.value,(results)=>{
            results.forEach((element) => {
                datalist.innerHTML+=`<option>${element.location}</option>`
            });
        })
    }
})

var isacceptedDisclaimer = gettingCookie("isacceptedDisclaimer");
if(isacceptedDisclaimer==""){
    // console.log("Not set")
    document.querySelector('#CookieDisclaimer').style.display=''
}
acceptedDisclaimer.addEventListener('click',(e)=>{
    e.preventDefault()
    console.log('already set')
    settingCookie('isacceptedDisclaimer','true',7)
    document.querySelector('#CookieDisclaimer').style.display='none'
})

function sanitizeInput(element){
  // console.log(element.value)
  var str=element.value;
  str=str.replace(/(<([^>]+)>)/ig,"");
  // str=str.replace(/\/[a-z ]+|\/[A-Z]+|\/[^1-9]+/gim,"");
  str=str.replace(/[(=);]/ig,"");
  str=str.trim();
  element.value=str;
}

function settingCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function gettingCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }