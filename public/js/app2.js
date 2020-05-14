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



weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location =search.value
    loationpara.textContent='Loading'
    currentpara.textContent=''
    forecastpara.textContent='Please wait'
    fetch('weather?address='+location).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                loationpara.textContent=data.error
                currentpara.textContent=''
                forecastpara.textContent=''
            }
            else{
                loationpara.textContent='Location : '+data.location
                currentpara.textContent='Current Temp(in Celcius): '+data.current
                forecastpara.textContent=data.forecast.forecastday[0].day.condition.text              
            }
        })
     })
    console.log(location)
})