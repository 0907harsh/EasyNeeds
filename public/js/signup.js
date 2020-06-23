
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
        loationpara.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success. New Account Created</p></div>"  
        location.replace('/avatars')
    }else{
        loationpara.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
    }
    // console.log()
})
// console.log('HI EVERYONE')

//get Cookie function
var getCookie=async function getCookie(cname) {
    var name = cname + "=";
    
    const response =await fetch('/serveCookie',{
        method:'POST'
    })
    const res=await response.json()
    var decodedCookies=JSON.stringify(res.userData)
    decodedCookies="userData=j:"+decodedCookies
    var ca = decodedCookies.split(';');
    decodedCookies=""
    for (var i = 0; i < ca.length; i++) {
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
var LoginButton=async function LoginButton() {
    var isLoggedIn =await (await fetch('/loginstatus',{
       method:'POST'
    })).json()
    // console.log(isLoggedIn)
    if (!isLoggedIn) {
      // console.log('Why the hell')
      var all = document.getElementsByClassName('LoginPageButton');
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = '';
      }
      all = document.getElementsByClassName('SignUpPageButton');
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = '';
      }
      all = document.getElementsByClassName('MyProfilePageButton');
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = 'none';
      }
    }
    if (isLoggedIn) {
      var all = document.getElementsByClassName('LoginPageButton');
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = 'none';
      }
      all = document.getElementsByClassName('SignUpPageButton');
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = 'none';
      }
      all = document.getElementsByClassName('MyProfilePageButton');
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = '';
      }
    }
  }
  
  LoginButton()
  


