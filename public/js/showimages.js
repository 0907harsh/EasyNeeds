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