import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customerId: {
        type: Number,
        default: 0
    },
    orderId: {
        type: Number,
        default: ''
    },
    totalCent: {
        type: Number,
        default: 0
    },
    orderDate: {
        type: Number,
        default: null
    },

})

const Order = mongoose.model('orders', OrderSchema);

const OrderModel = {
    Order
};

export default OrderModel;


