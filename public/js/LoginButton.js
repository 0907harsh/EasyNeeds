//Hiding Login/SignUp buttons
var LoginButton=async function LoginButton() {
  var cookieUser = JSON.parse((await getCookie("userData")).replace('j:{', '{'));
  var isLoggedIn = cookieUser.isLoggedIn;
  // console.log($isLogged)
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
