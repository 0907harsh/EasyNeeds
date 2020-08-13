import {LoginButton} from './modules/loginbutton.js'
import {getCookie} from './modules/getCookie.js'
const fileinput=document.querySelector('#myfile')
const imageAdder=document.querySelector('#imageAdder')
const imageViewer = document.querySelector('#Previewer')
const skipButton = document.querySelector('#SkipButton')
const nextButton = document.querySelector('#NextButton')

//Hiding Login/SignUp button
LoginButton()

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