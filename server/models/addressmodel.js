const mongoose = require('mongoose')


const addressSchema = new mongoose.Schema({
    email:{
      type:String,
      require:true
    },
    streetAddress: {
        type: String,
        description: "The street address including house/apartment number"
      },
      city: {
        type: String,
        description: "The city or locality"
      },
      state: {
        type: String,
        description: "The state, province, or region"
      },
      postalCode: {
        type: String,
        description: "The postal code or ZIP code"
      },
      country: {
        type: String,
        description: "The country"  
      }
 

});

const address = new mongoose.model('address', addressSchema)
module.exports = address