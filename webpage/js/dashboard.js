import utils from "/js/util.js";

const loadPetFood = function() {
    //  showLoading('#main-content', 'var(--primary-accent)', 5);
    loadSnippet('/service/admin/petfood')
    .then((res) => {
        utils.insertHtml('#main-content', res);
        utils.onclickEvent('#btn-filter-petfood', loadFoodItems);
        utils.onclickEvent('#btn-create', loadCreatePetfood);
        loadFoodFilter();
        loadFoodItems();
    });
}

const loadFoodItems = () => {
    let filter = getFoodFilter();
    loadData('/petfood', filter)
     .then((data) => {
           loadSnippet('/admin/fooditem')
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
                .then(() => {
                    $('.btn-detail').each((i, ele) => {
                        ele.addEventListener('click', loadFoodDescription);
                    })
                    $('.btn-update').each((i, ele) => {
                        ele.addEventListener('click', loadUpdatePetfood);
                    })
                    $('.btn-delete').each((i, ele) => {
                        ele.addEventListener('click', deletePetfood);
                    })
                 });
     })
};

const loadFoodDescription = (e) => {
    getServiceById('petfood', e.target.value)
	.then(data => {
		loadSnippet('/admin/fooddescription')
		.then((res) => {
			let html = utils.insertProperty(res, 'id', data.petfood._id);
			html = utils.insertProperty(html, 'name', data.petfood.foodname);
			html = utils.insertProperty(html, 'brand', data.petfood.brand);
			html = utils.insertProperty(html, 'price', data.petfood.price);
			html = utils.insertProperty(html, 'stock', data.petfood.stock);
			html = utils.insertProperty(html, 'flavor', data.petfood.flavor);
			html = utils.insertProperty(html, 'rating', data.petfood.ratings);
			html = utils.insertProperty(html, 'description', data.petfood.description);
            if(data.petfood.images.length > 0)
                html = utils.insertProperty(html, 'image', data.petfood.images[0].url);
			utils.insertHtml('#main-content', html);
		})
		.then(res => {
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

var images = [];

const loadCreatePetfood = () => {
    loadSnippet('/admin/createpetfood')
    .then(res => {
        utils.insertHtml('#main-content', res);
        $('#images').change(() => {
            let reader = new FileReader() 
            reader.readAsDataURL($('#images')[0].files[0])
            reader.onload = () => {
                images.push(reader.result);
                console.log(images);
            };
        });
        utils.onclickEvent('#btn-create', createPetfood);
    });
};

const loadUpdatePetfood = (e) => {
    loadSnippet('/admin/createpetfood')
    .then(res => {
        utils.insertHtml('#main-content', res);
        getServiceById('petfood', e.target.value)
        .then(data => {
            // show image
            $('#foodname').val(data.petfood.foodname),
            $('#brand').val(data.petfood.brand),
            $('#petClass').val(data.petfood.petClass),
            $('#description').val(data.petfood.description),
            $('#flavor').val(data.petfood.flavor),
            $('#price').val(data.petfood.price)
        });
        $('#btn-create').html('Update');
        $('#btn-create').attr('value', e.target.value);
        utils.onclickEvent('#btn-create', updatePetfood);
    });
};

const createPetfood = () => {
    const data = {
        images: images,
        foodname: $('#foodname').val(),
        brand: $('#brand').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        flavor: $('#flavor').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(utils.apiurl + '/admin/petfood/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/petfood")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadFoodItems();
        });
    });
};

const updatePetfood = (e) => {
    const data = {
        foodname: $('#foodname').val(),
        brand: $('#brand').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        flavor: $('#flavor').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(`${utils.apiurl}/admin/petfood/${e.target.value}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/petfood")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadFoodItems();
        });
    });
};

const deletePetfood = (e) => {
    fetch(`${utils.apiurl}/admin/petfood/${e.target.value}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadFoodItems();
    });
};

// const loadPettoy = function() {
//     //  showLoading('#main-content', 'var(--primary-accent)', 5);
//     loadSnippet("/service/pettoy")
//         .then((res) => {
//             utils.insertHtml('#main-content', res);
//             loadToyitems();
//         });
// }

// const loadToyitems = function() {
//     loadData('/pettoy')
//         .then((data) => {
//             loadSnippet('/toyitem')
//                 .then((res) => {
//                     var htmlData = "",
//                         html;
//                     for (const pettoy of data.pettoy) {
//                         html = utils.insertProperty(res, 'name', pettoy.Toyname)
//                         html = utils.insertProperty(html, 'brand', pettoy.brand);
//                         html = utils.insertProperty(html, 'price', pettoy.price);
//                         html = utils.insertProperty(html, 'stock', pettoy.stock);
//                         html = utils.insertProperty(html, 'image', pettoy.images.url);
//                         htmlData += html;
//                     }
//                     utils.insertHtml('#pro-container', htmlData);
//                 })
//         })
// };

// const loadPetmed = function() {
//     //  showLoading('#main-content', 'var(--primary-accent)', 5);
//     loadSnippet('/service/petmedicine')
//         .then((res) => {
//             utils.insertHtml('#main-content', res);
//             utils.onclickEvent('#btn-filter-petmed', loadMeditems);
//             loadMeditems();
//         });
// }

// const loadMeditems = function() {
//     loadData('/petmedicine')
//         .then((data) => {
//             loadSnippet('/meditem')
//                 .then((res) => {
//                     var html;
//                     for (const petmedicine of data.petmedicine) {
//                         html = utils.insertProperty(res, 'id', petmedicine._id);
//                         html = utils.insertProperty(html, 'name', petmedicine.medname);
//                         html = utils.insertProperty(html, 'brand', petmedicine.brand);
//                         html = utils.insertProperty(html, 'price', petmedicine.price);
//                         html = utils.insertProperty(html, 'stock', petmedicine.stock);
//                         html = utils.insertProperty(html, 'image', petmedicine.images.url);
//                         utils.appendHtml('#pro-container', html);
//                         // let ele = $(`#${petmed._id}`);
//                     }
//                 })
//                 .then((res) => {
//                     $('.pro > button').each((i, ele) => {
//                         ele.addEventListener('click', loadMedDescription);
//                     })
//                 });
//         })
// };

// const loadMedDescription = (e) => {
//     getServiceById('petmedicine', e.target.id)
//         .then(data => {
//             loadSnippet('/meddescription')
//                 .then((res) => {
//                     let html = utils.insertProperty(res, 'id', data.petmedicine._id);
//                     html = utils.insertProperty(html, 'name', data.petmedicine.medname);
//                     html = utils.insertProperty(html, 'brand', data.petmedicine.brand);
//                     html = utils.insertProperty(html, 'price', data.petmedicine.price);
//                     html = utils.insertProperty(html, 'stock', data.petmedicine.stock);
//                     html = utils.insertProperty(html, 'dosage', data.petmedicine.dosage);
//                     html = utils.insertProperty(html, 'rating', data.petmedicine.ratings);
//                     html = utils.insertProperty(html, 'description', data.petmedicine.description);
//                     utils.insertHtml('#main-content', html);
//                 })
//                 .then(res => {
//                     $(`#desc-cart`).each((i, ele) => {
//                         if (getItemIndex(cart.petmedicine, data.petmedicine._id) != -1) {
//                             $(`#desc-cart`).show();
//                             $(`#${data.petmedicine._id}`).hide();
//                         }
//                         ele.addEventListener('click', (e) => {
//                             loadCart();
//                         });
//                     })
//                     $(`#${data.petmedicine._id}`).each((i, ele) => {
//                         ele.addEventListener('click', (e) => {
//                             $(`#desc-cart`).show();
//                             $(`#${data.petmedicine._id}`).hide();

//                             const index = getItemIndex(cart.petmedicine, e.target.id);
//                             if (index != -1)
//                                 cart.petmedicine[index].quantity += 1
//                             else
//                                 cart.petmedicine.push({
//                                     id: e.target.id,
//                                     quantity: 1
//                                 });

//                             localStorage.setItem('cart', JSON.stringify(cart));
//                         });
//                     })
//                 });
//         })
// }

const getServiceById = (route, id) => {
    return fetch(`${utils.apiurl}/${route}/${id}`)
        .then(data => data.json())
}

const loadData = (route, data) => {
    return fetch(utils.apiurl + route, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(data => data.json())
}

const loadSnippet = (route) => {
    return fetch(route, {
            method: 'GET'
        })
        .then(res => res.text())
}

const logout = () => {
    fetch(utils.apiurl + '/logout', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => window.location.href = '/')
};

$(() => {
    fetch(utils.apiurl + '/admin/users', {
        credentials: 'include'
    }).then(res => res.json())
    .then(isAuth => {
        console.log('hello');
        console.log(isAuth);
        if(isAuth.success) {
            utils.onclickEvent('#s4', loadPets);
            utils.onclickEvent('#s1', loadPetFood);
            utils.onclickEvent('#s2', loadPetmed);
            utils.onclickEvent('#s3', loadPettoy);
            utils.onclickEvent('#btn-dropdown', () => $('#dropdown').toggle());
            utils.onclickEvent('#logout', logout);
        }
        else {
            utils.insertHtml('#main-content', `<h1 style="color: red; text-align: center;">You are not authorized</h1>`);
        }
    });
});
const loadPetmed = function() {
    //  showLoading('#main-content', 'var(--primary-accent)', 5);
    loadSnippet('/service/admin/petmed')
        .then((res) => {
            utils.insertHtml('#main-content', res);
            utils.onclickEvent('#btn-filter-petmed', loadMeditems);
            utils.onclickEvent('#btn-create', loadCreatePetmed);
            loadMeditems();
        });
}

const loadMeditems = function() {
    loadData('/petmedicine')
        .then((data) => {
            loadSnippet('/admin/meditem')
                .then((res) => {
                    var html;
                    utils.insertHtml('#pro-container',"");
                    for (const petmedicine of data.petmedicine) {
                        html = utils.insertProperty(res, 'id', petmedicine._id);
                        html = utils.insertProperty(html, 'name', petmedicine.medname);
                        html = utils.insertProperty(html, 'brand', petmedicine.brand);
                        html = utils.insertProperty(html, 'price', petmedicine.price);
                        html = utils.insertProperty(html, 'stock', petmedicine.stock);
                        if(petmedicine.images.length > 0)
                            html = utils.insertProperty(html, 'image', petmedicine.images[0].url);
                        utils.appendHtml('#pro-container', html);
                        // let ele = $(`#${petmed._id}`);
                    }
                })
                .then(() => {
                    $('.btn-detail').each((i, ele) => {
                        ele.addEventListener('click', loadMedDescription);
                    })
                    $('.btn-update').each((i, ele) => {
                        ele.addEventListener('click', loadUpdatePetmed);
                    })
                    $('.btn-delete').each((i, ele) => {
                        ele.addEventListener('click', deletePetmed);
                    })
                 });
    });
};

const loadMedDescription = (e) => {
    getServiceById('petmedicine', e.target.value)
        .then(data => {
            loadSnippet('/admin/meddescription')
                .then((res) => {
                    let html = utils.insertProperty(res, 'id', data.petmedicine._id);
                    html = utils.insertProperty(html, 'name', data.petmedicine.medname);
                    html = utils.insertProperty(html, 'brand', data.petmedicine.brand);
                    html = utils.insertProperty(html, 'price', data.petmedicine.price);
                    html = utils.insertProperty(html, 'stock', data.petmedicine.stock);
                    html = utils.insertProperty(html, 'dosage', data.petmedicine.dosage);
                    html = utils.insertProperty(html, 'rating', data.petmedicine.ratings);
                    html = utils.insertProperty(html, 'description', data.petmedicine.description);
                    if(data.petmedicine.images.length > 0)
                         html = utils.insertProperty(html, 'image', data.petmedicine.images[0].url);
                    utils.insertHtml('#main-content', html);
                })
                .then(res => {

                });
        })
    }                     
var images = [];

const loadCreatePetmed = () => {
    loadSnippet('/admin/createpetmed')
    .then(res => {
        utils.insertHtml('#main-content', res);
        $('#images').change(() => {
            let reader = new FileReader() 
            reader.readAsDataURL($('#images')[0].files[0])
            reader.onload = () => {
                images.push(reader.result);
                console.log(images);
            };
        });
        utils.onclickEvent('#btn-create', CreatePetmed);
    });
};

const loadUpdatePetmed = (e) => {
    loadSnippet('/admin/createpetmed')
    .then(res => {
        utils.insertHtml('#main-content', res);
        getServiceById('petmedicine', e.target.value)
        .then(data =>{
            // show image
            $('#medname').val(data.petmedicine.medname),
            $('#brand').val(data.petmedicine.brand),
            $('#petClass').val(data.petmedicine.petClass),
            $('#description').val(data.petmedicine.description),
            $('#dosage').val(data.petmedicine.dosage),
            $('#price').val(data.petmedicine.price)
        });
        $('#btn-create').html('Update');
        $('#btn-create').attr('value', e.target.value);
        utils.onclickEvent('#btn-create', updatePetmed);
    });
};

const CreatePetmed = () => {
    const data = {
        images: images,
        medname: $('#medname').val(),
        brand: $('#brand').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        dosage: $('#dosage').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(utils.apiurl + '/admin/petmedicine/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/petmed")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadMeditems();
        });
    });
};

const updatePetmed = (e) => {
    const data = {
        medname: $('#medname').val(),
        brand: $('#brand').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        dosage: $('#dosage').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(`${utils.apiurl}/admin/petmedicine/${e.target.value}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/petmed")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadMeditems();
        });
    });
};

const deletePetmed = (e) => {
    fetch(`${utils.apiurl}/admin/petmedicine/${e.target.value}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadMeditems();
    });
};



const loadPettoy = function() {
    //  showLoading('#main-content', 'var(--primary-accent)', 5);
    loadSnippet('/service/admin/pettoy')
        .then((res) => {
            utils.insertHtml('#main-content', res);
            utils.onclickEvent('#btn-filter-pettoy', loadPetToyItems);
            utils.onclickEvent('#btn-create', loadCreatePettoy);
            loadPetToyFilter();
            loadPetToyItems();
            // loaddescription
        });
}

const loadPetToyItems = () => {
    let filter = getPetToyFilter();
    loadData('/pettoy', filter)
     .then((data) => {
           loadSnippet('admin/toyitem')
                 .then((res) => {
                    var html;
                    utils.insertHtml('#pro-container', "");
                    for (const pettoy of data.pettoy) {
                        html = utils.insertProperty(res, 'id', pettoy._id);
                        html = utils.insertProperty(html, 'name', pettoy.Toyname);
                        html = utils.insertProperty(html, 'brand', pettoy.brand);
                        html = utils.insertProperty(html, 'price', pettoy.price);
                        html = utils.insertProperty(html, 'stock', pettoy.stock);
                        if(pettoy.images.length > 0)
                            html = utils.insertProperty(html, 'image', pettoy.images[0].url);
                        utils.appendHtml('#pro-container', html);
                    }
                })
                .then(() => {
                    $('.btn-detail').each((i, ele) => {
                        ele.addEventListener('click', loadPetToyDescription);
                    })
                    $('.btn-update').each((i, ele) => {
                        ele.addEventListener('click', loadUpdatepettoy);
                    })
                    $('.btn-delete').each((i, ele) => {
                        ele.addEventListener('click', deletePettoy);
                    })
                 });
     })
};

const loadPetToyDescription = (e) => {
    getServiceById('pettoy', e.target.id)
	.then(data => {
		loadSnippet('admin/toydescription')
		.then((res) => {
			let html = utils.insertProperty(res, 'id', data.pettoy._id);
			html = utils.insertProperty(html, 'name', data.pettoy.Toyname);
			html = utils.insertProperty(html, 'brand', data.pettoy.brand);
			html = utils.insertProperty(html, 'price', data.pettoy.price);
			html = utils.insertProperty(html, 'stock', data.pettoy.stock);
			// html = utils.insertProperty(html, 'flavor', data.pettoy.flavor);
			html = utils.insertProperty(html, 'rating', data.pettoy.ratings);
			html = utils.insertProperty(html, 'description', data.pettoy.description);
            if(data.pettoy.images.length > 0)
               html = utils.insertProperty(html, 'image', data.pettoy.images[0].url);
			utils.insertHtml('#main-content', html);
		})
		
			.then(res => {

            });
	})
}

const loadPetToyFilter = () => {
    fetch(utils.apiurl + '/pettoy/getpetClass')
	.then(res => res.json())
	.then(res => {
		let htmlData = "";
		for (let i = 0; i < res.petClass.length; i++)
			htmlData += `<input type="checkbox" name="petClass${i}" value="${res.petClass[i]}">
		<label for="petClass${i}">${res.petClass[i]}</label><br />`
		utils.insertHtml("#filter-petClass", htmlData);
		getPetFilter();
	});
	fetch(utils.apiurl + '/pettoy/getbrands')
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

const getPetToyFilter = () => {
    let filter = {
        rating: [],
        price: [0, 1000000],
        brand: [],
        petClass: []
    };
    $('#filter-ratings > input').each((i, ele) => {
        if (ele.checked)
            filter.rating.push(ele.value);
    });
    $('#filter-petClass > input').each((i, ele) => {
        if (ele.checked)
            filter.petClass.push(ele.value);
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
var images = [];

const loadCreatePettoy = () => {
    loadSnippet('/admin/createpettoy')
    .then(res => {
        utils.insertHtml('#main-content', res);
        $('#images').change(() => {
            let reader = new FileReader() 
            reader.readAsDataURL($('#images')[0].files[0])
            reader.onload = () => {
                images.push(reader.result);
                console.log(images);
            };
        });
        utils.onclickEvent('#btn-create', createPettoy);
    });
};

const loadUpdatepettoy = (e) => {
    loadSnippet('/admin/createpettoy')
    .then(res => {
        utils.insertHtml('#main-content', res);
        getServiceById('pettoy', e.target.value)
        .then(data => {
            // show image
            $('#Toyname').val(data.pettoy.Toyname),
            $('#brand').val(data.pettoy.brand),
            $('#petClass').val(data.pettoy.petClass),
            $('#description').val(data.pettoy.description),
            // $('#flavor').val(data.pettoy.flavor),
            $('#price').val(data.pettoy.price)
        });
        $('#btn-create').html('Update');
        $('#btn-create').attr('value', e.target.value);
        utils.onclickEvent('#btn-create', updatePettoy);
    });
};

const createPettoy = () => {
    const data = {
        images: images,
        Toyname: $('#Toyname').val(),
        brand: $('#brand').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        flavor: $('#flavor').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(utils.apiurl + '/admin/pettoy/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/pettoy")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadPetToyItems();
        });
    });
};

const updatePettoy = (e) => {
    const data = {
        Toyname: $('#Toyname').val(),
        brand: $('#brand').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        flavor: $('#flavor').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(`${utils.apiurl}/admin/pettoy/${e.target.value}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/pettoy")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadPetToyItems();
        });
    });
};

const deletePettoy = (e) => {
    fetch(`${utils.apiurl}/admin/pettoy/${e.target.value}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadPetToyItems();
    });
};

const loadPets = function() {
    //  showLoading('#main-content', 'var(--primary-accent)', 5);
    loadSnippet("/service/admin/pet")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            utils.onclickEvent('#btn-filter-pets', loadPetItems);
            utils.onclickEvent('#btn-create', loadCreatePet);
            loadPetFilter();
            loadPetItems();
            // loaddescription
        });
}

const loadPetItems = () => {
    let filter = getPetFilter();
    loadData('/pets', filter)
     .then((data) => {
           loadSnippet('/admin/petitem')
                 .then((res) => {
                    var html
                    utils.insertHtml('#pro-container', "");
                    for (const pet of data.pets) {
                        html = utils.insertProperty(res, 'id', pet._id);
                        html = utils.insertProperty(html, 'name', pet.petClass);
                        html = utils.insertProperty(html, 'breed', pet.breed);
                        html = utils.insertProperty(html, 'price', pet.price);
                        // html = utils.insertProperty(html, 'stock', pet.stock);
                        if(pet.images.length > 0)
                            html = utils.insertProperty(html, 'image', pet.images[0].url);
                        utils.appendHtml('#pro-container', html);
                    }
                })
                .then(() => {
                    $('.btn-detail').each((i, ele) => {
                        ele.addEventListener('click', loadPetDescription);
                    })
                    $('.btn-update').each((i, ele) => {
                        ele.addEventListener('click', loadUpdatePet);
                    })
                    $('.btn-delete').each((i, ele) => {
                        ele.addEventListener('click', deletePet);
                    })
                 });
     })
};

const loadPetDescription = (e) => {
    getServiceById('pet', e.target.value)
	.then(data => {
		loadSnippet('/admin/petdescription')
		.then((res) => {
			let html = utils.insertProperty(res, 'id', data.pet._id);
			html = utils.insertProperty(html, 'name', data.pet.petClass);
			html = utils.insertProperty(html, 'brand', data.pet.breed);
			html = utils.insertProperty(html, 'price', data.pet.price);
			html = utils.insertProperty(html, 'stock', data.pet.stock);
			// html = utils.insertProperty(html, 'flavor', data.pet.flavor);
			// html = utils.insertProperty(html, 'rating', data.pet.ratings);
			html = utils.insertProperty(html, 'description', data.pet.description); 
            if(data.pet.images.length > 0)
                html = utils.insertProperty(html, 'image', data.pet.images[0].url);
			utils.insertHtml('#main-content', html);
		})
		.then(res => {	
		});
	})
}

const loadPetFilter = () => {
    fetch(utils.apiurl + '/pets/getbreeds')
	.then(res => res.json())
	.then(res => {
		let htmlData = "";
		for (let i = 0; i < res.breeds.length; i++)
			htmlData += `<input type="checkbox" name="breeds${i}" value="${res.breeds[i]}">
		<label for="breeds${i}">${res.breeds[i]}</label><br />`
		utils.insertHtml("#filter-breeds", htmlData);
	});

	fetch(utils.apiurl + '/pets/getpetClass')
	.then(res => res.json())
	.then(res => {
		let htmlData = "";
		for (let i = 0; i < res.petClass.length; i++)
			htmlData += `<input type="checkbox" name="petClass${i}" value="${res.petClass[i]}">
		<label for="petClass${i}">${res.petClass[i]}</label><br />`
		utils.insertHtml("#filter-petClass", htmlData);
		getPetFilter();
	});
};

const getPetFilter = () => {
    let filter = {
        // rating: [],
        price: [0, 1000000],
        breed: [],
        petClass: []
    };
    // $('#filter-ratings > input').each((i, ele) => {
    //     if (ele.checked)
    //         filter.rating.push(ele.value);
    // });
    $('#filter-breeds > input').each((i, ele) => {
        if (ele.checked)
            filter.breed.push(ele.value);
    });
    $('#filter-petClass > input').each((i, ele) => {
        if (ele.checked)
            filter.petClass.push(ele.value);
    });
    if ($('#lp').val())
        filter.price[0] = parseInt($('#lp').val());
    if ($('#up').val())
        filter.price[1] = parseInt($('#up').val());
    return filter;
};


var images = [];

const loadCreatePet = () => {
    loadSnippet('/admin/createpet')
    .then(res => {
        utils.insertHtml('#main-content', res);
        $('#images').change(() => {
            let reader = new FileReader() 
            reader.readAsDataURL($('#images')[0].files[0])
            reader.onload = () => {
                images.push(reader.result);
                console.log(images);
            };
        });
        utils.onclickEvent('#btn-create', createPet);
    });
};

const loadUpdatePet = (e) => {
    loadSnippet('/admin/createpet')
    .then(res => {
        utils.insertHtml('#main-content', res);
        getServiceById('pet', e.target.value)
        .then(data => {
            // show image
            // $('#foodname').val(data.petfood.foodname),
            $('#breed').val(data.pet.breed),
            $('#petClass').val(data.pet.petClass),
            $('#description').val(data.pet.description),
            // $('#flavor').val(data.petfood.flavor),
            $('#price').val(data.pet.price)
        });
        $('#btn-create').html('Update');
        $('#btn-create').attr('value', e.target.value);
        utils.onclickEvent('#btn-create', updatePet);
    });
};

const createPet = () => {
    const data = {
        images: images,
        // foodname: $('#foodname').val(),
        breed: $('#breed').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        // flavor: $('#flavor').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(utils.apiurl + '/admin/pet/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/pet")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadPetItems();
        });
    });
};

const updatePet = (e) => {
    const data = {
        // foodname: $('#foodname').val(),
        breed: $('#breed').val(),
        petClass: $('#petClass').val(),
        description: $('#description').val(),
        // flavor: $('#flavor').val(),
        price: parseFloat($('#price').val())
    };
    console.log(data);
    fetch(`${utils.apiurl}/admin/pet/${e.target.value}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadSnippet("/service/admin/pet")
        .then((res) => {
            utils.insertHtml('#main-content', res);
            loadPetItems();
        });
    });
};

const deletePet = (e) => {
    fetch(`${utils.apiurl}/admin/pet/${e.target.value}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        loadPetItems();
    });
};
