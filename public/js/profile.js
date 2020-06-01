document.querySelector('#Show_Age').style.width="40px"
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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

const userData=JSON.parse(getCookie('userData').replace('j:',''))
if(userData.isLoggedIn){
    document.querySelector('#Show_Profile').textContent='My Profile'
    document.querySelector('#Show_Name').value=userData.user.username
    document.querySelector('#Show_Age').value=userData.user.age
    document.querySelector('#Show_ID').value=userData.user.email
  }else{
    document.querySelector('#Show_Profile').textContent='Nothing Here'
}

document.querySelector('#LogoutButton').addEventListener('click',async(e)=>{
    var logout
    if(confirm('are you sure')){
        logout=await fetch('/logout',{
            method:'POST'
        })
         if(logout.status===202){
             location.replace('/')
         }else{
            alert('Server down .Please try again Later')
         }
    }

})