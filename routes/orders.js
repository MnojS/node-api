const express = require('express');
const router = express.Router();
const Order = require('../modules/order');
const verify = require('./verifyToken')


// get back all the orders
router.get('/' ,async (req , res) => {
   try {
       const orders = await Order.find();
       res.json(orders);
   } catch (error) {
       res.json({message:error})
   } 
});

// submits the orders
router.post('/' , verify , async (req , res) => {
    const order = new Order({
        title : req.body.title,
        description : req.body.description
    })

    try {
        const savedOrder = await order.save();
        res.json(savedOrder);
    } catch (error) {
        res.json({ message : err})
    }

})

// specific order

router.get('/:orderId' , async (req , res) => {
    try {
        const order = await Order.findById(req.params.orderId)
        res.json(order);
    } catch (error) {
        res.json({message : error})
    }
    
})

// delete a specif order

router.delete('/:orderId' , verify , async (req , res) => {
    try {
        const removedOrder = await Post.remove({_id : req.params.orderId})
        res.json(removedOrder)
    } catch (error) {
        res.json({message : error})
    }
})

// update a order

router.patch('/:orderId' , verify,  async (req, res) => {
    try {
        const updatedOrder = await Order.updateOne(
            {_id : req.params.orderId}, 
            {$set : {product : req.body.product}}
            )
        res.json(updatedOrder)
    } catch (error) {
        res.json({message : error})
    }
})

module.exports = router