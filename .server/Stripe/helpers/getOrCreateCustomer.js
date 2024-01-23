const User = require('../../Database/Customer')
const stripe = require('../index')

const getOrCreateCustomer = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userSnapshot = await User.findById(userId)

            const { stripeCustomerId, email, firstname } = userSnapshot

            if (!stripeCustomerId) {
                // Create a new stripe customer
                const customer = await stripe.customers.create({
                    email,
                    name: firstname,
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

module.exports = getOrCreateCustomer