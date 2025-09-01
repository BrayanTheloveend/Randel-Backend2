const express = require('express');
const { CreateUser, getUser, getUserById, updateUser, ChangeUserStatus } = require('../Controller/USER');
const { Login, getGoogleValidation } = require('../Controller/AUTH');
const { ReadCategorie, createCategorie, UpdateCategorie, DeleteCategorie, GetCategoryById } = require('../Controller/CATEGORIE');
const { createArticle, ListArticle, UpdateArticle, DeleteArticle, getArticleById, getArticleByUserId, getArticleBestseller, getOwnerByIdArticle, userLikedArticle } = require('../Controller/ARTICLES');
const { CreateHistoryResearch, ListResearchHistory } = require('../Controller/RESEARCH');
const { createPromotion, ListPromotion, UpdatePromotion, DeletePromotion, getPromotionByUserId } = require('../Controller/PROMOTION');
const { CreateOrder, getOrder, getOderByIdUser, getOderByOwner, VerifyOrderPayment, OrderDelivered, CancelOrderAfterDay, CancelOrderByUser, DeleteOrderByUser, DeleteCancelledOrderAfterDay, AdminDeleteOrder} =require('../Controller/ORDER');
const { getAllOrder, getSystem } = require('../Controller/SYSTEM');
const { getWidthdrawRequest, ApprovWithdraw, getWithdrawRequestByIdOwner } = require('../Controller/WITHDRAW');





exports.router = (()=>{
    const ToggleRouter = express.Router()

    //API ENDPOINTS
    ToggleRouter.route('/Users/CreateUser').post(CreateUser.file, CreateUser.request)
    ToggleRouter.route('/Users/UpdateUser').put(updateUser)
    ToggleRouter.route('/Users/ChangeUserStatut/:id').put(ChangeUserStatus)
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
    ToggleRouter.route('/Articles/GetArticleById/:idCategory/:id').get(getArticleById)
    ToggleRouter.route('/Articles/GetArticleOwnerById/:idCategory/:id').get(getOwnerByIdArticle)
    ToggleRouter.route('/Articles/GetArticleOfEachCategory').get(getArticleBestseller)
    ToggleRouter.route('/Articles/GetArticleByUserId/:id').get(getArticleByUserId)
    ToggleRouter.route('/Articles/UpdateArticle').put(UpdateArticle.file, UpdateArticle.request)
    ToggleRouter.route('/Articles/UserLikeArticle/:idCategory/:idArticle/:userId').put(userLikedArticle)
    ToggleRouter.route('/Articles/DeleteArticle/:idCategory/:id/:idPicture').delete(DeleteArticle)


    //HISTORY

    ToggleRouter.route('/Research/createHistory').post(CreateHistoryResearch)
    ToggleRouter.route('/Research/ListHistory').get(ListResearchHistory)

    //PROMOTION

    ToggleRouter.route('/Promotion/createPromotion').post(createPromotion.file, createPromotion.request)
    ToggleRouter.route('/Promotion/ListPromotion').get(ListPromotion)
    ToggleRouter.route('/Promotion/GetPromotionByUserId/:id').get(getPromotionByUserId)
    ToggleRouter.route('/Promotion/UpdatePromotion').put(UpdatePromotion.file, UpdatePromotion.request)
    ToggleRouter.route('/Promotion/DeletePromotion/:idCategory/:id/:idPicture').delete(DeletePromotion)

    //ORDERS

    ToggleRouter.route('/Orders/CreateOrder/').post(CreateOrder)
    ToggleRouter.route('/Orders/ListOrder/').get(getOrder)
    ToggleRouter.route('/Orders/getOrderById/:id').get(getOderByIdUser)
    ToggleRouter.route('/Orders/getOrderByOwner/:id').get(getOderByOwner)
    ToggleRouter.route('/Orders/VerifyUserPayment/:id').get(VerifyOrderPayment)
    ToggleRouter.route('/Orders/DeliveryOrder/:id').get(OrderDelivered)
    ToggleRouter.route('/Orders/CancelOrderAfterDay/:id').get(CancelOrderAfterDay)
    ToggleRouter.route('/Orders/CancelOrderByUser/:id/:customerId').get(CancelOrderByUser)
    ToggleRouter.route('/Orders/DeleteOrderByUser/:id/:customerId').delete(DeleteOrderByUser)
    ToggleRouter.route('/Orders/DeleteCancelledOrderAfterDay/:id').delete(DeleteCancelledOrderAfterDay)
        //ADMIN DELETE ORDERS
    
    ToggleRouter.route('/Orders/AdminDeleteOrder/:id/:customerId').delete(AdminDeleteOrder)
    


    //SYSTEM

    ToggleRouter.route('/System/getAllOrder').get(getAllOrder)
    ToggleRouter.route('/System/getSystemData').get(getSystem)

    //WITHDRAW

    ToggleRouter.route('/withdraw/getWithdrawRequest').get(getWidthdrawRequest)
    ToggleRouter.route('/withdraw/getWithdrawRequestByOwner/:id').get(getWithdrawRequestByIdOwner)
    ToggleRouter.route('/withdraw/approvWithdrawRequest').get(ApprovWithdraw)
    ToggleRouter.route('/withdraw/deleteWithdrawRequestAfterDay').get(ApprovWithdraw)







    



    return ToggleRouter;
})() //Initialize Router