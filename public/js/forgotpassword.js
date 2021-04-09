const forgotpassword= document.querySelector('#Forgotpassword')
var resultHere = document.querySelector('#dsadsdasS')
const locationpara = document.querySelector('#locationpara')

forgotpassword.addEventListener('click' ,async (e) => {
    e.preventDefault()
    forgotpassword.disabled=true;
    locationpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Please check your Mailbox. Also check your spam box if not recieved. If the mail is still not recieved try again after 60 seconds</p></div>"  
    setTimeout(()=>{
        forgotpassword.disabled=false;
    },60000);
    var email = document.querySelector('#emailLogin').value
    var data={email}
    console.log("Atep1")
    const response=await fetch('/forgotpassword',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: await JSON.stringify(data)
    })
    const final =await response.json()
    if(response.status==200){
        console.log(final)
        resultHere.innerHTML ='Email Sent Successfully.Please check spam folder if not recieved'
    }else{
        console.log("EROOR")
        resultHere.innerHTML='Internal Server Error'
    }
    location.replace('/')
})