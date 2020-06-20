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
