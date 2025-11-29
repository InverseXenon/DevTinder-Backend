const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
   
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: 
            ["interested","ignored","accepted","rejected"]
    }}
},{
    timestamps: true,
});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //Check If from and to User ID is same
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("You cannot send connection Request to Yourself");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;