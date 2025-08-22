const express = require('express');
const { CreateUser, getUser, getUserById, updateUser } = require('../Controller/USER');
const { Login, getGoogleValidation } = require('../Controller/AUTH');
const { ReadCategorie, createCategorie, UpdateCategorie, DeleteCategorie, GetCategoryById } = require('../Controller/CATEGORIE');
const { createArticle, ListArticle, UpdateArticle, DeleteArticle, getArticleById, getArticleByUserId, getArticleBestseller } = require('../Controller/ARTICLES');
const { CreateHistoryResearch, ListResearchHistory } = require('../Controller/RESEARCH');
const { createPromotion, ListPromotion } = require('../Controller/PROMOTION');





exports.router = (()=>{
    const ToggleRouter = express.Router()

    //API ENDPOINTS
    ToggleRouter.route('/Users/CreateUser').post(CreateUser.file, CreateUser.request)
    ToggleRouter.route('/Users/UpdateUser').put(updateUser)
    ToggleRouter.route('/Users/getUser').get(getUser)
    ToggleRouter.route('/Users/getUserById/:id').get(getUserById)
    ToggleRouter.route('/Auth/Login').post(Login)
    ToggleRouter.route('/oauth2callback').get(getGoogleValidation)

    //CATEGORIES
    ToggleRouter.route('/Categorie/getCategorie').get(ReadCategorie)
    ToggleRouter.route('/Categorie/getCategorieById/:id').get(GetCategoryById)
    ToggleRouter.route('/Categorie/CreateCategorie').post(createCategorie.file, createCategorie.request)
    ToggleRouter.route('/Categorie/UpdateCategorie').put(UpdateCategorie)
    ToggleRouter.route('/Categorie/DeleteCategorie/:id/:idPicture').delete(DeleteCategorie)

    //ARTICLES

    ToggleRouter.route('/Articles/createArticle').post(createArticle.file, createArticle.request)
    ToggleRouter.route('/Articles/ListArticle').get(ListArticle)
    ToggleRouter.route('/Articles/GetArticleById/:idCategory/:id').get(getArticleById)
    ToggleRouter.route('/Articles/GetArticleOfEachCategory').get(getArticleBestseller)
    ToggleRouter.route('/Articles/GetArticleByUserId/:id').get(getArticleByUserId)
    ToggleRouter.route('/Articles/UpdateArticle').put(UpdateArticle.file, UpdateArticle.request)
    ToggleRouter.route('/Articles/DeleteArticle/:idCategory/:id/:idPicture').delete(DeleteArticle)

    //HISTORY

    ToggleRouter.route('/Research/createHistory').post(CreateHistoryResearch)
    ToggleRouter.route('/Research/ListHistory').get(ListResearchHistory)

    //PROMOTION

    ToggleRouter.route('/Promotion/createPromotion').post(createPromotion.file, createPromotion.request)
    ToggleRouter.route('/Promotion/ListPromotion').get(ListPromotion)





    



    return ToggleRouter;
})() //Initialize Router