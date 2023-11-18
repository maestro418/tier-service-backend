import Model from "../models";

const OrderDB = {
    create: async (data: OrderDataObject) => {
        const newData = new Model.OrderModel.Order(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("OrderDB Database Error");
        }
        return saveData;
    },
    findOne: async ({ filter }: { filter: any }) => {
        return Model.OrderModel.Order.findOne(filter);
    },
    find: async ({ filter }: { filter: any }) => {
        return Model.OrderModel.Order.find(filter);
    },
    update: async ({ filter, update }: { filter: any, update: any }) => {
        return Model.OrderModel.Order.findOneAndUpdate(
            filter,
            update
        );
    },
    remove: async ({ filter }: { filter: any }) => {
        const res: any = await Model.OrderModel.Order.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    }
}

const OrderDatas = {
    OrderDB
}
export default OrderDatas;