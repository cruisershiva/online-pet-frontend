const loadOrder = async () => {
    let orderPage = await loadSnippet('/myorder')
    let snippet = `<tr>
						<td>{{#}}</td>
						<td>{{item}}</td>
						<td>{{address}}</td>
						<td>{{amount}}</td>
						</tr>`,
                html, item, rows = "", i = 1;
    let data = await fetch(utils.apiurl + '/orders/me', {
            credentials: 'include'
        }).then(data => data.json())
    utils.insertHtml('#main-content', res);
    utils.insertHtml('#order-desc', JSON.stringify(data));
    console.log(data.orders);
    for(const order of data.orders) {
        html = utils.insertProperty(snippet, '#', i + 1);
        item = `<ol>`;
        for(const orderItem of order.orderItems) {
            let key = Object.keys(orderItem.product)[0]
            let row = await getServiceById('/' + key, orderItem.product[key])
            if(key == 'petfood')
                item += `<li>${row[key].foodname} ${row[key].brand}</li>`;
            else if(key == 'petmedicine')
                item += `<li>${row[key].medname} ${row[key].brand}</li>`;
            else if(key == 'pettoy')
                item += `<li>${row[key].Toyname} ${row[key].brand}</li>`;
            else if(key == 'pet')
                item += `<li>${row[key].breed} ${ows[key].petClass}</li>`;
        }
        item += `</ol>`;
        html = utils.insertProperty(html, 'item', item);
        rows += html;
        // utils.appendHtml('#order-table', html);
    }
    utils.appendHtml('#order-table', rows);
};

const placeOrder = async () => {
    let order = {
        orderItems: [],
        itemsPrice: 0
    }
    order.shippingInfo = {
        address: $('#address').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        country: $('#country').val(),
        pinCode: parseInt($('#pincode').val()),
        phoneNo: parseInt($('#phone').val())
    }
    order.paymentInfo = {
        id: s4() + '-' + s4(),
        status: $('input:checked', '#payment').val()
    }
    for(let key of Object.keys(cart)) {
        for(let element of cart[key]) {
            let prod = {}
            prod[key] = element.id;
            order.orderItems.push({
                product: prod,
                quantity: element.quantity
            })

            res = await getServiceById(key, element.id)
            order.itemsPrice += res[key].price;
        }
    }
    order.taxPrice = (order.itemsPrice * 18) / 100;
    order.shippingPrice = 50 + (order.itemsPrice * 2) / 100;
    order.totalPrice = order.itemsPrice + order.taxPrice + order.shippingPrice;
    let res = await loadData('/order/new', order);
    console.log(res);
    localStorage.removeItem('cart');
    resetCart();
};