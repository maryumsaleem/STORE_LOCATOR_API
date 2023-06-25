const express=require('express');
const router=express.Router();
const storesController=require('../controllers/stores');

//-- ********************* Routes ********************* --// 
router.get('/',(req, res) => {
    res.send('Welcom to Store Locator API');
});

router.route('/stores').get(storesController.getStore).post(storesController.addStore);

router.route('/stores/:id').get(storesController.editStore).patch(storesController.updateStore).delete(storesController.removeStore);

module.exports = router;