const { Router } = require('express');
const { restart } = require('nodemon');
const path = require('path');
const { start } = require('repl');
const router = Router();

router.get("/home", function(req, res) {
    res.sendFile(path.resolve('webpage/home.html'));
});

router.get("/signup", function(req, res) {
    res.sendFile(path.resolve('webpage/signup.html'));
});

router.get("/login", function(req, res) {
    res.sendFile(path.resolve('webpage/login.html'));
});

router.get("/petfood", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petfood.html'));
});

router.get("/admin/pet", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpets.html'));
});

router.get("/admin/petfood", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpetfood.html'));
});
router.get("/admin/pettoy", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpettoy.html'));
});

router.get("/admin/createpet", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/createpet.html'));
});

router.get("/admin/createpetmed", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/createpetmed.html'));
});
router.get("/admin/createpettoy", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/createpettoy.html'));
});

router.get("/admin/petmed", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpetmed.html'));
});

router.get("/admin/createpetfood", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/createpetfood.html'));
});

router.get("/petmedicine", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petmedicine.html'));
});

router.get("/fooditem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/fooditem.html'));
});

router.get("/admin/petitem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpetitem.html'));
});

router.get("/admin/fooditem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminfooditem.html'));
});
router.get("/admin/toyitem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/admintoyitem.html'));
});

router.get("/admin/meditem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminmeditem.html'));
});

router.get("/meditem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/meditem.html'));
});

router.get("/petitem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petitem.html'));
});

router.get("/toyitem", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/toyitem.html'));
});

router.get("/fooddescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/fooddescription.html'));
});
router.get("/petdescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petdescription.html'));
});

router.get("/admin/petdescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpetdescription.html'));
});

router.get("/admin/fooddescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminfooddescription.html'));
});

router.get("/admin/meddescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminmeddescription.html'));
});
router.get("/admin/toydescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/admintoydescription.html'));
});


router.get("/meddescription", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/meddescription.html'));
});

router.get("/cart", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/cart.html'));
});

router.get("/placeorder", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/placeorder.html'));
});

router.get("/myorder", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/myorder.html'));
});
router.get("/userprofile", function(req, res) {
    console.log('loading petmedicine')
    res.sendFile(path.resolve('webpage/snippets/userprofile.html'));
});
module.exports = router;