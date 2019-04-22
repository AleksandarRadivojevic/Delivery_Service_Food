let totalSum = 0;
let numNewArticle = 0;
let basketArr = [];
document.getElementById("faultMsg").style.visibility = 'hidden';
let listProduct = [];
var finalResult;
var finalCategories;
var currentProduct;

// using data about customer
var currentCustomerString = sessionStorage.getItem('currentObj');
var currentCustomer = JSON.parse(currentCustomerString);

$('#name').val(currentCustomer.FirstName);
$('#surname').val(currentCustomer.LastName);
$('#inputAddress').val(currentCustomer.Address);
$('#inputCity').val(currentCustomer.City);
$('#inputState').val(currentCustomer.Country);
$('#inputZip').val(currentCustomer.PostalCode);

//initial filling in html
$.ajax({
    url: "https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json",
    dataType: "json",
    success: function (result) {
        $.ajax({
            url: "https://services.odata.org/V3/Northwind/Northwind.svc/Categories?%24format=json",
            dataType: "json",
            success: function (categories) {
                console.log(result);
                console.log(categories);
                // hide loader
                $('#loader').hide();
                // set category in card
                finalResult = result.value;
                finalCategories = categories.value;
                for (let i = 0; i < finalResult.length; i++) {
                    // push in filter array (listProduct)
                    var product = finalResult[i]
                    listProduct.push(product)

                    currentProduct = finalResult[i];
                    var category = returnCategoryName(finalResult[i], finalCategories);
                    var imgSrc = setPicture(category);
                    crtElmnt(finalResult[i], finalResult[i].ProductName, category, '1', imgSrc, parseInt(finalResult[i].UnitPrice))
                }
                // set categories in dropdown list
                var category = document.getElementById('category');
                for (let i = 0; i < finalCategories.length; i++) {
                    var option = document.createElement('option');
                    option.setAttribute('id', finalCategories[i].CategoryName);
                    option.setAttribute('value', finalCategories[i].CategoryID);
                    option.innerHTML = finalCategories[i].CategoryName;
                    category.appendChild(option);
                }
            }
        })
    }
})

// find category name
function returnCategoryName(result, category) {
    for (let i = 0; i < 8; i++) {
        if (result.CategoryID == category[i].CategoryID) {
            return category[i].CategoryName;
        }
    }
}
// set picture
function setPicture(parameter) {
    switch (parameter) {
        case "Beverages":
            imgSrc = 'assets/images/Beverages.jpg'
            return imgSrc;
        case "Condiments":
            imgSrc = 'assets/images/Condiments.jpg'
            return imgSrc;
        case "Confections":
            imgSrc = 'assets/images/Confections.png'
            return imgSrc;
        case "Dairy Products":
            imgSrc = 'assets/images/Dairy_Products.png'
            return imgSrc;
        case "Grains/Cereals":
            var imgSrc = 'assets/images/Grains_Cereals.jpg'
            return imgSrc;
        case "Meat/Poultry":
            var imgSrc = 'assets/images/Meat_Poultry.jpg'
            return imgSrc;
        case "Produce":
            var imgSrc = 'assets/images/Produce.jpg'
            return imgSrc;
        case "Seafood":
            var imgSrc = 'assets/images/Seafood.jpg'
            return imgSrc;
        default:
        // code block
    }
}
//show basket
function showBasket() {
    $('#paymentPage').hide();
    $('#confirmMsg').hide();

    document.getElementById('listBasket').innerHTML = ''
    for (let i = 0; i < basketArr.length; i++) {
        var productObject = JSON.parse(basketArr[i])
        var listBasket = document.getElementById('listBasket');

        var row = document.createElement('tr');
        listBasket.appendChild(row)

        var product = document.createElement('td');
        product.innerHTML = productObject.ProductName;
        row.appendChild(product);

        var quantity = document.createElement('td');
        quantity.innerHTML = 'Quantity: 1';
        row.appendChild(quantity);

        var price = document.createElement('td');
        price.innerHTML = 'Price: ' + productObject.UnitPrice + ' $';
        row.appendChild(price);

        console.log(basketArr)
    }
}
// addition 
function add(id, val) {
    document.getElementById("faultMsg").style.visibility = 'hidden';
    let priceArticle = parseInt(document.getElementById('price' + id).innerHTML);
    let quantityArticle = parseInt(document.getElementById('quantity' + id).value);
    totalSum = totalSum + priceArticle * quantityArticle;
    $('#result').text(totalSum);
    $('#resultModal').text(totalSum);

    for (let i = 0; i < quantityArticle; i++) {
        basketArr.push(val);
    }
}
// subtract
function minus(id, val) {
    let priceArticle = parseInt(document.getElementById('price' + id).innerHTML);
    let quantityArticle = parseInt(document.getElementById('quantity' + id).value);
    let basketElement = 0;

    // check how much we have elements in basket
    for (let i in basketArr) {
        if (basketArr[i] == val) {
            basketElement = basketElement + 1;
        }
    }

    if (basketElement < quantityArticle) {
        document.getElementById("faultMsg").style.visibility = 'visible';
        document.getElementById("faultMsg").innerHTML = "It's not possible to get out of the basket " + quantityArticle + " because there are " + basketElement + " articles in the basket!";
        document.getElementById("quantity" + id).value = 1;
    } else {
        for (let i = 0; i < quantityArticle; i++) {
            let element = basketArr.indexOf(val);
            basketArr.splice(element, 1);
        }
        totalSum = totalSum - priceArticle * quantityArticle;
        $('#result').text(totalSum);
        $('#resultModal').text(totalSum);
        document.getElementById("faultMsg").style.visibility = 'hidden';
    }
}
// filter articles
function filterArticles() {
    document.getElementById("container").innerHTML = ''
    let inputFilter = document.getElementById('inputFilter').value;
    let inputCategory = document.getElementById('category').value;
    for (let i = 0; i < listProduct.length; i++) {
        let nameProductFilter = listProduct[i].ProductName;
        var category = returnCategoryName(listProduct[i], finalCategories);
        var imgSrc = setPicture(category);
        if (inputCategory == 'null') {
            if (nameProductFilter.toLowerCase().indexOf(inputFilter) > -1) {
                crtElmnt(listProduct[i], listProduct[i].ProductName, category, '1', imgSrc, parseInt(listProduct[i].UnitPrice))
            }
        } else {
            if (nameProductFilter.toLowerCase().indexOf(inputFilter) > -1 && listProduct[i].CategoryID == inputCategory) {
                crtElmnt(listProduct[i], listProduct[i].ProductName, category, '1', imgSrc, parseInt(listProduct[i].UnitPrice))
            }
        }
    }
}
// modal basket
function displayModalStart(id, style) {
    document.getElementById(id).style = style;
    showBasket();
}
// close modal basket
function closeModal(id, style) {
    document.getElementById(id).style = style;
}
// create new article
function crtElmnt(objectAPI, nameArticle, categoryArticle, quantityArticle, srcImgElement, priceElement) {

    var wrapp = document.getElementById("container");
    // card
    var elementBox = document.createElement('div');
    elementBox.setAttribute("class", "articles");
    wrapp.appendChild(elementBox);

    // title - name article
    var name = document.createElement('h6');
    name.innerHTML = nameArticle;
    elementBox.appendChild(name);

    // subtitle - category article
    var category = document.createElement('p');
    category.innerHTML = 'Category: ' + categoryArticle;
    elementBox.appendChild(category);

    // image article
    var image = document.createElement('img');
    image.setAttribute("src", srcImgElement);
    image.className = "resizeImg";
    elementBox.appendChild(image);

    // price article
    var price = document.createElement('p');
    price.innerHTML = priceElement;
    price.setAttribute("id", "priceP" + numNewArticle);
    price.style.marginTop = "10px";
    elementBox.appendChild(price);

    // create span ($)
    var span = document.createElement('span');
    span.innerHTML = ' $';
    price.appendChild(span);

    // label
    var label = document.createElement('label');
    label.innerHTML = 'Quantity:';
    elementBox.appendChild(label);

    // quantity article
    var inputQuantity = document.createElement('input');
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("value", quantityArticle);
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("class", "form-control");
    inputQuantity.setAttribute("id", "quantityP" + numNewArticle);
    elementBox.appendChild(inputQuantity);

    // button add in basket
    var btnAdd = document.createElement('button');
    btnAdd.innerHTML = "Add";
    btnAdd.setAttribute("value", JSON.stringify(objectAPI));
    btnAdd.setAttribute("id", "P" + numNewArticle);
    btnAdd.setAttribute("class", "btn btn-success");
    btnAdd.setAttribute("onclick", "add(this.id, event.target.value)");
    btnAdd.style.marginRight = "5px";
    elementBox.appendChild(btnAdd);

    // button subtract from basket
    var btnSubtract = document.createElement('button');
    btnSubtract.innerHTML = "Subtract";
    btnSubtract.setAttribute("value", JSON.stringify(objectAPI));
    btnSubtract.setAttribute("id", "P" + numNewArticle);
    btnSubtract.setAttribute("class", "btn btn-danger");
    btnSubtract.setAttribute("onclick", "minus(this.id, event.target.value)");
    elementBox.appendChild(btnSubtract);

    numNewArticle = numNewArticle + 1;
}
// payment in modal
function payment() {
    $('#listForBuy').hide();
    $('#paymentPage').show()
    $('#confirmMsg').hide();

}
// confirm message in modal
var validationSwitch = true;

function confirm() {
    var listID = ['name', 'surname', 'inputAddress', 'inputCity', 'inputState', 'inputZip', 'cardNum', 'exp', 'ccv'];

    for (let i = 0; i < listID.length; i++) {
        var element = document.getElementById(listID[i]).value;
        if (!element) {
            document.getElementById(listID[i]).style.border = '1px solid red'
            return;
        } else {
            document.getElementById(listID[i]).style.border = '1px solid #ccc'
        }
    }

    $('#listForBuy').hide();
    $('#paymentPage').hide()
    $('#confirmMsg').show()

}


