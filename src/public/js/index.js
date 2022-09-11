//this function is called when the user clicks on quick view
const express = require("express")

function openModalQuickLook(object) {
    console.log(object)
    document.getElementById("priceDisplay").innerHTML = (object.sale>0)?'$'+object.salePrice:'$'+object.price;
    let saleOffRate = Number(document.getElementById("saleOffRate").innerText / 100);
    document.getElementById("productPriceBeforeSale").innerHTML = (object.sale>0)?'$'+object.price:'';
    document.getElementById("productName").innerHTML = object.name;
    document.getElementById("product-description").innerHTML = object.description;
    document.getElementById("product-category").innerHTML = object.category;

    let html = ""
        html += ` <div><img class="u-img-fluid" src="${object.images[0]}" alt=""></div>`

    document.getElementById('js-product-detail-modal').innerHTML = html;
    document.getElementById('saleOffRate').innerHTML=object.sale

}

//this function to show the saleOffRate display when the product create in /admin/create
function showVal(value) {
    document.getElementById("showRate").innerHTML = "Sale Off Rate " + value + "%"
}

function sortBy(value) {
    // const Http = new XMLHttpRequest();
    // const url="/product/list/?sort="+value;
    // Http.open("GET", url);
    // Http.send();

}
