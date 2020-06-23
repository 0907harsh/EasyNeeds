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
  