var mongoose = require("mongoose");

//for heroku
//Schema setup
var cossiteSchema = new mongoose.Schema({
    name: String,
    oricos: String,
    image: String,
    description: String, 
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
   ]
})

//compile above into a model
//require 用来加载代码，而 exports 和 module.exports 则用来导出代码。
module.exports = mongoose.model("Cossite", cossiteSchema);