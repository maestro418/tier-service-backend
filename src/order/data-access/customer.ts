import Model from "../models";

const CustomerDB = {
    create: async (data: CustomerDataObject) => {
        const newData = new Model.CustomerModel.Customer(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("CustomerDB Database Error");
        }
        return saveData;
    },
    findOne: async ({ filter }: { filter: any }) => {
        return Model.CustomerModel.Customer.findOne(filter);
    },
    find: async ({ filter }: { filter: any }) => {
        return Model.CustomerModel.Customer.find(filter);
    },
    update: async ({ filter, update }: { filter: any, update: any }) => {

        return Model.CustomerModel.Customer.findOneAndUpdate(
            filter,
            update
        );
    },
    remove: async ({ filter }: { filter: any }) => {
        const res: any = await Model.CustomerModel.Customer.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    },
    calRank: async () => {
        await Model.CustomerModel.Customer.aggregate([
            {
                $setWindowFields: {
                    partitionBy: "$customerId",
                    sortBy: { customerSpent: -1 },
                    output: {
                        customerRank: {
                            $rank: {}
                        }
                    }
                }
            }
        ]);
        return;
    }
}

const CustomerDatas = {
    CustomerDB
}
export default CustomerDatas;