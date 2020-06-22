document.querySelector('#Show_Age').style.width="40px"
const updateClick = document.querySelector('#UpdateProfile')
const changeSaver = document.querySelector('#changeSaver')
const newPassword = document.querySelector('#newPassword')
const newuserName = document.querySelector('#Show_Name')
const newAge = document.querySelector('#Show_Age')
const newID = document.querySelector('#Show_ID')


updateClick.addEventListener('click',(e)=>{
    e.preventDefault()
    changeSaver.removeAttribute('disabled')
    updateClick.setAttribute('disabled',null)
    setTimeout(()=>{
        updateClick.removeAttribute('disabled')
    },2000)
    
    console.log('It ran')
    
})

changeSaver.addEventListener('click',(e)=>{
    e.preventDefault()
    const data={username:newuserName.value,age:newAge.value,email:newID.value}
    console.log(data)
    fetch('/profile',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    })
})



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