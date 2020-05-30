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
const loationpara=document.querySelector('#locationpara')
document.querySelector('#SubmitDetails').addEventListener('click',async (e)=>{
    e.preventDefault()
    const email=document.querySelector('#EmailUser').value
    const password=document.querySelector('#Password').value
    // socket.emit('DetailSubmit',username,password)
    var data={email,password}
    const response=await fetch('/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    })
    const final = response.json()
    if(response.status==202){
        location.replace('/')
    }
    // console.log()
})
// console.log('HI EVERYONE')


