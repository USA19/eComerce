const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const addProductSchema=new Schema({
    title:{
        type:String,
        required:[true,'problem is here with title']

    },
    price:{
        type:Number,
        require:[true,'problem is here with price']
    },
    imageUrl:{
        type:String,
        required:[true,'problem is here with picture ']
    },
    description:{
        type:String,
        required:[true,'problem is here with description']
    }

});



module.exports = mongoose.model('Product', addProductSchema);
