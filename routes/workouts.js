const express = require('express')
//import controller
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout
} = require('../controllers/workoutController');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth)

//get all workout
router.get('/', getWorkouts)

//get single workout
router.get('/:id',getWorkout)

//POST a new workout
router.post('/', createWorkout);

//DELETE a new workout
router.delete('/:id', deleteWorkout)

//update
router.patch('/:id', updateWorkout)
module.exports = router