import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    customerId: {
        type: String,
        default: 0
    },
    customerName: {
        type: String,
        default: ''
    },
    customerSpent: {
        type: Number,
        default: 0
    },
    customerRank: {
        type: Number,
        default: 0
    },
    rankStatus: {
        type: String,
        default: "Brozen"
    },
    startDate: {
        type: Number,
        default: 0
    },
    endDate: {
        type: Number,
        default: 0
    },
    amountOfNext: {
        type: Number,
        default: 0
    },
    amountOfKeep: {
        type: Number,
        default: 0
    },
    downgradableStatus: {
        type: Boolean,
        default: true
    }
})

const Customer = mongoose.model('customers', CustomerSchema);

const CustomerModel = {
    Customer
}

export default CustomerModel



