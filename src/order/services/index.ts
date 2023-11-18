import { getNeedDate } from "../../utils";
import Datas from "../data-access";
import CustomerDatas from "../data-access/customer";
import OrderDatas from "../data-access/order";

export const checkExistCustomer = async (customerId: String) => {
    const res = await Datas.CustomerDatas.CustomerDB.findOne({ filter: { customerId: customerId } })
    if (res) {
        return true;
    }
    return false;
}

export const spendingArray = (data: any) => {
    const customerSpending = data.reduce((result, current) => {
        const { customerId, totalCent } = current;
        if (result.hasOwnProperty(customerId)) {
            result[customerId] += totalCent;
        } else {
            result[customerId] = totalCent;
        }
        return result;
    }, {});

    const customerSpendingArray = Object.entries(customerSpending).map(([customerId, totalSpent]: [string, number]) => ({
        customerId,
        totalSpent
    }));

    return customerSpendingArray;
}

export const updateDate = async () => {
    const { lastStart, thisEnd } = getNeedDate()
    const res = await CustomerDatas.CustomerDB.update({ filter: {}, update: { startDate: lastStart, endDate: thisEnd } });
    if (res) {
        return true;
    }
    return false
}

export const calRankStatus = (Spent: number) => {
    if (Spent < 100) {
        return 'Brozen'
    } else if (Spent >= 100 && Spent < 500) {
        return 'Silver'
    } else {
        return 'Golden'
    }
}

export const calKeepAmount = async (customerId: String) => {
    const { thisStart, thisEnd } = getNeedDate();
    const orderRes = await OrderDatas.OrderDB.find({ filter: { customerId: customerId, orderDate: { $gte: thisStart, $lte: thisEnd } } });
    const currentAmount = spendingArray(orderRes);
    const customerRes = await CustomerDatas.CustomerDB.findOne({ filter: { customerId: customerId } });
    const currentSpent = customerRes.customerSpent;
    const rankStatus: string = calRankStatus(currentSpent);
    if (rankStatus === 'Sliver') {
        if (currentAmount[0].totalSpent < 100) {
            return 100 - currentAmount[0].totalSpent
        }
        return 0;
    } else if (rankStatus === 'Golden') {
        if (currentAmount[0].totalSpent < 500) {
            return 500 - currentAmount[0].totalSpent
        }
        return 0;
    } else {
        return 0;
    }

}

export const calNextAmount = async (customerId: String) => {
    const res = await CustomerDatas.CustomerDB.findOne({ filter: { customerId: customerId } });
    const currentSpent = res.customerSpent;
    const currentRankStatus = res.rankStatus;

    if (currentRankStatus === 'Brozen') {
        return 100 - currentSpent
    } else if (currentRankStatus === 'Sliver') {
        return 500 - currentSpent
    } else {
        return 0;
    }

}