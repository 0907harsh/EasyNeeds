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
const socket=io()
const weatherForm=document.querySelector('form')
const search=document.querySelector('input')
const loationpara=document.querySelector('#locationpara')
const currentpara=document.querySelector('#currentpara')
const forecastpara=document.querySelector('#forecastpara')
const datepara=document.querySelector('#datepara')

function getCookie(cname) {
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

//Hiding Login/SignUp buttons
socket.on('isLoggedIn',(isLoggedIn)=>{
    if(!isLoggedIn){
        // console.log('Why the hell')
        var all=document.getElementsByClassName('LoginPageButton')
        for (var i = 0; i <all.length; i++) {
            all[i].style.display = '';
          }
        all=document.getElementsByClassName('SignUpPageButton')
        for (var i = 0; i <all.length; i++) {
            all[i].style.display = '';
          }
        all=document.getElementsByClassName('MyProfilePageButton')
        for (var i = 0; i <all.length; i++) {
            all[i].style.display = 'none';
          }
    }
    if(isLoggedIn){
        var all=document.getElementsByClassName('LoginPageButton')
        for (var i = 0; i <all.length; i++) {
            all[i].style.display = 'none';
          }
        all=document.getElementsByClassName('SignUpPageButton')
        for (var i = 0; i <all.length; i++) {
            all[i].style.display = 'none';
          }
        all=document.getElementsByClassName('MyProfilePageButton')
        for (var i = 0; i <all.length; i++) {
            all[i].style.display = '';
          }
    }

})
weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location =search.value
    loationpara.textContent='Loading...'
    currentpara.textContent=''
    forecastpara.textContent=''
    document.getElementById('imageBox').src ='';
    fetch('weather?address='+location).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                loationpara.textContent=data.error
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

