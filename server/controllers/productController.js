const userModel = require('../models/productmodel')


const addProduct = async (req,res) => {
    try{
        const ProductExist = await userModel.findOne({ProductName:ProductName})

        if(ProductExist){
            
        }
    }
}