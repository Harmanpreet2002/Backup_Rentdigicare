const vendor = require('../../Database/vendor')
const stripe = require('../index')

const getOrCreateStripeVendor = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userSnapshot = await vendor.findById(userId)

            const { stripeCustomerId, email, first_name } = userSnapshot

            if (!stripeCustomerId) {
                // Create a new stripe customer
                const customer = await stripe.customers.create({
                    email,
                    name: first_name,
                    metadata: {
                        mongoUserId: userId.toString()
                    },

                })

                userSnapshot.stripeCustomerId = customer.id
                await userSnapshot.save()

                resolve(customer)
            } else {
                resolve(await stripe.customers.retrieve(stripeCustomerId))
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = getOrCreateStripeVendor