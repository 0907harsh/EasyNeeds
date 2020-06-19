document.querySelector('#Show_Age').style.width="40px"

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