
const loationpara=document.querySelector('#locationpara')
const age=document.querySelector('#AgeUser').style.width="40px"

document.querySelector('#SubmitDetails').addEventListener('click',async (e)=>{
    e.preventDefault()
    const username=document.querySelector('#Username').value
    const password=document.querySelector('#Password').value
    const email=document.querySelector('#EmailUser').value
    const age=document.querySelector('#AgeUser').value
    // socket.emit('DetailSubmit',username,password)
    var data={username,email,password,age}
    const response=await fetch('/signup',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: await JSON.stringify(data)
    })
    const final = response.json()
    if(response.status==201){
        location.replace('/')
    }
    // console.log()
})
// console.log('HI EVERYONE')


