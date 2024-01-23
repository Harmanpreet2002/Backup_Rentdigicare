const mongoose = require("mongoose");

// TODO set the data type when the form side is clear
const MainSchema = mongoose.Schema({
    city: {
        type: String,
        require: true
    },
    property: {
        type: String,
        require: true
    },
    propertyID: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    layout: {
        type: String,
        require: true
    },
    layoutID: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        require: true
    },
})

const PreviousAddressSchema = mongoose.Schema({
    previousAddress: {
        type: String
    },
    howLongAtPreviousAddress: {
        type: String
    },
    previousLandloardName: {
        type: String
    },
    previousLandloardPhone: {
        type: String
    }
});

const PetsInformation = mongoose.Schema({
    petType: {
        type: String
    },

    breed: {
        type: String
    },

    weight: {
        type: String
    },

    age: {
        type: String
    }
})

const Pets = mongoose.Schema({
    numberOfPets: Number,
    petsInformation: [PetsInformation]
});



const Applicant = mongoose.Schema({
    firstname: {
        type: String,
    },

    lastname: {
        type: String
    },

    phone: {
        type: String,
    },

    currentAddress: {
        type: String,

    },
    howLong: {
        type: String,

    },
    email: {
        type: String,

    },
    currentLandloard: {
        type: String,

    },
    currentLandlordPhone: {
        type: String,

    },
    previousAddressInformation: PreviousAddressSchema,
    currentEmployer: {
        type: String,

    },
    currentEmployerFor: {
        type: String,

    },
    occupation: {
        type: String,

    },
    annualIncome: {
        type: String,

    },
    manager: {
        type: String,

    },
    currentEmployerPhone: {
        type: String,

    },
    documents: [String]
})

const EmergencyContact = mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    relation: String,
})

const ApplicantSignature = mongoose.Schema({
    signature: {
        type: String,
    },
    date: {
        type: Date,
        default: () => Date.now()
    }
})

const ResidePerson = mongoose.Schema({
    name: String,
    relation: String,
    age: String,
})

const applicantSchema = mongoose.Schema({
    status: {
        type: String,
        required: true,
        default:"Pending",
        enum:["Pending","Approved","Denied"]
    },
    primaryID: {
        type: String,
        required: true,
        unique: true,
        default: () =>  "APL" + Math.random().toString().slice(-4)+Math.floor(Date.now().toString().slice(-4))
    },
    fullName: {
        type : String
    },

    phone: {
        type:String
    },

    totalApplicants:{
        type: Number,
        required: true
    },
    totalDocuments: {
        type: Number,
        default: () => 0
    },
    main: MainSchema,
    applicants: [Applicant],
    residePersons: [ResidePerson],
    emergencyContacts: [EmergencyContact],
    pets: Pets,
    signatures:{
        type: [ApplicantSignature],
    },
    companyDomain: {
        type: String,
        required: true
    },
    documents:{
        type:Array,
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});


module.exports = mongoose.model("Applicant", applicantSchema)
