const loadPetFood = function() {
    //  showLoading('#main-content', 'var(--primary-accent)', 5);
    fetch("/service/petfood", {
            method: 'GET'
        })
        .then(res => res.text())
        .then((res) => {
            utils.insertHtml('#main-content', res);
            utils.onclickEvent('#btn-filter-petfood', loadFoodItems);
            loadFoodFilter();
            loadFoodItems();
            // loaddescription
        });
}

const loadFoodItems = () => {
    let filter = getFoodFilter();
    loadData('/petfood', filter)
     .then((data) => {
           loadSnippet('/fooditem')
                 .then((res) => {
                    var html;
                    utils.insertHtml('#pro-container', "");
                    for (const petfood of data.petfood) {
                        html = utils.insertProperty(res, 'id', petfood._id);
                        html = utils.insertProperty(html, 'name', petfood.foodname);
                        html = utils.insertProperty(html, 'brand', petfood.brand);
                        html = utils.insertProperty(html, 'price', petfood.price);
                        html = utils.insertProperty(html, 'stock', petfood.stock);
                        if(petfood.images.length > 0)
                        html = utils.insertProperty(html, 'image', petfood.images[0].url);
                        utils.appendHtml('#pro-container', html);
                    }
                })
                .then((res) => {
                    $('.pro > button').each((i, ele) => {
                        ele.addEventListener('click', loadFoodDescription);
                    })
                 });
     })
};

const loadFoodDescription = (e) => {
    getServiceById('petfood', e.target.id)
	.then(data => {
		loadSnippet('/fooddescription')
		.then((res) => {
			let html = utils.insertProperty(res, 'id', data.petfood._id);
			html = utils.insertProperty(html, 'name', data.petfood.foodname);
			html = utils.insertProperty(html, 'brand', data.petfood.brand);
            html = utils.insertProperty(html, 'image', data.petfood.images[0].url);
			html = utils.insertProperty(html, 'price', data.petfood.price);
			html = utils.insertProperty(html, 'stock', data.petfood.stock);
			html = utils.insertProperty(html, 'flavor', data.petfood.flavor);
			html = utils.insertProperty(html, 'rating', data.petfood.ratings);
			html = utils.insertProperty(html, 'description', data.petfood.description);
			utils.insertHtml('#main-content', html);
		})
		.then(res => {
			$(`#desc-cart`).each((i, ele) => {
				if (getItemIndex(cart.petfood, data.petfood._id) != -1) {
					$(`#desc-cart`).show();
					$(`#${data.petfood._id}`).hide();
				}
				ele.addEventListener('click', (e) => {
					loadCart();
				});
			})
			$(`#${data.petfood._id}`).each((i, ele) => {
				ele.addEventListener('click', (e) => {
					$(`#desc-cart`).show();
					$(`#${data.petfood._id}`).hide();

					const index = getItemIndex(cart.petfood, e.target.id);
					if (index != -1)
						cart.petfood[index].quantity += 1
					else
						cart.petfood.push({
							id: e.target.id,
							quantity: 1
						});

					localStorage.setItem('cart', JSON.stringify(cart));
				});
			})
		});
	})
}

const loadFoodFilter = () => {
    fetch(utils.apiurl + '/petfood/getflavors')
	.then(res => res.json())
	.then(res => {
		let htmlData = "";
		for (let i = 0; i < res.flavors.length; i++)
			htmlData += `<input type="checkbox" name="flavor${i}" value="${res.flavors[i]}">
		<label for="flavor${i}">${res.flavors[i]}</label><br />`
		utils.insertHtml("#filter-flavors", htmlData);
	});

	fetch(utils.apiurl + '/petfood/getbrands')
	.then(res => res.json())
	.then(res => {
		let htmlData = "";
		for (let i = 0; i < res.brands.length; i++)
			htmlData += `<input type="checkbox" name="brand${i}" value="${res.brands[i]}">
		<label for="brand${i}">${res.brands[i]}</label><br />`
		utils.insertHtml("#filter-brands", htmlData);
		getFoodFilter();
	});
};

const getFoodFilter = () => {
    let filter = {
        rating: [],
        price: [0, 1000000],
        brand: [],
        flavor: []
    };
    $('#filter-ratings > input').each((i, ele) => {
        if (ele.checked)
            filter.rating.push(ele.value);
    });
    $('#filter-flavors > input').each((i, ele) => {
        if (ele.checked)
            filter.flavor.push(ele.value);
    });
    $('#filter-brands > input').each((i, ele) => {
        if (ele.checked)
            filter.brand.push(ele.value);
    });
    if ($('#lp').val())
        filter.price[0] = parseInt($('#lp').val());
    if ($('#up').val())
        filter.price[1] = parseInt($('#up').val());
    return filter;
};

const loadPettoy = function() {
    //  showLoading('#main-content', 'var(--primary-accent)', 5);
    loadSnippet("/service/pettoy")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadToyitems();
        });
}
