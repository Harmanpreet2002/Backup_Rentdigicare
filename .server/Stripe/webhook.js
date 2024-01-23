const Transactions = require('../Database/Transactions')
const stripe = require('./index')



const STRIPE_WEBHOOK_SECRET = "whsec_9df42d4e4eef3cbd9e05e1e4b3c3eea617368a8a4dd451a6d9bf8a7644f5af98"

const webhookHandlers = {
    'charge.succeeded': async (data) => {
    },
    'charge.failed': async (data) => {

    },
    'payment_intent.created': async (data) => {

    },
    'payment_intent.succeeded': async (data) => {

    },
    'payment_intent.payment_failed': async (data) => {

    },
    'customer.subscription.deleted': async (data) => {

    },
    'customer.subscription.created': async (data) => {
        // const customer = await stripe.customers.retrieve(data.customer)
        // const userSnapshot = await User.findById(customer.metadata.mongoUserId)

        // userSnapshot.activePlans.push(data.plan.id)
        // await userSnapshot.save()
    },
    'checkout.session.completed': async (data) => {
        await Transactions.updateOne({ checkout_session_id: data.id }, { payment_status: data.payment_status })

    },
    'invoice.payment_failed': async (data) => {
        // const customer = await stripe.customers.retrieve(data.customer)
        // const userSnapshot = await User.findById(customer.metadata.mongoUserId)

        // userSnapshot.status = 'PAST_DUE'

        // await userSnapshot.save()
    }
}

// console.log(STRIPE_WEBHOOK_SECRET)

const handleStripeWebhook = async (req, res) => {
    const sign = req.headers['stripe-signature'];
    const event = await stripe.webhooks.constructEvent(req['rawBody'], sign, STRIPE_WEBHOOK_SECRET);

    try {
        await webhookHandlers[event.type](event.data.object)

        res.status(200).send({ success: true });
    } catch (e) {
        return res.status(400).send({ success: false, message: e.message });
    }
}

module.exports = {
    handleStripeWebhook
}