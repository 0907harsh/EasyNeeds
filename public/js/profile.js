document.querySelector('#Show_Age').style.width="40px"
const updateClick = document.querySelector('#UpdateProfile')
const changeSaver = document.querySelector('#changeSaver')
const newPassword = document.querySelector('#newPassword')
const newuserName = document.querySelector('#Show_Name')
const newAge = document.querySelector('#Show_Age')
const newID = document.querySelector('#Show_ID')

//Forwarding to forgot PAssword Page
newPassword.addEventListener('click',(e)=>{
  location.replace('/forgotpassword')
})

//Enabling the updation of user profile changer and save button
updateClick.addEventListener('click',(e)=>{
    e.preventDefault()
    changeSaver.removeAttribute('disabled')
    updateClick.setAttribute('disabled',null)
    newuserName.removeAttribute('disabled')
    // newPassword.removeAttribute('disabled')
    newAge.removeAttribute('disabled')
    setTimeout(()=>{
        updateClick.removeAttribute('disabled')
    },2000)
})

//updatng changes made to profile in the database
changeSaver.addEventListener('click',(e)=>{
    e.preventDefault()
    const data={username:newuserName.value,age:newAge.value,password:newPassword.value}
    console.log(data)
    fetch('/profile',{
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    }).then((response)=>{
      return response.json()
    }).then((response)=>{
      console.log(response)
    })
})


//Fetching and showing user Profile from server or cookie
var userData
window.addEventListener('load',async (e)=>{ 
  userData=JSON.parse((await getCookie('userData')).replace('j:',''))
  // console.log(userData)
  if(userData.isLoggedIn){
      document.querySelector('#Show_Profile').textContent='My Profile'
      document.querySelector('#Show_Name').value=userData.user.username
      document.querySelector('#Show_Age').value=userData.user.age
      document.querySelector('#Show_ID').value=userData.user.email
    }else{
      document.querySelector('#Show_Profile').textContent='Nothing Here'
  }
})

//Logout Functionality
document.querySelector('#LogoutButton').addEventListener('click',async(e)=>{
    var logout
    if(confirm('are you sure')){
        logout=await fetch('/logout',{
            method:'POST'
        })
         if(logout.status===202){
            //  checkLoginState()
             location.replace('/')
         }else{
            alert('Server down .Please try again Later')
         }
    }
})


//Showing and fetching user's profile pic
const showImage=document.querySelector('#Previewer')

window.onload = (event) => {
//    console.log('1st line')
    fetch('/me/getavatars',{
        method:'POST'
    }).then(async (response)=>{

        // console.log('Hi',response)
        const final=await response.json()
        // console.log(final)
        var d=final.data.data.toString().split(',')
        // console.log(d)
        function toBase64(arr) {
            //arr = new Uint8Array(arr) if it's an ArrayBuffer
            return btoa(
            arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
        }
        d=toBase64(d)
        showImage.src="data:image/png;base64," + d;
    }).catch((error)=>{
        // console.log('Erorr')
    })  
}

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

  