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
// const socket=io()
import {LoginButton} from './modules/loginbutton.js'
import {getCookie} from './modules/getCookie.js'

LoginButton()
const loationpara=document.querySelector('#locationpara')
document.querySelector('#SubmitDetails').addEventListener('click',async (e)=>{
    e.preventDefault()
    const email=document.querySelector('#EmailUser').value
    const password=document.querySelector('#Password').value
    // socket.emit('DetailSubmit',username,password)
    var data={email,password}
    // console.log(data)
    const response=await fetch('/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    })
    
    const final = response.json()
    // console.log(response.body)
    if(response.status==202){
        loationpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.New Account Created</p></div>"  
        location.replace('/')
        // console.log(response.status)
    }else{
        loationpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
    }
    // console.log()
})
// console.log('HI EVERYONE')

  //Sanitizing Input
  function sanitizeInput(element){
    // console.log(element.value)
    var str=element.value;
    str=str.replace(/(<([^>]+)>)/ig,"");
    // str=str.replace(/\/[a-z ]+|\/[A-Z]+|\/[^1-9]+/gim,"");
    str=str.replace(/[(=);]/ig,"");
    str=str.trim();
    element.value=str;
}