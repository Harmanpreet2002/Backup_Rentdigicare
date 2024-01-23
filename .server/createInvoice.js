const schedule = require('node-schedule');
const moment = require("moment")



const Customer = require("./Database/Customer");
const Transaction = require("./Database/Transactions");
const Property = require("./Database/Property");


//CREATE INVOICE FOR PROPERTIES
async function createInvoice(currentDate) {




    // const customer = await Customer.find({ due_date: `${currentDate}` })

    let now = new Date()

    const customers = await Customer.aggregate([
        {
            $match: { due_date: `${currentDate}`, createdAt: { $lt: new Date() } },

        },
        {
            $lookup: {
                from: "transactions",
                let: {
                    'customer_id': '$_id'
                },

                as: "transactionList",
                pipeline: [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    { '$eq': ['$sender_id', '$$customer_id'] },
                                    {

                                        "$gte": ['$createdAt', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0)]

                                    }

                                ]
                            }
                        }

                    }
                ]
            }


        }])


    for (let i = 0; i < customers.length; i++) {

        if (customers?.[i]?.transactionList?.length == 0) {
            console.log("Add Invoice")

            const property = await Property.findOne({ _id: customers[i]?.properties[0] })

            const transaction = await Transaction.create({
                sender_id: customers[i]._id,
                companyDomain: property.companyDomain,
                property_id: customers[i]?.properties[0],
                amount: property.rent_amount,
                currency: "CAD",
                payment_status: "pending",
                // checkout_session_id: session.id 
            });
        }
    }


}


async function checkLastDay() {
    let currentDate = new Date().getDate();


    await createInvoice(currentDate)

    const endOfMonth = moment().daysInMonth();

    if (currentDate == endOfMonth) {
        if (endOfMonth == 28) {
            await createInvoice(29)
            await createInvoice(30)
            await createInvoice(31)

        } else if (endOfMonth == 29) {
            await createInvoice(30)
            await createInvoice(31)
        } else if (endOfMonth == 30) {
            await createInvoice(31)

        }
    }
    console.log(new Date().getDate())

}


async function scheduleJobs() {


    const rule = new schedule.RecurrenceRule();
    rule.hour = 15;
    rule.minute = 57

    const job = schedule.scheduleJob(rule, function () {
        checkLastDay()
    });
}

checkLastDay()
scheduleJobs()
