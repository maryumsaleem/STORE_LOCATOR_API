const expres=require('express');
const router=expres.Router();
const storesController=require('../controllers/stores');

//-- ********************* Routes ********************* --// 
router.get('/',(req, res) => {
    res.send('Hello');
});

router.route('/stores').get(storesController.getStore).post(storesController.addStore);



module.exports = router;