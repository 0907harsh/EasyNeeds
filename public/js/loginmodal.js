const loationpara=document.querySelector('#locationpara')

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
    testAPI();  
    } else {                                 // Not logged into your webpage or we are unable to tell.
    document.getElementById('locationpara').innerHTML = 'Please log ' +
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
        console.log('Successful login for: ' + response.name);
        document.getElementById('loationpara').innerHTML ='Thanks for logging in, ' + response.name + '!';
        FB.api(`/${response.id}`,'GET',
        {"fields":"email"},async (response2)=>{
            console.log('Saving your dataa to our database')
            console.log(response2)
            if (response2 && !response2.error) {
                /* handle the result */
                var data={
                    username:response.name,
                    email:response2.email,
                    password:'FacebookLogin',
                    age:18
                };
                console.log(data.username,data.email)
                fetch('/signup',{
                    method:'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: await JSON.stringify(data)
                }).then(async (res)=>{
                    if(res.status==201){
                        loationpara.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success. New Account Created</p></div>"  
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
                        location.replace('/avatars')
                    }else{
                        loationpara.innerHTML="<div style=\"z-ndex: 0\" class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
                        console.log(res)
                        var data2={email:data.email,password:'FacebookLogin'}
                        console.log(data)
                        const response=await fetch('/login',{
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json'
                                // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: JSON.stringify(data2)
                        })
                        // console.log(response.body)
                        if(response.status==202){
                            loationpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.New Account Created</p></div>"  
                            location.replace('/')
                            // console.log(response.status)
                        }else{
                            loationpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
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
        loationpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.New Account Created</p></div>"  
        location.replace('/')
        // console.log(response.status)
    }else{
        loationpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"  
    }
    // console.log()
})


//SignUp
document.querySelector('#SubmitDetailsSignUp').addEventListener('click',async (e)=>{
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
  
