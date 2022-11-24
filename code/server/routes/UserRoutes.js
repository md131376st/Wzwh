var express = require('express');
var router = express.Router();

const UserServices = require('../Services/UserServices');
const ResultBuilder = require("../Modules/resultBuilder");


/* GET: Return an array containing all users excluding managers */
router.get('/users', async function (req, res) {

    let result = await new UserServices().getAllUsers('ALL');

    ResultBuilder.sendResult(result, res);
    
});

/* GET: Return an array containing all suppliers */
router.get('/suppliers', async function(req, res) {

    let result = await new UserServices().getAllUsers('SUPPLIERS');

    ResultBuilder.sendResult(result, res);


});

/* POST: Creates a new user */
router.post('/newUser', async function (req, res) {

    let result = await new UserServices().createUser(req.body);

    ResultBuilder.sendResult(result, res);
});

/* Modify rights of a user, given its username. Username is the email of the user */
router.put('/users/:username', async function (req, res) {

    let result = await new UserServices().modifyType(req.params.username, req.body);

    ResultBuilder.sendResult(result, res);
});


/* DELETE: Deletes the user identified by username (email) and type */
router.delete('/users/:username/:type', async function (req, res) {

    let result = await new UserServices().deleteUserByUsernameAndType(req.params.username, req.params.type);

    ResultBuilder.sendResult(result, res);
});


/* POST: Login of managers */
router.post('/managerSessions', async function(req, res) {
    let result = await new UserServices().getUserInfo(req.body, 'manager');

    ResultBuilder.sendResult(result, res);
});

module.exports = router;

/* POST: Login of customer */
router.post('/customerSessions', async function(req, res) {
    let result = await new UserServices().getUserInfo(req.body, 'customer');

    if (result.status == 200)
        res.status(200).json(result.info);
    else
        res.status(result.status).json(result.error)
});

/* POST: Login of supplier */
router.post('/supplierSessions', async function(req, res) {
    let result = await new UserServices().getUserInfo(req.body, 'supplier');

    if (result.status == 200)
        res.status(200).json(result.info);
    else
        res.status(result.status).json(result.error)
});

/* POST: Login of clerk */
router.post('/clerkSessions', async function(req, res) {
    let result = await new UserServices().getUserInfo(req.body, 'clerk');

    if (result.status == 200)
        res.status(200).json(result.info);
    else
        res.status(result.status).json(result.error)
});

/* POST: Login of quality employee */
router.post('/qualityEmployeeSessions', async function(req, res) {
    let result = await new UserServices().getUserInfo(req.body, 'qualityEmployee');

    if (result.status == 200)
        res.status(200).json(result.info);
    else
        res.status(result.status).json(result.error)
});

/* POST: Login of delivery employee */
router.post('/deliveryEmployeeSessions', async function(req, res) {
    let result = await new UserServices().getUserInfo(req.body, 'deliveryEmployee');

    if (result.status == 200)
        res.status(200).json(result.info);
    else
        res.status(result.status).json(result.error)
});

/* POST: Logout */
router.post('/logout', async function(req, res) {
    let result = await new UserServices().logout();

    if (result.status === 200)
        res.status(200).json();
    else
        res.status(result.status).json(result.error)
});

/* GET: Returns user informations if logged in  */   
router.get('/userinfo', async function (req, res) {
    let result = await new UserServices().loggedUserInfo();

    if (result.status == 200)
        res.status(200).json(result.result);
    else
        res.status(result.status).json(result.error)
});

module.exports = router;