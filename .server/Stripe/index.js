const Stripe = require('stripe')


const STRIPE_SECRET = "sk_test_51KOdnqSCBsZ8ucvslp3RA3fXevZV9rcZBcarZRJ2e60Q94pCOSyT8xN5Ig6hldZZvHs1e52MDutR07sEUu5ynbqH00h9ANM5ei"

const stripe = Stripe(STRIPE_SECRET, {
    apiVersion: 'latest',
});


// console.log(STRIPE_WEBHOOK_SECRET)

module.exports = stripe