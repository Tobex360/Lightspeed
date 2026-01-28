const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
        default: null
    },
    packageName: {
        type: String,
        required: true
    },
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Extra Large'],
        required: true
    },
    description: {
        type: String,
        maxLength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in-transit', 'completed', 'cancelled'],
        default: 'pending'
    },
    trackingNumber: {
        type: String,
        unique: true
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Generate tracking number before saving
// orderSchema.pre('save', function(next) {
//     if (!this.trackingNumber) {
//         this.trackingNumber = 'LS' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
//     }
//     next();
// });

orderSchema.pre('save', function () {
    if (!this.trackingNumber) {
        this.trackingNumber =
            'LS' +
            Date.now() +
            Math.random().toString(36).substring(2, 9).toUpperCase();
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;