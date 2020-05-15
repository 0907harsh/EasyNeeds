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

const weatherForm=document.querySelector('form')
const search=document.querySelector('input')
const loationpara=document.querySelector('#locationpara')
const currentpara=document.querySelector('#currentpara')
const forecastpara=document.querySelector('#forecastpara')
const datepara=document.querySelector('#datepara')


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
                var d = new Date();
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
                loationpara.textContent='Location : '+data.location+'\n'+n+'\n'+data.current_text;
                if(isday===1){
                    currentpara.textContent='Current Temp(in Celcius): '+(data.current_temp-2)+"\nFeels like : " + data.feelslike_c 
                    document.getElementById('imageBox').src = data.icon;
                }
                else{
                    currentpara.textContent='Current Temp(in Celcius): '+(data.current_temp+2)+"\nFeels like : " + data.feelslike_c 
                   document.getElementById('imageBox').src = data.icon;
                }
                forecastpara.textContent='Today\'s forecast : '+data.forecast.forecastday[0].day.condition.text              
            }
        })
     })
    console.log(location)
})