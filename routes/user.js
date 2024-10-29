const express = require('express');

const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, addUser } = require('../controllers/controlleruser');

router.use(express.json());

router.route('/').get(getAllUsers).post(addUser);


router.route('/:id')
    .get(getUserById)

    .patch(updateUser)

    .delete(deleteUser);

module.exports = router;
