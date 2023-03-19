const { Router } = require('express');
const path = require('path');
const router = Router();

router.get("/petfood", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petfood.html'));
});

router.get("/pets", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/pets.html'));
});

router.get("/admin/petfood", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpetfood.html'));
});

router.get("/admin/petmed", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpetmed.html'));
});
router.get("/admin/pettoy", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpettoy.html'));
});
router.get("/admin/pet", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/adminpets.html'));
});


router.get("/petmedicine", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/petmed.html'));
});

router.get("/userprofile", function(req, res) {
    console.log('loading petmedicine')
    res.sendFile(path.resolve('webpage/snippets/userprofile.html'));
});

router.get("/pettoy", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/pettoy.html'));
});


module.exports = router;