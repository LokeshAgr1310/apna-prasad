const Razorpay = require("razorpay")
const shortid = require("shortid")
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils")

export default async function (req, res) {

    try {
        validatePaymentVerification({ "order_id": req.body.razorpay_order_id, "payment_id": req.body.razorpay_payment_id }, req.body.razorpay_signature, process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET);
        res.json({ "message": "Payment Successful", success: true })
    } catch (err) {
        console.log("error: ", err)
        res.json({ "message": "Payment is not verified!!!", success: false })
    }

}