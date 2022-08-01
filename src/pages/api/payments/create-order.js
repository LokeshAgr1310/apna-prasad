const Razorpay = require("razorpay")
const shortid = require("shortid")

const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET
})

export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            const response = await instance.orders.create({
                "amount": parseInt(req.body.amount * 100),
                "currency": "INR",
                "receipt": `receipt_${shortid.generate()}`,
            })
            res.json({
                "id": response.id,
                "currency": response.currency,
                "amount": response.amount,
                "receipt": response.receipt
            })
        } catch (err) {
            res.status(400).json({ "message": "Did not place order... Please try again!!" })
        }
    } else {
        res.status(400).json({ "message": "Invalid request!" })
    }

}