const express = require('express');
const { CreateUser, getUser } = require('../Controller/USER');
const { Login, getGoogleValidation } = require('../Controller/AUTH');





exports.router = (()=>{
    const ToggleRouter = express.Router()

    //API ENDPOINTS
    ToggleRouter.route('/Users/CreateUser').post(CreateUser.file, CreateUser.request)
    ToggleRouter.route('/Users/getUser').get(getUser)
    ToggleRouter.route('/Auth/Login').post(Login)
    ToggleRouter.route('/oauth2callback').get(getGoogleValidation)

    



    return ToggleRouter;
})() //Initialize Router