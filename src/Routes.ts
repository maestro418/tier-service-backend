import express from "express";
import OrderController from "./order/controllers";

const Routes = async (router: express.Router) => {

	//customer
	router.post("/newOrder", OrderController.newOrder);
	router.get("/reCalRank", OrderController.reCalRank);
	router.post("/getCustomerData", OrderController.getCustomerData);
	router.post("/getCustomerHistory", OrderController.getCustomerHistory);

};

export { Routes };              	