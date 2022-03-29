const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://satyendra:9fgt7389AB@cluster0.gn6uo.mongodb.net/auth?retryWrites=true&w=majority').then(()=>{
    console.log('db is connected');
}).catch((e)=>{
    console.log("db is not connected",e);
})

