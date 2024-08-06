const express = require('express');
const PlanController = require('../controllers/planController');
const authController = require('../controllers/authController');
const router = express.Router();



router.route('/')
    .get(PlanController.getallPlans)
    .post(PlanController.createPlan);

router.route('/options/:id')
    .delete(PlanController.deletePlan)    // delete plan by PLAN-id
    .get(PlanController.getPlanById)      //get Plan by COMPANY -ID
    .put(PlanController.updatePlan);     // update plan by plan id

    
module.exports = router;
