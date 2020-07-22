const submtDetails = document.querySelector('#SubmitDetails')
const newPassword = document.querySelector('#NewPassword')
const newPassword2 = document.querySelector('#NewPassword2')
const locationpara = document.querySelector('#locationpara')
const spanPassword2 = document.querySelector('#spanPassword2')
const spanPassword1 = document.querySelector('#spanPassword1')

//on form submission
submtDetails.addEventListener('click',(e)=>{
    e.preventDefault()
    if(newPassword2.value===newPassword.value && newPasswordcount>=3){ 
        const data={password:newPassword.value}
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
            console.log("passwordchange succesfull")
        })
        locationpara.innerHTML="<div class=\"uk-alert-success\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Success.</p></div>"  
    }else if(newPassword2.value!==newPassword.value ){
        locationpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Invalid Credentials. Please Try Again</p></div>"    
    }else{
        locationpara.innerHTML="<div class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Please Choose a stronger password</p></div>"  
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

//on form submission
newPassword2.addEventListener('keyup',(e)=>{
    e.preventDefault()
    if(newPassword2.value === newPassword.value)
        setbagde(spanPassword2,"cyan","black","Successful match","You can now Proceed")
    else
        setbagde(spanPassword2,"red","black","Invalid","Must be the same as New Password")    
})
newPasswordcount=0
newPassword.addEventListener('keyup',(e)=>{
    e.preventDefault()
    newPasswordcount = findPasswordLevel(newPassword.value,spanPassword1)
    if(newPassword2.value === newPassword.value)
        setbagde(spanPassword2,"cyan","black","Successful match","You can now Proceed")
    else
        setbagde(spanPassword2,"red","black","Invalid","Must be the same as New Password")    

})

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