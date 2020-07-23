const modalpara=document.querySelector('#modalpara')
const modalparaSignUp=document.querySelector('#modalparaSignUp')

async function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    // console.log('statusChangeCallback');
    // console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        var isLoggedIn =await (await fetch('/loginstatus',{method:'POST'})).json()
        if (!isLoggedIn) {
            testAPI()
        }else{
            console.log("Already Logged In")
        }
   
    } else {                                 // Not logged into your webpage or we are unable to tell.
    document.getElementById('modalpara').innerHTML = 'Please log ' +
        'into this webpage.';
    }
}

function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
    statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
    appId      : '1254766721554706',
    cookie     : true,                     // Enable cookies to allow the server to access the session.
    xfbml      : true,                     // Parse social plugins on this webpage.
    version    : 'v7.0'           // Use this Graph API version for this call.
    });
    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
    statusChangeCallback(response);        // Returns the login status.
    });
};


(function(d, s, id) {                      // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me','GET',
        async (response)=>{
        // console.log('Successful login for: ' + response.name);
        // document.getElementById('modalpara').innerHTML ='Thanks for logging in, ' + response.name + '!';
        FB.api(`/${response.id}`,'GET',
        {"fields":"email"},async (response2)=>{
            // console.log('Saving your dataa to our database')
            // console.log(response2)
            if (response2 && !response2.error) {
                /* handle the result */
                var data={
                    username:response.name,
                    email:response2.email,
                    password:'PrdisNew',
                    age:18
                };
                // console.log(data.username,data.email)
                fetch('/signup',{
                    method:'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: await JSON.stringify(data)
                }).then(async (res)=>{
                    if(res.status==201){
                        modalpara.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success. New Account Created</p></div>"  
                         await fetch('/profile',{
                                method: 'PATCH',
                                headers: {
                                'Content-Type': 'application/json'
                                // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body:JSON.stringify(data)
                            }).then((response)=>{
                                console.log(response.status)        
                            })
                        location.replace('/createpassword')
                    }else{
                        modalpara.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
                        // console.log(res)
                        var data2={email:data.email}
                        // console.log(data)
                        const response=await fetch('/loginfb',{
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json'
                                // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: JSON.stringify(data2)
                        })
                        // console.log(response.body)
                        if(response.status==202){
                            modalpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.New Account Created</p></div>"  
                            location.replace('/')
                            // console.log(response.status)
                        }else{
                            modalpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
                        }
                        // console.log()
                   }
                    // console.log()
                }).catch((_erroe)=>{
                    console.log('Error')
                })
            }
        });
    });
}


//Login Switcher
document.querySelector('#SubmitDetailsLogin').addEventListener('click',async (e)=>{
    console.log('do i come here')
    e.preventDefault()
    const email=document.querySelector('#EmailUserLogin').value
    const password=document.querySelector('#PasswordLogin').value
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
        modalpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.New Account Created</p></div>"  
        location.replace('/')
        // console.log(response.status)
    }else{
        modalpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
    }
    // console.log()
})

newPasswordcount =0 
//SignUp
document.querySelector('#SubmitDetailsSignUp').addEventListener('click',async (e)=>{
    e.preventDefault()
    const username=document.querySelector('#Username').value
    const password=document.querySelector('#Password').value
    const email=document.querySelector('#EmailUser').value
    const age=document.querySelector('#AgeUser').value
    console.log(username.length>4)
    if(newPasswordcount>=3 && username.length>4 && age<18 && email.length>10){
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
            modalparaSignUp.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success. New Account Created</p></div>"  
            location.replace('/avatars')
        }else{
            modalparaSignUp.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
        }
        // console.log()
        modalparaSignUp.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.</p></div>"  
    }else if(username.length<1 || email.length<1 || age.length<1 || password.length<1){
        modalparaSignUp.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Please fill all the fields carefully</p></div>"  
    }else if(age<18){
        modalparaSignUp.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Age must be greater than 18</p></div>"  
    }else if(newPasswordcount<3){
        modalparaSignUp.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Please Choose a stronger Password</p></div>"  
    }else{
        modalparaSignUp.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Please Fill all necessary fields</p></div>"  
    }
    
})

function setbagde(element,bgColor,color,text,tooltip){
    element.style.backgroundColor = bgColor
    element.style.color = color 
    element.textContent=text
    element.setAttribute("uk-tooltip",`title:${tooltip}; pos: top;duration: 500;delay: 200`)
}

function findPasswordLevel(checkValue,element){
    var count =0
    var x=new RegExp("[!@#$%&\^~?]", "gi")
    var n=new RegExp("[0-9]", "gi")
    var Caps=new RegExp("[A-Z]", "gi")
    if(checkValue.length>8){
            count++
        if(checkValue.match(x)!==null)
            count++
        if(checkValue.match(n)!==null){
            count++
        }
        if(checkValue.match(Caps)!==null){
            count++
        }
    }
    
    if(count == 0)
        setbagde(element,"red","white","Password is very weak","Please include atleast one special character and number(0-9) and be atleast 8 characters long")
    else if(count == 1)
        setbagde(element,"yellow","black","Password is weak","Please include atleast one special character and number(0-9)")
    else if(count == 2)
        setbagde(element,"green","white","Password is moderate","Please include atleast one Uppercase character and number(0-9)")  
    else if(count == 3 )
        setbagde(element,"blue","white","Password is strong","Please include atleast one Uppercase character and number(0-9)")
    else
        setbagde(element,"cyan","black","Password is very Strong","Very Strong Password.HElps Preventing Brute Force Attacks")
    return count
}


document.querySelector('#Password').addEventListener('keyup',(e)=>{
    e.preventDefault()
    newPasswordcount = findPasswordLevel(document.querySelector('#Password').value,document.querySelector('#spanPassword'))   
})


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
  
