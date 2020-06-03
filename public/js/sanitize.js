function sanitizeInput(element){
    // console.log(element.value)
    var str=element.value;
    str=str.replace(/[<>!~`$()=;]/gim,"");
    str=str.replace(/\/[a-z ]+|\/[A-Z]+|\//gim,"");
    str=str.trim();
    element.value=str;
}