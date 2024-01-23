const express = require("express")
const router = require("express").Router()
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { handleStripeWebhook } = require('../Stripe/webhook')
const getOrCreateCustomer = require("../Stripe/helpers/getOrCreateCustomer")

const stripe = require("../Stripe/index")
const Property = require("../Database/Property")
const Transactions = require("../Database/Transactions")
const Ticket = require("../Database/Ticket")
const getOrCreateStripeVendor = require("../Stripe/helpers/getOrCreateStripeVendor")

router.post('/hooks', express.raw({ type: "*/*" }), handleStripeWebhook)


router.post("/pay", async (req, res) => {
    try {

        const customer = await getOrCreateCustomer(req.body.userId)

        const property = await Property.findOne({ _id: req.body.propertyID }, { __v: 0 })


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{

                price_data: {
                    currency: property.currency,
                    unit_amount: property.rent_amount,
                    product_data: {
                        name: 'T-shirt',
                        description: 'Comfortable cotton t-shirt',
                        images: ['https://images.unsplash.com/photo-1612637968894-660373e23b03?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MHx8MHx8&w=1000&q=80'],
                    },
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000',
            cancel_url: 'http://localhost:3000/dashboard',
            customer: customer.id
        });


        const transaction = await Transactions.create({
            sender_id: req.body.userId,
            companyDomain: property.companyDomain,
            property_id: req.body.propertyID,
            amount: property.rent_amount,
            currency: property.currency,
            payment_status: "Initiated",
            checkout_session_id: session.id
        });

        res.status(200).send({ status: 200, checkout: session })
    } catch (e) {
        console.log(e)
        res.status(400).send({ error: e })

    }




})


router.post("/vendor_pay", async (req, res) => {
    try {


        const customer = await getOrCreateStripeVendor(req.body.vendorID)

        const ticket = await Ticket.aggregate([
            { $match: { _id: ObjectId(req.body.ticketID) } },
            {
                $lookup:
                {
                    from: "quoted_vendor_tickets",
                    localField: "confirmedQuote",
                    foreignField: "_id",
                    as: "confirm_ticket"
                }
            }
        ])

        console.log(ticket)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{

                price_data: {
                    currency: "CAD",
                    unit_amount: (ticket?.[0].confirm_ticket?.[0].estimatedAmount) * 100,
                    product_data: {
                        name: 'T-shirt',
                        description: 'Comfortable cotton t-shirt',
                        images: ['https://images.unsplash.com/photo-1612637968894-660373e23b03?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MHx8MHx8&w=1000&q=80'],
                    },
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000',
            cancel_url: 'http://localhost:3000/dashboard',
            customer: customer.id
        });


        const transaction = await Transactions.create({
            sender_id: req.body.managerId,
            companyDomain: ticket?.[0].companyDomain,
            property_id: ticket?.[0].propertyID,
            amount: (ticket?.[0].confirm_ticket?.[0].estimatedAmount),
            currency: "CAD",
            payment_status: "Initiated",
            checkout_session_id: session.id
        });

        res.status(200).send({ status: 200, checkout: session })
    } catch (e) {
        console.log(e)
        res.status(400).send({ error: e })

    }
})



router.post('/create-customer-portal-session', async (req, res) => {

    const customer = await getOrCreateCustomer(req.body.userId)


    const session = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: 'http://localhost:3000/dashboard',
    });

    res.status(200).send({ status: 200, portal: session.url })
});




router.post("/get-transactions", async (req, res) => {
    const transactions = await Transactions.find({ sender_id: req.body.sender_id }, { __v: 0 })


    res.json({
        status: 200,
        message: "The resources has been fetched",
        transactions: transactions,
        total: transactions.length
    })

})


module.exports = router;
