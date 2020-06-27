

const fileinput=document.querySelector('#myfile')
const imageAdder=document.querySelector('#imageAdder')
const imageViewer = document.querySelector('#Previewer')
const skipButton = document.querySelector('#SkipButton')
const nextButton = document.querySelector('#NextButton')

//Saving Profile Pictures in png format and size of 250*250 Images
imageAdder.addEventListener('click',async (e)=>{
    e.preventDefault()
    const files = fileinput.files
    const formData = new FormData()
    // for multiple files
    // for (let i = 0; i < files.length; i++) {
    //     let $file = files[i]

    //     formData.append('files[]', $file)
    // }
    formData.append('avatar', files[0])
    const response =await fetch('me/avatars', {
        method: 'POST',
        body: formData,
    })
    skipButton.href='#'
    nextButton.href='/profile'
    const final=await response.json()
    var d=final.data.data.toString().split(',')
    function toBase64(arr) {
        //arr = new Uint8Array(arr) if it's an ArrayBuffer
        return btoa(
           arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
     }
    d=toBase64(d)
    imageViewer.src="data:image/png;base64," + d;     
})


//Loading Images
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
  