import { Request, Response } from "express"

import Datas from "../data-access";
import { Now } from "../../utils";
import { getNeedDate } from "../../utils";
import { calKeepAmount, calNextAmount, calRankStatus, checkExistCustomer, spendingArray, updateDate } from "../services";
import CustomerDatas from "../data-access/customer";
import OrderDatas from "../data-access/order";

const OrderController = {

    newOrder: async (req: Request, res: Response) => {
        try {
            const { customerId, customerName, orderId, totalCent } = req.body;

            const newOrderData = {
                customerId: customerId,
                customerName: customerName,
                orderId: orderId,
                totalCent: totalCent,
                date: Now()
            }
            await Datas.OrderDatas.OrderDB.create(newOrderData);
            const isNewCustomer = await checkExistCustomer(customerId);
            if (isNewCustomer) {
                const { lastStart, thisEnd } = getNeedDate();
                const newCustomerData = {
                    customerId: customerId,
                    customerName: customerName,
                    customerSpent: totalCent,
                    rankStatus: calRankStatus(totalCent),
                    startDate: lastStart,
                    endDate: thisEnd
                }
                await Datas.CustomerDatas.CustomerDB.create(newCustomerData);
            } else {
                const findCustomer = await Datas.CustomerDatas.CustomerDB.findOne({ filter: { customerId: customerId } });
                const newSpent = findCustomer.customerSpent + totalCent;
                const newRankStatus = calRankStatus(newSpent)
                await Datas.CustomerDatas.CustomerDB.update({ filter: { customerId: customerId }, update: { customerSpent: newSpent, rankStatus: newRankStatus } })
            }
            const amountOfKeep = calKeepAmount(customerId);
            const amountOfNext = calNextAmount(customerId);
            await Datas.CustomerDatas.CustomerDB.update({ filter: { customerId: customerId }, update: { amountOfNext: amountOfNext, amountOfKeep: amountOfKeep } });

            await Datas.CustomerDatas.CustomerDB.calRank();
            return res.status(200).send({ message: "Order Success" })
        } catch (err) {
            console.log(err)
        }
    },
    reCalRank: async (req: Request, res: Response) => {
        try {
            const { lastStart, lastEnd } = getNeedDate();
            const oldData = await Datas.OrderDatas.OrderDB.find({ filter: { orderDate: { $gte: lastStart, $lte: lastEnd } } });
            const customerData = spendingArray(oldData);
            updateDate();
            for (let i = 0; i < customerData.length; i++) {
                const findCustomer = await Datas.CustomerDatas.CustomerDB.findOne({ filter: { customerId: customerData[i].customerId } });
                const newVal = findCustomer.customerSpent - customerData[i].totalSpent;
                const amountOfKeep = calKeepAmount(customerData[i].customerId);
                const amountOfNext = calNextAmount(customerData[i].customerId);
                await Datas.CustomerDatas.CustomerDB.update({ filter: { customerId: customerData[i].customerId }, update: { customerSpent: newVal, amountOfNext: amountOfNext, amountOfKeep: amountOfKeep } });
            }
            await Datas.CustomerDatas.CustomerDB.calRank();
        } catch (err) {
            console.log(err);
        }
    },
    getCustomerData: async (req: Request, res: Response) => {
        try {
            const { customerId } = req.body;
            const customerData = await CustomerDatas.CustomerDB.findOne({ filter: { customerId: customerId } });
            if (!customerData) {
                throw new Error("Invalid CustomerId")
            }
            const data = {
                currentRank: customerData.customerRank,
                startDate: customerData.startDate,
                endDate: customerData.endDate,
                totalSpent: customerData.customerSpent,
                amountOfNext: customerData.amountOfNext,
                amountOfKeep: customerData.amountOfKeep,
                downgradable: customerData.amountOfKeep > 0 ? true : false
            }

            return res.status(200).send({ data: data });
        } catch (err) {
            console.log(err)
        }
    },
    getCustomerHistory: async (req: Request, res: Response) => {
        try {
            const { customerId } = req.body;
            const orderDatas = await OrderDatas.OrderDB.find({ filter: { customerId: customerId } });
            if (!orderDatas) {
                return res.status(200).send({ message: 'Never Ordered Customer' })
            }
            return JSON.stringify(orderDatas)
        } catch (err) {
            console.log(err)
        }
    }
}

export default OrderController        