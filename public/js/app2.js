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
const forecastpara=document.querySelector('#forecastpara')



weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location =search.value
    loationpara.textContent='Loading'
    forecastpara.textContent='Please wait'
    fetch('weather?address='+location).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                loationpara.textContent=data.error
            }
            else{
                loationpara.textContent='Location'+data.location
                forecastpara.textContent=`Forecast<br/>Temp:`+sdata.forecast
            }
        })
     })
    console.log(location)
})