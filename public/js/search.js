const weatherForm=document.querySelector('#searchform')
const search=document.querySelector('#inputSearch')
const loationpara=document.querySelector('#locationpara')
const currentpara=document.querySelector('#currentpara')
const forecastpara=document.querySelector('#forecastpara')
import {getCookie} from './modules/getCookie.js'

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    // console.log('SEcond')
    const query =search.value
    loationpara.textContent='Loading...'
    currentpara.textContent=''
    forecastpara.textContent=''
    fetch('/searchget?query='+query).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                console.log(data.error)
                loationpara.innerHTML="<div style=\"z-index: 0\" class=\"uk-alert-danger\" uk-alert><a class=\"uk-alert-close\" uk-close></a><p>Location Not Found.Try Another Search</p></div>"  
                currentpara.textContent=''
                forecastpara.textContent=''
            }
            else{
                // console.log(data.organic_results)
                organic_results=data.organic_results,
                // console.log(data.local_results)
                local_results=data.local_results,
                total_time=data.total_time,
                ads=data.ads,
                related_searches=data.related_searches,
                formatedText=''
                organic_results.forEach(function(og_rl, index) {
                      title=og_rl.title;
                      snippet=og_rl.snippet;
                      const href = og_rl.url;
                      const display_url = og_rl.displayed_url;
                      const relhref=og_rl.cached_page_url
                      formatedText +=`<div class="uk-width-1-1 uk-text-center"><div class="uk-card uk-card-default"><div class="uk-card-body"><h4 class="uk-card-title">${display_url}<h2><a href="${href}" target="_blank">${href}</a></h2></h4><p>${snippet}</p></div></div></div>`
                    //   formatedText += "<div class='dish-image-div'><a " + " href='" + href + "' target='_blank'><img class='dish-image' style='inline' width='80' src='" + thumbnail + "' alt='recipe picture, link to recipe page'></a></div>";
                    //   formatedText += "<div " + "class='dish-title-div'><a href='" + href + "' target='_blank'>" + recipe.title + "</a></div>";
                    //   formatedText += "<div class='dish-ingredients-div'>Cooking Time: " + recipe.readyInMinutes + "</div>"; 
                });
                loationpara.innerHTML=formatedText;
            }
        })
    })
})
              
function settingCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function gettingCookie(cname) {
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

  //santizing input
  function sanitizeInput(element){
    console.log(element.value)
    var str=element.value;
    str=str.replace(/(<([^>]+)>)/ig,"");
    // str=str.replace(/\/[a-z ]+|\/[A-Z]+|\/[^1-9]+/gim,"");
    str=str.replace(/[(=);]/ig,"");
    str=str.trim();
    element.value=str;
}