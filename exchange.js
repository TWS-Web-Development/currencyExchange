var xhttp = new XMLHttpRequest();
let responseJSON;
let originalPrices=[];
function saveOriginalPrices(){
    let prices=document.getElementsByClassName("gdlr-core-price-table-price-number");
    for(o=0;o<prices.length;o++){
        originalPrices.push(Number(prices.item(o).innerHTML.replace(/,/g, "")));
    }
}
function convert(){
    let prices=document.getElementsByClassName("gdlr-core-price-table-price-number");
    for(o=0;o<prices.length;o++){
        let convertedPrice=originalPrices[o];
        convertedPrice=convertedPrice/responseJSON.rates["USD"];
        if(document.getElementById("currencies").value!=="EUR"){
        //convert to foreign currency
        convertedPrice=convertedPrice*responseJSON.rates[document.getElementById("currencies").value];
        }else{}
        //Round to two decimal places
        convertedPrice=convertedPrice.toFixed(2);
        //Format by adding commas/spaces for each three spaces before the dot
        for(i=convertedPrice.indexOf('.');0<i;i=i-3){
            convertedPrice=convertedPrice.substring(0,i)+" "+convertedPrice.substring(i,convertedPrice.length);
        }
        //Push converted price to the price field
        prices.item(o).innerHTML=convertedPrice;
        //Push currency name to the price field
        
        document.getElementsByClassName("gdlr-core-price-prefix").item(o).innerHTML=document.getElementById("currencies").value+" ";
    }
}
if(document.getElementsByClassName("gdlr-core-price-table-price-number").length>1){
//insert select element
document.body.innerHTML+='<select id="currencies"></select>';
//Insert Style
var sheet = window.document.styleSheets[0];
sheet.insertRule('#currencies{position: fixed;bottom: 10px;right: 10px;background-color: #154270;font-size: 17px;color: white;border: none;border-radius: 3px;padding-top: 3px;padding-bottom: 3px;padding-left: 7px;padding-right: 7px;cursor: pointer;z-index: 50;}', sheet.cssRules.length);
sheet.insertRule('select{-webkit-appearance: none;-moz-appearance: none;appearance: none;}', sheet.cssRules.length);
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    responseJSON=JSON.parse(this.responseText);
    console.log(responseJSON);
    var keyNames = Object.keys(responseJSON.rates);
    for(i=0;i<keyNames.length;i++){ 
        document.getElementById("currencies").innerHTML+='<option class="currencies" value="'+keyNames[i]+'">'+keyNames[i]+'</option>';
    }
    //Add euro
    document.getElementById("currencies").innerHTML+='<option class="currencies" value="EUR">EUR</option>';
    //set usd as default
    document.getElementById("currencies").value="USD";
    //Save original prices before making any changes
    saveOriginalPrices();
    //Add onchange event to currencies pointing to the convert function
    document.getElementById("currencies").onchange=()=>{
        convert();
        };
  }else{}
};
xhttp.open("GET", "https://api.exchangeratesapi.io/latest", true);
xhttp.send();
}else{
  //Do nothing no prices on document
}