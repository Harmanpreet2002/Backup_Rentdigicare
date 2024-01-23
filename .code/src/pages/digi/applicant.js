import React, { Component, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Container,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Label,
  Input,
  CardTitle,
  Button,
} from "reactstrap";
import Dropzone from "react-dropzone";
import classnames from "classnames";
import { Link } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import logoSvg from "../../assets/images/rdig_logo.jpg";
import ThankYou from "../../assets/images/thnx.gif";
import logoGsk from "../../assets/images/gsklogo.png";
import $, { data } from "jquery";
import "../../assets/css/rentdigicare.css";
// importing common axious
import axios from "../api/axios";
const location1 = window.location.href;
const position1 = location1.search("name");
const subStr1 = location1.substring(position1);

// geting position of domain and domain it self
const domainPosition1 = subStr1.search("=");
const companyDomain1 = subStr1.substring(domainPosition1 + 1);
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// EndPoints
const APPLICANT_SUBMIT_URL = "/applicant/add";
const GET_PROPERTY_URL = "/property/applicant-option";

let domain = "";
let errors = {};
let formIsValid = true;
let fst = [];
let snd = [];
let trd = [];
let fth = [];

class TicketManager extends Component {
  sigPad1 = {};
  sigPad2 = {};

  validurl = () => {
    if (domain.indexOf("http://") == 0 || domain.indexOf("https://") == 0) {
      window.location.replace(domain);
    } else {
      window.location.replace("http://" + domain);
    }
  };

  getSignature2 = () => {
    this.setState(
      {
        trimmedDataURL2: this.sigPad2.getTrimmedCanvas().toDataURL("image/png"),
      },
      () => { }
    );
  };

  getSignature1 = () => {
    this.setState(
      {
        trimmedDataURL1: this.sigPad1.getTrimmedCanvas().toDataURL("image/png"),
      },
      () => { }
    );
  };
  buttongetSignature1 = () => {
    this.setState(
      {
        trimmedDataURL1: null,
      },
      () => { }
    );
  };
  // let promise = new Promise(function(resolve, reject) {
  //     // after 1 second signal that the job is finished with an error
  //     setTimeout(() => reject(new Error("Whoops!")), 1000);
  //   });

  constructor(props) {
    super(props);
    // TODO saperate array to avoid second thing first issue !
    this.state = {
      btnDisbale: false,
      show: true,
      yes: false,
      no: false,
      exactProperty: {},
      petss: "",
      showpets: false,
      showName: false,
      showpets1: false,
      mname: companyDomain1,
      trimmedDataURL1: null,
      trimmedDataURL2: null,
      cityList: [],
      propertyList: [],
      cityPropertyList: [],
      selectedPropertyTypes: [],
      logo:'',
      // form states for apt
      errors: {},

      fields: {},

      mainFormErrors: {
        city: false,
        property: false,
        date: false,
        layout: false,
        source: false,
      },
      aplFormErrors: {
        applicantName: false,
        applicantNamelast: false,
        applicantPhone: false,
        applicantEmail: false,
        currentLandloard: false,
        currentLandlordPhone: false,
        applicantCurrentAddress: false,
        howLong: false,
        previousLandloardName: false,
        previousLandloardPhone: false,
        howLongAtPreviousAddress: false,
        currentEmployer: false,
        currentEmployerFor: false,
        occupation: false,
        annualIncome: false,
        manager: false,
        currentEmployerPhone: false,
        document: false,
      },
      fillApl2: false,
      apl2FormErrors: {
        applicantName2: false,
        applicantPhone2: false,
        applicantCurrentAddress2: false,
        howLong2: false,
        applicantEmail2: false,
        currentLandloard2: false,
        currentLandlordPhone2: false,
        previousLandloardName2: false,
        previousLandloardPhone2: false,
        howLongAtPreviousAddress2: false,
        currentEmployer2: false,
        currentEmployerFor2: false,
        occupation2: false,
        annualIncome2: false,
        manager2: false,
        currentEmployerPhone2: false,
        document2: false,
      },
      // main
      city: "",
      property: "",
      propertyID: "",
      date: this.getDate(),
      layout: "",
      layoutname: "",
      source: "",
      domain: "",

      // Applicant Information
      applicantName: "",
      applicantNamelast: "",
      applicantPhone: "",
      applicantCurrentAddress: "",
      howLong: "",
      applicantEmail: "",
      currentLandloard: "",
      currentLandlordPhone: "",
      previousAddress: "",
      howLongAtPreviousAddress: "",
      previousLandloardName: "",
      previousLandloardPhone: "",
      currentEmployer: "",
      currentEmployerFor: "",
      occupation: "",
      annualIncome: "",
      manager: "",
      currentEmployerPhone: "",
      applicantDocuments: [], // TODO upload documents

      aplicant: [{ index: 0, first_n: "", last_n: "", value1: "", value2: "" }],
      Pets_Array: [{ index: 0, pets: "", name: "", breed: "", weight: "", age: "", showname: false }],


      // Second Applicant Information
      applicantName2: "",
      applicantName2last: "",
      applicantPhone2: "",
      applicantCurrentAddress2: "",
      howLong2: "",
      applicantEmail2: "",
      currentLandloard2: "",
      currentLandlordPhone2: "",
      previousAddress2: "",
      howLongAtPreviousAddress2: "",
      previousLandloardName2: "",
      previousLandloardPhone2: "",
      currentEmployer2: "",
      currentEmployerFor2: "",
      occupation2: "",
      annualIncome2: "",
      manager2: "",
      currentEmployerPhone2: "",
      applicantDocuments2: [],

      // Emergency contact 1 information
      emergencyContactName1first: "",
      emergencyContactName1last: "",
      emergencyContactPhone1: "",

      // Emergency contact 2 information
      emergencyContactName2first: "",
      emergencyContactName2last: "",
      emergencyContactPhone2: "",

      // Applicant Signature
      applicantSignatures: [], // TODO upload Sidnature Documents

      // Reside Persons Inforamtion
      resideNames: "",
      relation1: "",
      relation2: "",
      age: "",

      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Wizard", link: "#" },
      ],
      activeTabProgress: 1,
      progressValue: 33,
      selectedFiles: [],
      selectedFiles2: [],
      customActiveTab: "1",
      redirectSecondsRemaining: 0,
      err: {}
    };



    this.toggleTabProgress.bind(this);
    // const [customActiveTab, setcustomActiveTab] = useState("1")
    // const toggleCustom = tab => {
    //     if (customActiveTab !== tab) {
    //         setcustomActiveTab(tab)
    //     }
    // }
    console.log("asd", this.state.date);
    this.getProperty()
    this.getData();
    this.getDate();


  }


  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    if (this.state.activeTabProgress === 3) {
      if (this.state.show) {
        this.scrollToBottom();
        this.setState({ show: false })
      }

    }

  }



  getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    return today;
  }

  // To get properties Data of company whos domain specified in query
  async getData() {
    const location = window.location.href;
    const position = location.search("name");
    const subStr = location.substring(position);

    // geting position of domain and domain it self
    const domainPosition = subStr.search("=");
    const companyDomain1 = subStr.substring(domainPosition + 1);
    // const companyDomain = subStr.substring(domainPosition + 1);
    const myArray = companyDomain1.split("&");
    const companyDomain = myArray[0]
    console.log('ana', companyDomain)

    // if Domain exists in url query param
    if (domainPosition != -1) {
      domain = companyDomain;
      await this.getProperties(companyDomain); // Getting properties of specified domain (Company)
      //this.getCities();
    }

  }

  // Get properties of specified Domain (company)
  async getProperties(companyDomain) {
    try {
      const response = await axios.post(GET_PROPERTY_URL, {
        domain: companyDomain,
      });
      // console.log(response.data.properties,'kkk545');
      this.setState({ propertyList: response.data.properties });
    } catch (error) {
      console.log("Unable to fetch");
    }
  }

  getProperty = async () => {
    try {
      const response = await axios.post("/property/applicant-option", {
        url: window.location.href
      })
  //  console.log(response,'kkk546')
      if (response.data.properties.length > 0) {
        this.setState({ exactProperty: response.data.properties[0] })
        this.setState({ logo: response.data.properties[0] })
        this.setState({ selectedPropertyTypes: response.data.properties[0].layouts })
        this.setState({ city: response.data.properties[0].location });
        this.setState({ property: response.data.properties[0].title });
        this.setState({ propertyID: response.data.properties[0]._id });
      }
    } catch (error) {
      console.log(error) // TODO proper Error
    }
  }



  // filtering property location (city) from duplicates
  getCities() {
    this.state.propertyList.map((property) => {
      this.state.cityList.push(property.location);
    });
    this.setState({
      cityList: this.removeDuplicateCities(this.state.cityList),
    });
  }

  // using hashtables to remove duplicates
  removeDuplicateCities(arr) {
    var seen = {};
    return arr.filter(function (item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }
  clear = () => {
    this.sigPad1.clear();
    this.setState({ trimmedDataURL1: null })
  };
  clear1 = () => {
    this.sigPad2.clear();
    this.setState({ trimmedDataURL2: null })
  };
  // this.setState({customActiveTab:2})
  toggleTabProgress(tab) {
    if (this.state.activeTabProgress !== tab) {
      if (tab >= 1 && tab <= 3) {
        this.setState({
          activeTabProgress: tab,
        });
        if (tab === 1) {
          this.setState({ progressValue: 33 });
        }
        if (tab === 2) {
          this.setState({ progressValue: 66 });
        }
        if (tab === 3) {
          this.setState({ progressValue: 100 });
        }
      }
    }
  }
  handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    this.setState({ selectedFiles: files });
  };
  handleAcceptedFiles2 = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    this.setState({ selectedFiles2: files });
  };
  // Submiting all the applicant inforamtion using axious
  
  async submitApplicantInformation(event) {
    event.preventDefault();
    //alert("hdhd");
    let submited = false;
    try {
      const saveSpinner = document.getElementById("saveSpinner");
      const failedSaveErrorIcon = document.getElementById(
        "failedSaveErrorIcon"
      );
      const nexticon = document.getElementById("nexticon");

      this.setState({ btnDisbale: true })
      saveSpinner.style.display = "inline-block";
      failedSaveErrorIcon.style.display = "none";
      nexticon.style.display = "none";

      let newarr = [];
      this.state.aplicant.map((data) => {
        newarr.push({
          name: data.first_n + data.last_n,
          relation: data.value1,
          age: data.value2,
        });
      });

      let petarr = [];
      let petinfo = {};
      this.state.Pets_Array.map((data) => {
        petarr.push({
          petType: data.pets,
          breed: data.breed,
          weight: data.weight,
          age: data.age,
        });
      });

      if (this.state.showpets) {
        petinfo = {
          numberOfPets: this.state.Pets_Array.length,
          petsInformation: petarr
        }
      }

      let apparr = [];

      apparr.push({
        firstname: this.state.applicantName,
        lastname: this.state.applicantNamelast,
        phone: this.state.applicantPhone,
        currentAddress: this.state.applicantCurrentAddress,
        howLong: this.state.howLong,
        email: this.state.applicantEmail,
        currentLandloard: this.state.currentLandloard,
        currentLandlordPhone: this.state.currentLandlordPhone,
        previousAddressInformation: {
          previousAddress: this.state.previousAddress,
          howLongAtPreviousAddress: this.state.howLongAtPreviousAddress,
          previousLandloardName: this.state.previousLandloardName,
          previousLandloardPhone: this.state.previousLandloardPhone,
        },

        currentEmployer: this.state.currentEmployer,
        currentEmployerFor: this.state.currentEmployerFor,
        occupation: this.state.occupation,
        annualIncome: this.state.annualIncome,
        manager: this.state.manager,
        currentEmployerPhone: this.state.currentEmployerPhone,
        documents: this.state.applicantDocuments,
      });

      if (this.state.applicantName2) {
        apparr.push({
          firstname: this.state.applicantName2,
          lastname: this.state.applicantName2last,
          phone: this.state.applicantPhone2,
          currentAddress: this.state.applicantCurrentAddress2,
          howLong: this.state.howLong2,
          email: this.state.applicantEmail2,
          currentLandloard: this.state.currentLandloard2,
          currentLandlordPhone: this.state.currentLandlordPhone2,
          previousAddressInformation: {
            previousAddress: this.state.previousAddress2,
            howLongAtPreviousAddress: this.state.howLongAtPreviousAddress2,
            previousLandloardName: this.state.previousLandloardName2,
            previousLandloardPhone: this.state.previousLandloardPhone2,
          },

          currentEmployer: this.state.currentEmployer2,
          currentEmployerFor: this.state.currentEmployerFor2,
          occupation: this.state.occupation2,
          annualIncome: this.state.annualIncome2,
          manager: this.state.manager2,
          currentEmployerPhone: this.state.currentEmployerPhone2,
          documents: this.state.applicantDocuments2,
        });
      }

      let signature_array = [];
      let data = {};

      signature_array.push({
        signature: this.state.trimmedDataURL1,
      });

      if (this.state.applicantName2) {
        signature_array.push({
          signature: this.state.trimmedDataURL2,
        });
      }

      if (!this.state.showpets) {


        data = {
          main: {
            city: this.state.city,
            property: this.state.property,
            propertyID: this.state.propertyID,
            date: this.state.date,
            layout: this.state.layoutname,
            layoutID: this.state.layout,
            source: this.state.source,
          },

          applicants: apparr,

          residePersons: newarr,
          emergencyContacts: [
            {
              // both emergency contacts are mendatory
              firstname: this.state.emergencyContactName1first,
              lastname: this.state.emergencyContactName1last,
              phone: this.state.emergencyContactPhone1,
              relation: this.state.relation1,
            },

            {
              firstname: this.state.emergencyContactName2first,
              lastname: this.state.emergencyContactName2last,
              phone: this.state.emergencyContactPhone2,
              relation: this.state.relation2,
            },
          ],

          signatures: signature_array,
          companyDomain: domain,

          // petsInformation: this.state.showpets?petinfo:false,
        }
      }
      else {
        data = {
          main: {
            city: this.state.city,
            property: this.state.property,
            propertyID: this.state.propertyID,
            date: this.state.date,
            layout: this.state.layoutname,
            layoutID: this.state.layout,
            source: this.state.source,
          },

          applicants: apparr,

          residePersons: newarr,
          emergencyContacts: [
            {
              // both emergency contacts are mendatory
              firstname: this.state.emergencyContactName1first,
              lastname: this.state.emergencyContactName1last,
              phone: this.state.emergencyContactPhone1,
              relation: this.state.relation1,
            },

            {
              firstname: this.state.emergencyContactName2first,
              lastname: this.state.emergencyContactName2last,
              phone: this.state.emergencyContactPhone2,
              relation: this.state.relation2,
            },
          ],

          signatures: signature_array,
          companyDomain: domain,
          petsInformation: petinfo,
        }
      }

      const response = await axios.post(APPLICANT_SUBMIT_URL, data);
      console.log('response ======', response);
      if (response.data.status == 201) {

        submited = true;
        await this.uploadDocuments(response.data.id);
        if (this.state.applicantName2) {
          await this.uploadDocuments2(response.data.id);
          console.log("hi2");
        }

        saveSpinner.style.display = "none";
        failedSaveErrorIcon.style.display = "none";
        nexticon.style.display = "inline-block";
        this.setState({ btnDisbale: false })
      } else {
        saveSpinner.style.display = "none";
        failedSaveErrorIcon.style.display = "none";
        nexticon.style.display = "inline-block";
        this.setState({ btnDisbale: false })
      }
      // this.setState.btnDisbale(false);
    } catch (error) {
      console.log("Unable to submit the application", error);
      this.setState({ btnDisbale: false })
      // this.setState.btnDisbale(false);
      /*  saveSpinner.style.display = "none";
       failedSaveErrorIcon.style.display = "inline-block";
       nexticon.style.display = "none"; */
    } finally {
      if (submited) {
        const applicantStepForm = document.getElementById("applicantStepForm");
        const thanks = document.getElementById("thanks");
        applicantStepForm.style.display = "none";
        thanks.style.display = "block";

        let redirectSecondsRemaining = 6;
        let int = setInterval(() => {
          redirectSecondsRemaining = redirectSecondsRemaining - 1;
          this.setState({ redirectSecondsRemaining });
          if (redirectSecondsRemaining === 0) {
            clearInterval(int);
            this.validurl();
          }
        }, 1000);
        this.setState({ btnDisbale: false })
        // this.setState.btnDisbale(false)
      }
    }
  }

  addaplicant = (key) => {
    //alert(key + 1)
    this.state.aplicant.push({
      index: key + 1,
      first_n: "",
      last_n: "",
      value1: "",
      value2: "",
    });
    this.setState(this.state.aplicant);
  }

  addPets = (key) => {
    // alert(key + 1)
    this.state.Pets_Array.push({
      index: key + 1,
      pets: "",
      breed: "",
      weight: "",
      age: "",
      name: "",
      showname: false
    });
    this.setState(this.state.Pets_Array);
  }



  minusaplicant = async (key) => {
    //alert(key)
    let ab = this.state.aplicant.filter((item) => item.index !== key);
    console.log(key, ab);
    await this.setState({ aplicant: ab });
  };

  minusPets = async (key) => {
    //alert(key)
    let ab = this.state.Pets_Array.filter((item) => item.index !== key);
    console.log(key, ab);
    await this.setState({ Pets_Array: ab });
  };

  updateValue = (e, idx, id) => {
    console.log(id)
    document.getElementById(id).innerText = ""
    const rows = [...this.state.aplicant]; // copy array because we don't want to mutate the previous one
    rows[idx].first_n = e.target.value;
    this.setState({
      rows,
    });
  };

  updateValue1 = (e, idx, id) => {
    document.getElementById(id).innerText = ""
    const rows = [...this.state.aplicant]; // copy array because we don't want to mutate the previous one
    rows[idx].value1 = e.target.value;
    this.setState({
      rows,
    });
  };

  updateValue3 = (e, idx, id) => {
    document.getElementById(id).innerText = ""
    const rows = [...this.state.aplicant]; // copy array because we don't want to mutate the previous one
    rows[idx].last_n = e.target.value;
    this.setState({
      rows,
    });
  };

  updateValue2 = (e, idx, id) => {
    document.getElementById(id).innerText = ""
    const rows = [...this.state.aplicant]; // copy array because we don't want to mutate the previous one
    rows[idx].value2 = e.target.value;
    this.setState({
      rows,
    });
  };

  NA = (idx) => {
    // document.getElementById(id).innerText = ""
    const rows = [...this.state.aplicant]; // copy array because we don't want to mutate the previous one
    rows[idx].value2 = "NA";
    rows[idx].value1 = "NA";
    rows[idx].last_n = "NA";
    rows[idx].first_n = "NA";
    this.setState({
      rows,
    });
  };

  updateName = (e, idx) => {
    const rows = [...this.state.Pets_Array]; // copy array because we don't want to mutate the previous one
    rows[idx].name = e.target.value;
    this.setState({
      rows,
    });
  };
  updateBreed = (e, idx, id) => {
    document.getElementById(id).innerText = ""
    const rows = [...this.state.Pets_Array]; // copy array because we don't want to mutate the previous one
    rows[idx].breed = e.target.value;
    this.setState({
      rows,
    });
  };

  updateWeight = (e, idx, id) => {
    document.getElementById(id).innerText = ""
    const rows = [...this.state.Pets_Array]; // copy array because we don't want to mutate the previous one
    rows[idx].weight = e.target.value;
    this.setState({
      rows,
    });
  };

  updateAge = (e, idx, id) => {
    document.getElementById(id).innerText = ""
    const rows = [...this.state.Pets_Array]; // copy array because we don't want to mutate the previous one
    rows[idx].age = e.target.value;
    this.setState({
      rows,
    });
  };

  updatePets = (e, idx, id) => {
    if (e.target.value === "Other") {
      const rows = [...this.state.Pets_Array]; // copy array because we don't want to mutate the previous one
      rows[idx].pets = e.target.value;
      rows[idx].showname = true;
      this.setState({
        rows,
      });
    }
    else {
      document.getElementById(id).innerText = ""
      const rows = [...this.state.Pets_Array]; // copy array because we don't want to mutate the previous one
      rows[idx].pets = e.target.value;
      rows[idx].showname = false;
      this.setState({
        rows,
      });
    }
  };

  uploadDocuments = async (ticketID) => {
    const formData = new FormData();
    var i = 0;
    while (i < this.state.selectedFiles.length) {
      formData.append(`file`, this.state.selectedFiles[i]);
      i++;
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${ticketID}`,
        applicant1:'applicant1'
      },
    };

    try {
      const response = await axios.post(
        "/applicant/upload-documents",
        formData,
        config
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  uploadDocuments2 = async (ticketID) => {
    const formData = new FormData();
    var i = 0;
    while (i < this.state.selectedFiles2.length) {
      formData.append(`file`, this.state.selectedFiles2[i]);
      i++;
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        id: `${ticketID}`,
        applicant2: 'applicant2'
      },
    };

    try {
      const response = await axios.post(
        "/applicant/upload-documents",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  // Getting date for signature

  validateApplicantForm2() {
    let apl2FormErrors = {
      applicantName2: false,
      applicantPhone2: false,
      applicantCurrentAddress2: false,
      howLong2: false,
      applicantEmail2: false,
      currentLandloard2: false,
      currentLandlordPhone2: false,
      previousLandloardName2: false,
      previousLandloardPhone2: false,
      howLongAtPreviousAddress2: false,
      currentEmployer2: false,
      currentEmployerFor2: false,
      occupation2: false,
      annualIncome2: false,
      manager2: false,
      currentEmployerPhone2: false,
      document2: false,
    };
    let formIsValid2 = true;
    if (this.state.fillApl2) {
      if (this.state.applicantName2 == "") {
        if (!this.state.applicantName2.match(/^[a-zA-Z ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["applicantName2"] = "Only Letters Allowed";
        }
      }
      /* if (
        this.state.applicantName2last == "" &&
        this.state.applicantName2 != ""
      ) {
        alert("djdd");
        formIsValid2 = false;
        apl2FormErrors["applicantName2last"] = "Name Cannot Be Empty";
        //console.log("in condition", formIsValid);
      }
   
      if (
        this.state.applicantName2last != "" &&
        this.state.applicantName2 != ""
      ) {
        if (!this.state.applicantName2last.match(/^[a-zA-Z ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["applicantName2last"] = "Only Letters Allowed";
        }
      } */

      if (this.state.applicantPhone2 == "") {
        formIsValid2 = false;
        apl2FormErrors["applicantPhone2"] = "Phone No Cannot Be Empty";
      }

      if (this.state.applicantPhone2 != "") {
        if (
          !this.state.applicantPhone2.match(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
          )
        ) {
          formIsValid2 = false;
          apl2FormErrors["applicantPhone2"] = "Enter Valid Phone No";
        }
      }
      if (
        this.state.applicantCurrentAddress2 == "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["applicantCurrentAddress2"] =
          "Address No Cannot Be Empty";
      }

      if (this.state.howLong2 == "") {
        formIsValid2 = false;
        apl2FormErrors["howLong2"] = "Cannot Be Empty";
      }

      if (this.state.howLong2 != "") {
        if (!this.state.howLong2.match(/^-?\d*(\.\d+)?$/)) {
          formIsValid2 = false;
          apl2FormErrors["howLong2"] = "Only Numbers are Allowed";
        }
      }
      // Empty Email Check
      if (this.state.applicantEmail2 == "") {
        formIsValid2 = false;
        apl2FormErrors["applicantEmail2"] = "Email Cannot Be Empty";
      }

      //  Email basic validation
      if (this.state.applicantEmail2 != "") {
        let lastAtPos = this.state.applicantEmail2.lastIndexOf("@");
        let lastDotPos = this.state.applicantEmail2.lastIndexOf(".");

        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            this.state.applicantEmail2.indexOf("@@") == -1 &&
            lastDotPos > 2 &&
            this.state.applicantEmail2.length - lastDotPos > 2
          )
        ) {
          formIsValid2 = false;
          apl2FormErrors["applicantEmail2"] = "Email Is Not Valid";
        }
      }
      // current Landloard
      if (this.state.currentLandloard2 == "") {
        formIsValid2 = false;
        apl2FormErrors["currentLandloard2"] = "Name Cannot Be Empty";
      }

      if (this.state.currentLandloard2 != "") {
        if (!this.state.currentLandloard2.match(/^[a-zA-Z ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["currentLandloard2"] = "Only Letters Allowed";
        }
      }
      if (
        this.state.currentLandlordPhone2 == "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["currentLandlordPhone2"] = "Phone No Cannot Be Empty";
      }

      if (
        this.state.currentLandlordPhone2 != "" &&
        this.state.applicantName2 != ""
      ) {
        if (
          !this.state.currentLandlordPhone2.match(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
          )
        ) {
          formIsValid2 = false;
          apl2FormErrors["currentLandlordPhone2"] = "Enter Valid Phone No";
        }
      }
      if (
        this.state.previousLandloardName2 == "" &&
        this.state.previousAddress2 != "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["previousLandloardName2"] = "Name Cannot Be Empty";
      } else {
        formIsValid2 = true;
        document.getElementById("previousLandloardName2").style.borderColor =
          "grey";
        //errors["previousLandloardPhone"] = "";
      }

      if (
        this.state.previousLandloardName2 != "" &&
        this.state.previousAddress2 != "" &&
        this.state.applicantName2 != ""
      ) {
        if (!this.state.previousLandloardName2.match(/^[a-zA-Z ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["previousLandloardName2"] = "Only letters Are Allowed";
        }
      }

      if (
        this.state.previousLandloardPhone2 == "" &&
        this.state.previousAddress2 != "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["previousLandloardPhone2"] = "Cannot be empty";
      } else {
        formIsValid2 = true;
        document.getElementById("previousLandloardPhone2").style.borderColor =
          "grey";
        //errors["previousLandloardPhone"] = "";
      }

      if (
        this.state.previousLandloardPhone2 != "" &&
        this.state.previousAddress2 != "" &&
        this.state.applicantName2 != ""
      ) {
        if (
          !this.state.previousLandloardPhone2.match(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
          )
        ) {
          formIsValid2 = false;
          apl2FormErrors["previousLandloardPhone2"] = "Enter Valid Phone No";
        }
      }

      /* if (this.state.previousAddress === "") {
        formIsValid = false;
        errors["previousAddress"] = "Address Cannot be empty";
      }  */

      if (
        this.state.howLongAtPreviousAddress2 == "" &&
        this.state.previousAddress2 != "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["howLongAtPreviousAddress2"] = "Cannot Be Empty";
      } else {
        formIsValid2 = true;
        document.getElementById("howLongAtPreviousAddress2").style.borderColor =
          "grey";
        //errors["previousLandloardPhone"] = "";
      }

      if (
        this.state.howLongAtPreviousAddress2 != "" &&
        this.state.previousAddress2 != "" &&
        this.state.applicantName2 != ""
      ) {
        if (!this.state.howLongAtPreviousAddress2.match(/^-?\d*(\.\d+)?$/)) {
          formIsValid2 = false;
          apl2FormErrors["howLongAtPreviousAddress2"] =
            "Only  Numbers Are Allowed";
        }
      }
      if (this.state.currentEmployer2 == "") {
        formIsValid2 = false;
        apl2FormErrors["currentEmployer2"] = "Name Cannot Be Empty";
      }

      if (this.state.currentEmployer2 != "") {
        if (!this.state.currentEmployer2.match(/^[a-zA-Z ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["currentEmployer2"] = "Only Letters Are Allowed";
        }
      }
      if (
        this.state.currentEmployerFor2 == "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["currentEmployerFor2"] = "Cannot be empty";
      }

      if (
        this.state.currentEmployerFor2 != "" &&
        this.state.applicantName2 != ""
      ) {
        if (!this.state.currentEmployerFor2.match(/^-?\d*(\.\d+)?$/)) {
          formIsValid2 = false;
          apl2FormErrors["currentEmployerFor2"] = "Only Numbers Are Allowed";
        }
      }
      if (this.state.occupation2 == "") {
        formIsValid2 = false;
        apl2FormErrors["occupation2"] = "Cannot be empty";
      }

      if (this.state.occupation2 != "") {
        if (!this.state.occupation2.match(/^[a-zA-Z0-9 ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["occupation2"] =
            "Only Letters And Numbers Are Allowed";
        }
      }

      if (this.state.annualIncome2 == "") {
        formIsValid2 = false;
        apl2FormErrors["annualIncome2"] = "Cannot be empty";
      }

      if (this.state.annualIncome2 != "") {
        if (!this.state.annualIncome2.match(/^[a-zA-Z0-9 ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["annualIncome2"] =
            "Only Letters And Numbers Are Allowed";
        }
      }

      if (this.state.selectedFiles2.length <= 0) {
        formIsValid2 = false;
        apl2FormErrors["document2"] = "Select Documents";
      }
      if (this.state.selectedFiles2.length > 0) {
        this.state.selectedFiles2.map((data) => {

          if (data.type === "image/png" || data.type === "image/jpg" || data.type === "image/jpeg") {
            console.log(data.type)
          }
          else {
            console.log(data.type)
            formIsValid2 = false;
            apl2FormErrors["document2"] = "Only Jpeg , jpg and png files are allowed";
          }
        })

      }

      if (this.state.manager2 == "") {
        formIsValid2 = false;
        apl2FormErrors["manager2"] = "Cannot be empty";
      }

      if (this.state.manager2 != "") {
        if (!this.state.manager2.match(/^[a-zA-Z ]+$/)) {
          formIsValid2 = false;
          apl2FormErrors["manager2"] = "Only letters Are Allowed";
        }
      }
      if (
        this.state.currentEmployerPhone2 == "" &&
        this.state.applicantName2 != ""
      ) {
        formIsValid2 = false;
        apl2FormErrors["currentEmployerPhone2"] = "Phone No Cannot be empty";
      }

      if (
        this.state.currentEmployerPhone2 != "" &&
        this.state.applicantName2 != ""
      ) {
        if (
          !this.state.currentEmployerPhone2.match(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
          )
        ) {
          formIsValid2 = false;
          apl2FormErrors["currentEmployerPhone2"] = "Enter Valid Phone No";
        }
      }
    }
    this.setState({ apl2FormErrors });
    return formIsValid2;
  }
  validateApplicantForm() {
    let aplFormErrors = {
      applicantName: false,
      applicantNamelast: false,
      applicantPhone: false,
      applicantEmail: false,
      currentLandloard: false,
      currentLandlordPhone: false,
      applicantCurrentAddress: false,
      howLong: false,
      previousLandloardName: false,
      previousLandloardPhone: false,
      howLongAtPreviousAddress: false,
      currentEmployer: false,
      currentEmployerFor: false,
      occupation: false,
      annualIncome: false,
      manager: false,
      currentEmployerPhone: false,
      document: false,
    };
    // Empty Name Check && Name only Latters

    if (this.state.applicantName === "") {
      formIsValid = false;
      aplFormErrors["applicantName"] = "Name Cannot Be Empty";
    }

    if (this.state.applicantName != "") {
      if (!this.state.applicantName.match(/^[a-zA-Z ]+$/)) {
        formIsValid = false;
        aplFormErrors["applicantName"] = "Only Letters Allowed";
      }
    }
    if (this.state.applicantNamelast === "") {
      formIsValid = false;
      aplFormErrors["applicantNamelast"] = "Name Cannot Be Empty";
    }

    if (this.state.applicantNamelast != "") {
      if (!this.state.applicantNamelast.match(/^[a-zA-Z ]+$/)) {
        formIsValid = false;
        aplFormErrors["applicantNamelast"] = "Only Letters Allowed";
      }
    }
    // Empty Phone Number Check && Phone Validation
    if (this.state.applicantPhone === "") {
      formIsValid = false;
      aplFormErrors["applicantPhone"] = "Phone No Cannot Be Empty";
    }

    if (this.state.applicantPhone != "") {
      if (
        !this.state.applicantPhone.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        formIsValid = false;
        aplFormErrors["applicantPhone"] = "Enter Valid Phone No";
      }
    }

    // Empty Email Check
    if (this.state.applicantEmail === "") {
      formIsValid = false;
      aplFormErrors["applicantEmail"] = "Email Cannot Be Empty";
    }

    //  Email basic validation
    if (this.state.applicantEmail != "") {
      let lastAtPos = this.state.applicantEmail.lastIndexOf("@");
      let lastDotPos = this.state.applicantEmail.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.applicantEmail.indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          this.state.applicantEmail.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        aplFormErrors["applicantEmail"] = "Email Is Not Valid";
      }
    }

    // current Landloard
    if (this.state.currentLandloard === "") {
      formIsValid = false;
      aplFormErrors["currentLandloard"] = "Name Cannot Be Empty";
    }

    if (this.state.currentLandloard != "") {
      if (!this.state.currentLandloard.match(/^[a-zA-Z ]+$/)) {
        formIsValid = false;
        aplFormErrors["currentLandloard"] = "Only Letters Allowed";
      }
    }

    if (this.state.currentLandlordPhone === "") {
      formIsValid = false;
      aplFormErrors["currentLandlordPhone"] = "Phone No Cannot Be Empty";
    }

    if (this.state.currentLandlordPhone != "") {
      if (
        !this.state.currentLandlordPhone.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        formIsValid = false;
        aplFormErrors["currentLandlordPhone"] = "Enter Valid Phone No";
      }
    }

    if (this.state.applicantCurrentAddress === "") {
      formIsValid = false;
      aplFormErrors["applicantCurrentAddress"] = "Address Cannot Be Empty";
    }

    if (this.state.howLong === "") {
      formIsValid = false;
      aplFormErrors["howLong"] = "Cannot Be Empty";
    }

    if (this.state.howLong != "") {
      if (!this.state.howLong.match(/^-?\d*(\.\d+)?$/)) {
        formIsValid = false;
        aplFormErrors["howLong"] = "Only Numbers are Allowed";
      }
    }

    // Previous Landloard
    if (
      this.state.previousLandloardName === "" &&
      this.state.previousAddress != ""
    ) {
      formIsValid = false;
      aplFormErrors["previousLandloardName"] = "Name Cannot Be Empty";
    } else {
      formIsValid = true;
      document.getElementById("previousLandloardName").style.borderColor =
        "grey";
      //errors["previousLandloardPhone"] = "";
    }

    if (
      this.state.previousLandloardName != "" &&
      this.state.previousAddress != ""
    ) {
      if (!this.state.previousLandloardName.match(/^[a-zA-Z ]+$/)) {
        formIsValid = false;
        aplFormErrors["previousLandloardName"] = "Only letters Are Allowed";
      }
    }

    if (
      this.state.previousLandloardPhone === "" &&
      this.state.previousAddress != ""
    ) {
      formIsValid = false;
      aplFormErrors["previousLandloardPhone"] = "Cannot be empty";
    } else {
      formIsValid = true;
      document.getElementById("previousLandloardPhone").style.borderColor =
        "grey";
      //errors["previousLandloardPhone"] = "";
    }

    if (
      this.state.previousLandloardPhone != "" &&
      this.state.previousAddress != ""
    ) {
      if (
        !this.state.previousLandloardPhone.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        formIsValid = false;
        aplFormErrors["previousLandloardPhone"] = "Enter Valid Phone No";
      }
    }

    /* if (this.state.previousAddress === "") {
      formIsValid = false;
      errors["previousAddress"] = "Address Cannot be empty";
    }  */

    if (
      this.state.howLongAtPreviousAddress === "" &&
      this.state.previousAddress != ""
    ) {
      formIsValid = false;
      aplFormErrors["howLongAtPreviousAddress"] = "Cannot Be Empty";
    } else {
      formIsValid = true;
      document.getElementById("howLongAtPreviousAddress").style.borderColor =
        "grey";
      //errors["previousLandloardPhone"] = "";
    }

    if (
      this.state.howLongAtPreviousAddress != "" &&
      this.state.previousAddress != ""
    ) {
      if (!this.state.howLongAtPreviousAddress.match(/^-?\d*(\.\d+)?$/)) {
        formIsValid = false;
        aplFormErrors["howLongAtPreviousAddress"] = "Only Numbers Are Allowed";
      }
    }

    // Current Employer
    if (this.state.currentEmployer === "") {
      formIsValid = false;
      aplFormErrors["currentEmployer"] = "Name Cannot Be Empty";
    }

    if (this.state.currentEmployer != "") {
      if (!this.state.currentEmployer.match(/^[a-zA-Z ]+$/)) {
        formIsValid = false;
        aplFormErrors["currentEmployer"] = "Only Letters Are Allowed";
      }
    }

    if (this.state.currentEmployerFor === "") {
      formIsValid = false;
      aplFormErrors["currentEmployerFor"] = "Cannot be empty";
    }

    if (this.state.currentEmployerFor != "") {
      if (!this.state.currentEmployerFor.match(/^-?\d*(\.\d+)?$/)) {
        formIsValid = false;
        aplFormErrors["currentEmployerFor"] = "Only Numbers Are Allowed";
      }
    }

    if (this.state.occupation === "") {
      formIsValid = false;
      aplFormErrors["occupation"] = "Cannot be empty";
    }

    if (this.state.occupation != "") {
      if (!this.state.occupation.match(/^[a-zA-Z0-9 ]+$/)) {
        formIsValid = false;
        aplFormErrors["occupation"] = "Only Letters And Numbers Are Allowed";
      }
    }

    if (this.state.annualIncome === "") {
      formIsValid = false;
      aplFormErrors["annualIncome"] = "Cannot be empty";
    }

    if (this.state.annualIncome != "") {
      if (!this.state.annualIncome.match(/^[a-zA-Z0-9 ]+$/)) {
        formIsValid = false;
        aplFormErrors["annualIncome"] = "Only Letters And Numbers Are Allowed";
      }
    }

    if (this.state.manager === "") {
      formIsValid = false;
      aplFormErrors["manager"] = "Cannot be empty";
    }

    if (this.state.manager != "") {
      if (!this.state.manager.match(/^[a-zA-Z ]+$/)) {
        formIsValid = false;
        aplFormErrors["manager"] = "Only letters Are Allowed";
      }
    }

    if (this.state.selectedFiles.length <= 0) {
      formIsValid = false;
      aplFormErrors["document"] = "Select Documents";
    }
    if (this.state.selectedFiles.length > 0) {
      this.state.selectedFiles.map((data) => {

        if (data.type === "image/png" || data.type === "image/jpg" || data.type === "image/jpeg") {
          console.log(data.type)
        }
        else {
          console.log(data.type)
          formIsValid = false;
          aplFormErrors["document"] = "Only Jpeg , jpg and png files are allowed";
        }
      })

    }
    if (this.state.currentEmployerPhone === "") {
      formIsValid = false;
      aplFormErrors["currentEmployerPhone"] = "Phone No Cannot be empty";
    }

    if (this.state.currentEmployerPhone != "") {
      if (
        !this.state.currentEmployerPhone.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        formIsValid = false;
        aplFormErrors["currentEmployerPhone"] = "Enter Valid Phone No";
      }
    }

    this.setState({ aplFormErrors });
    console.log("manish", formIsValid);
    return formIsValid;
  }

  validateMainForm() {
    let isFormValid = true;

    let mainFormErrors = {
      city: false,
      property: false,
      layout: false,
      source: false,
    };

    if (this.state.city === "Select" || this.state.city === "") {
      mainFormErrors["city"] = "Please Select a location";
      isFormValid = false;
    }
    if (this.state.property === "Select" || this.state.property === "") {
      mainFormErrors["property"] = "Please Select a Property";
      isFormValid = false;
    }
    if (this.state.layout === "Select" || this.state.layout === "") {
      mainFormErrors["layout"] = "Please Select a Layout";
      isFormValid = false;
    }

    if (this.state.source === "Select" || this.state.source === "") {
      mainFormErrors["source"] = "Please Select a Source";
      isFormValid = false;
    }
    this.setState({ mainFormErrors });

    return isFormValid;
  }
  validateInformationform() {
    let errors = {};
    let formIsValid = true;

    if (this.state.petss == "") {
      formIsValid = false;
      errors["divhidshowpet"] = "Select yes or no";
    }
    if (this.state.petss !== "") {
      formIsValid = true;
      errors["divhidshowpet"] = "";
    }

    if (this.state.showpets) {

      this.state.Pets_Array.map((val, key) => {
        if (val.pets == "") {

          formIsValid = false;
          errors["pets" + key] = "Only Letters Allowed";
          errors["divpets" + key] = "Select pet";
        }
        if (val.breed == "") {
          formIsValid = false;
          errors["breed" + key] = "Only Letters Allowed";
          errors["divbreed" + key] = "Only Letters Allowed";
        }

        if (val.weight == "" || val.weight % 1 !== 0) {
          formIsValid = false;
          errors["weight" + key] = "Only Numbers Allowed";
          errors["divweight" + key] = "Only Numbers Allowed";
        }

        if (val.age == "" || val.age % 1 !== 0) {
          formIsValid = false;
          errors["age" + key] = "Only Numbers Allowed";
          errors["divage" + key] = "Only Numbers Allowed";
        }
      });

    }

    this.state.aplicant.map((val, key) => {
      if (val.first_n == "") {
        formIsValid = false;
        errors["first" + key] = "Only Letters Allowed";
        errors["div" + key] = "Only Letters Allowed";
      }
      if (val.last_n == "") {
        formIsValid = false;
        errors["last" + key] = "Only Letters Allowed";
        errors["div1" + key] = "Only Letters Allowed";
      }

      if (val.value1 == "") {
        formIsValid = false;
        errors["mrelation" + key] = "Only Letters Allowed";
        errors["div2" + key] = "Only Letters Allowed";
      }

      if (val.value2 !== "NA") {
        if (val.value2 == "" || val.value2 % 1 !== 0) {
          formIsValid = false;
          errors["mage" + key] = "Only Numbers Allowed";
          errors["div3" + key] = "Only Numbers Allowed";
        }
      }


    });

    if (!this.state.emergencyContactName1first.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["emergencyContactName1first"] = "Only Letters Allowed";
    }

    if (!this.state.emergencyContactName1last.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["emergencyContactName1last"] = "Only Letters Allowed";
    }

    if (this.state.emergencyContactPhone1 === "") {
      formIsValid = false;
      errors["emergencyContactPhone1"] = "Phone No Cannot Be Empty";
    }

    if (this.state.emergencyContactPhone1 != "") {
      if (
        !this.state.emergencyContactPhone1.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        formIsValid = false;
        errors["emergencyContactPhone1"] = "Enter Valid Phone No";
      }
    }

    if (!this.state.relation1.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["relation1"] = "Only Letters Allowed";
    }

    if (!this.state.relation2.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["relation2"] = "Only Letters Allowed";
    }

    if (!this.state.emergencyContactName2first.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["emergencyContactName2first"] = "Only Letters Allowed";
    }
    if (!this.state.emergencyContactName2last.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["emergencyContactName2last"] = "Only Letters Allowed";
    }

    if (this.state.emergencyContactPhone2 === "") {
      formIsValid = false;
      errors["emergencyContactPhone2"] = "Phone No Cannot Be Empty";
    }

    if (this.state.emergencyContactPhone2 != "") {
      if (
        !this.state.emergencyContactPhone2.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
      ) {
        formIsValid = false;
        errors["emergencyContactPhone2"] = "Enter Valid Phone No";
      }
    }

    this.setState({ err: errors })
    return [formIsValid, errors];
  }

  showPets = (e) => {
    this.setState({ yes: true })
    this.setState({ no: false })
    e.preventDefault();
    this.setState({ showpets: true });
    this.setState({ showpets: true });
    this.setState({ petss: true });
  };

  showPets1 = (e) => {
    e.preventDefault();
    this.setState({ showpets1: true });
  };

  hidePets = (e) => {
    e.preventDefault();
    this.setState({ yes: false })
    this.setState({ no: true })
    this.setState({ showpets: false });
    this.setState({ showpets1: false });
    this.setState({ petss: false });
  };



  render() {
    console.log('btnDisable====',this.state.btnDisbale);
    return (
      <React.Fragment>
        <div ref={(el) => { this.messagesEnd = el; }}
        >

          <div className="bg-soft-light min-vh-100 py-5">
            <div className="py-4">
              <Container>
                <Row>
                  <Col lg={12}>
                    <Card id="applicantStepForm">
                      <CardBody className="tickt-bdy">
                        <Row className="tickt-frm-hd justify-content-center mt-3">
                          <div className="col-xl-8 col-lg-10">
                            <div className="logo-top text-center">
                              {this.state.exactProperty?.companies?.logo ? <img width={150} src={this.state.exactProperty?.companies?.logo } alt="LOGO" /> : <h2>{this.state.exactProperty?.company}</h2>}
                              
                            </div>
                            <div className="hd-frm text-center">
                              <h2>Resident Application Form</h2>
                            </div>
                            {/* <Link className="hd-frm" to="/">GSK Properties</Link> */}
                          </div>
                        </Row>
                        <Row className="justify-content-center mt-3">
                          <div className="col-xl-12 col-lg-12">
                            <div
                              id="progrss-wizard"
                              className="twitter-bs-wizard"
                            >
                              <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                <NavItem>
                                  <NavLink
                                    className={classnames({
                                      active: this.state.activeTabProgress === 1,
                                    })}
                                  >
                                    <div
                                      className="step-icon"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Seller Details"
                                    >
                                      <i className="bx bx-list-ul"></i>
                                    </div>
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    className={classnames({
                                      active: this.state.activeTabProgress === 2,
                                    })}
                                  >
                                    <div
                                      className="step-icon"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Company Document"
                                    >
                                      <i className="bx bx-book-bookmark"></i>
                                    </div>
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    className={classnames({
                                      active: this.state.activeTabProgress === 3,
                                    })}
                                  >
                                    <div
                                      className="step-icon"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Bank Details"
                                    >
                                      <i className="bx bx-list-ul"></i>
                                    </div>
                                  </NavLink>
                                </NavItem>
                              </ul>

                              <div id="bar" className="mt-4">
                                <Progress
                                  color="success"
                                  striped
                                  animated
                                  value={this.state.progressValue}
                                />
                              </div>

                              <form className="mt-5">
                                <TabContent
                                  activeTab={this.state.activeTabProgress}
                                  className="twitter-bs-wizard-tab-content"
                                >
                                  <TabPane tabId={1}>

                                    <form>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <label htmlFor="progresspill-firstname-input">
                                              City *
                                            </label>
                                            <select
                                              id="city"
                                              className="form-select"
                                            >
                                              <option value={this.state.exactProperty.location}>{this.state.exactProperty.location} </option>

                                            </select>
                                            {this.state.mainFormErrors.city && (
                                              <Label style={{ color: "red" }}>
                                                {this.state.mainFormErrors.city}
                                              </Label>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <label htmlFor="progresspill-lastname-input">
                                              Property *
                                            </label>
                                            <select
                                              id="property"
                                              className="form-select"
                                            >
                                              <option value={this.state.exactProperty.title}>{this.state.exactProperty.title} </option>
                                            </select>
                                            {this.state.mainFormErrors
                                              .property && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.mainFormErrors
                                                      .property
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              htmlFor="example-date-input"
                                              className="form-Label"
                                            >
                                              Moving date *
                                            </Label>
                                            <Input
                                              onChange={(e) => {
                                                this.setState({
                                                  date: e.target.value,
                                                });
                                                console.log(e.target.value);
                                              }}
                                              className="form-control"
                                              type="date"
                                              defaultValue={this.getDate()}
                                              id="example-date-input"
                                            />
                                            {this.state.mainFormErrors.date && (
                                              <Label style={{ color: "red" }}>
                                                {this.state.mainFormErrors.date}
                                              </Label>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <label htmlFor="progresspill-phoneno-input">
                                              Select Layout *
                                            </label>
                                            <select
                                              id="layout"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  layout: e.target.value,
                                                  layoutname:
                                                    e.target[
                                                      e.target.selectedIndex
                                                    ].getAttribute("data-order"),
                                                });
                                              }}
                                              className="form-select"
                                            >
                                              <option>Select</option>
                                              {this.state.selectedPropertyTypes.map(
                                                (cata) => (
                                                  <option
                                                    value={cata._id}
                                                    data-order={cata.layoutName}
                                                  >
                                                    {cata.layoutName}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                            {this.state.mainFormErrors.layout && (
                                              <Label style={{ color: "red" }}>
                                                {this.state.mainFormErrors.layout}
                                              </Label>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <label htmlFor="progresspill-phoneno-input">
                                              How Did You Hear About Us? *
                                            </label>
                                            <select
                                              id="source"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  source: e.target.value,
                                                });
                                              }}
                                              className="form-select"
                                            >
                                              <option>Select</option>
                                              <option>Facebook</option>
                                              <option>Google</option>
                                              <option>GSK Website</option>
                                              <option>Other</option>
                                              <option>Referral</option>
                                              <option>Rent Board</option>
                                              <option>Rent Faster</option>
                                            </select>
                                            {this.state.mainFormErrors.source && (
                                              <Label style={{ color: "red" }}>
                                                {this.state.mainFormErrors.source}
                                              </Label>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                  </TabPane>
                                  <TabPane tabId={2}>
                                    {/* <Nav
                                    tabs
                                    className="nav-tabs-custom nav-justified"
                                  > */}
                                    {/* <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active:
                                            this.state.customActiveTab === "1",
                                        })}
                                        onClick={() => {
                                          this.setState({
                                            customActiveTab: "1",
                                          });
                                        }}
                                      >
                                        <span className="d-block d-sm-none">
                                          <i className="fas fa-home"></i>
                                        </span>
                                        <span className="d-none d-sm-block">
                                          Applicant 1
                                        </span>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active:
                                            this.state.customActiveTab === "2",
                                        })}
                                        onClick={() => {
                                          this.setState({
                                            customActiveTab: "2",
                                          });
                                        }}
                                      >
                                        <span className="d-block d-sm-none">
                                          <i className="fas fa-home"></i>
                                        </span>
                                        <span className="d-none d-sm-block">
                                          Applicant 2
                                        </span>
                                      </NavLink>
                                    </NavItem> */}
                                    {/* </Nav>
                                  <TabContent
                                    activeTab={this.state.customActiveTab}
                                    className="p-3 text-muted"
                                  >
                                    <TabPane tabId="1"> */}
                                    <form>
                                      <div className="row mb-3">
                                        <div className="col-lg-12">
                                          <div className="frm-hd mt-3 mb-3">
                                            <h4>APPLICANT # 1</h4>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-3">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-name-input"
                                            >
                                              First Name *
                                            </Label>
                                            <Input
                                              id="applicantName"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  applicantName: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .applicantName && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .applicantName
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-3">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-name-input"
                                            >
                                              Last Name *
                                            </Label>
                                            <Input
                                              id="applicantNamelast"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  applicantNamelast:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .applicantNamelast && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .applicantNamelast
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-phn-input"
                                            >
                                              Phone *
                                            </Label>
                                            <Input
                                              id="applicantPhone"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  applicantPhone: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            // placeholder="Enter phonenumber"
                                            />
                                            {this.state.aplFormErrors
                                              .applicantPhone && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .applicantPhone
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-address-input"
                                            >
                                              Current address *
                                            </Label>
                                            <Input
                                              id="applicantCurrentAddress"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  applicantCurrentAddress:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .applicantCurrentAddress && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .applicantCurrentAddress
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-addrs-input"
                                            >
                                              How long at current address? (Years)
                                              *
                                            </Label>
                                            <Input
                                              id="howLong"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  howLong: e.target.value,
                                                });
                                              }}
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors.howLong && (
                                              <Label style={{ color: "red" }}>
                                                {this.state.aplFormErrors.howLong}
                                              </Label>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-email-input"
                                            >
                                              Email *
                                            </Label>
                                            <Input
                                              id="applicantEmail"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  applicantEmail: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .applicantEmail && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .applicantEmail
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-name-input"
                                            >
                                              Current landlord's name *
                                            </Label>
                                            <Input
                                              id="currentLandloard"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  currentLandloard:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .currentLandloard && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .currentLandloard
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-phone-input"
                                            >
                                              Landlord's phone *
                                            </Label>
                                            <Input
                                              id="currentLandlordPhone"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  currentLandlordPhone:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .currentLandlordPhone && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .currentLandlordPhone
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-address-input"
                                            >
                                              Previous address
                                            </Label>
                                            <Input
                                              id="previousAddress"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  previousAddress: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .previousAddress && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .previousAddress
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-time-input"
                                            >
                                              How long at previous address?
                                              (Years)
                                            </Label>
                                            <Input
                                              id="howLongAtPreviousAddress"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  howLongAtPreviousAddress:
                                                    e.target.value,
                                                });
                                              }}
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .howLongAtPreviousAddress && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .howLongAtPreviousAddress
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-land-input"
                                            >
                                              Previous landlord's name
                                            </Label>
                                            <Input
                                              id="previousLandloardName"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  previousLandloardName:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .previousLandloardName && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .previousLandloardName
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-phn-input"
                                            >
                                              Phone
                                            </Label>
                                            <Input
                                              id="previousLandloardPhone"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  previousLandloardPhone:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .previousLandloardPhone && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .previousLandloardPhone
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-time-input"
                                            >
                                              Current employer *
                                            </Label>
                                            <Input
                                              id="currentEmployer"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  currentEmployer: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .currentEmployer && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .currentEmployer
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-land-input"
                                            >
                                              How long at current employer?
                                              (Years) *
                                            </Label>
                                            <Input
                                              id="currentEmployerFor"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  currentEmployerFor:
                                                    e.target.value,
                                                });
                                              }}
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .currentEmployerFor && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .currentEmployerFor
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-occ-input"
                                            >
                                              Occupation *
                                            </Label>
                                            <Input
                                              id="occupation"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  occupation: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .occupation && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .occupation
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-income-input"
                                            >
                                              Annual income *
                                            </Label>
                                            <Input
                                              id="annualIncome"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  annualIncome: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .annualIncome && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .annualIncome
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-supr-input"
                                            >
                                              Supervisor/Manager *
                                            </Label>
                                            <Input
                                              id="manager"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  manager: e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors.manager && (
                                              <Label style={{ color: "red" }}>
                                                {this.state.aplFormErrors.manager}
                                              </Label>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-phn-input"
                                            >
                                              Phone *
                                            </Label>
                                            <Input
                                              id="currentEmployerPhone"
                                              onChange={(e) => {
                                                e.target.style.borderColor =
                                                  "grey";
                                                this.setState({
                                                  currentEmployerPhone:
                                                    e.target.value,
                                                });
                                              }}
                                              type="text"
                                              className="form-control"
                                            />
                                            {this.state.aplFormErrors
                                              .currentEmployerPhone && (
                                                <Label style={{ color: "red" }}>
                                                  {
                                                    this.state.aplFormErrors
                                                      .currentEmployerPhone
                                                  }
                                                </Label>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <div className="mb-3">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-firstname-input"
                                            >
                                              Attach 2 pieces of Identification
                                              Documents *
                                            </Label>
                                            <Dropzone
                                              onDrop={(acceptedFiles) =>
                                                this.handleAcceptedFiles(
                                                  acceptedFiles
                                                )
                                              }
                                            >
                                              {({
                                                getRootProps,
                                                getInputProps,
                                              }) => (
                                                <div className="dropzone">
                                                  <div
                                                    className="dz-message needsclick mt-2"
                                                    {...getRootProps()}
                                                  >
                                                    <input {...getInputProps()} accept=".jpg,.jpeg,.png" />
                                                    <div className="mb-3">
                                                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                    </div>
                                                    <h4>
                                                      Drop files here or click to
                                                      upload.
                                                    </h4>
                                                  </div>
                                                </div>
                                              )}
                                            </Dropzone>
                                            <div
                                              className="dropzone-previews mt-3"
                                              id="file-previews"
                                            >
                                              {this.state.selectedFiles &&
                                                this.state.selectedFiles.map(
                                                  (f, i) => {
                                                    return (
                                                      <Card
                                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                        key={i + "-file"}
                                                      >
                                                        <div className="p-2">
                                                          <Row className="align-items-center">
                                                            <Col className="col-auto">
                                                              <img
                                                                data-dz-thumbnail=""
                                                                height="80"
                                                                className="avatar-sm rounded bg-light"
                                                                alt={f.name}
                                                                src={f.preview}
                                                              />
                                                            </Col>
                                                            <Col>
                                                              <Link
                                                                to="#"
                                                                className="text-muted font-weight-bold"
                                                              >
                                                                {f.name}
                                                              </Link>
                                                              <p className="mb-0">
                                                                <strong>
                                                                  {
                                                                    f.formattedSize
                                                                  }
                                                                </strong>
                                                              </p>
                                                            </Col>
                                                            <Col className="trash-btn">
                                                              <button
                                                                type="button"
                                                                className="btn btn-soft-secondary waves-effect waves-light"
                                                                onClick={() => {
                                                                  let selectedFiles =
                                                                    this.state.selectedFiles.filter(
                                                                      (file) =>
                                                                        file !== f
                                                                    );
                                                                  this.setState({
                                                                    selectedFiles,
                                                                  });
                                                                }}
                                                              >
                                                                <i className="bx bx-trash-alt"></i>
                                                              </button>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Card>
                                                    );
                                                  }
                                                )}
                                              {this.state.aplFormErrors
                                                .document && (
                                                  <Label style={{ color: "red" }}>
                                                    {
                                                      this.state.aplFormErrors
                                                        .document
                                                    }
                                                  </Label>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                    {/* </TabPane>
                                    <TabPane tabId="2"> */}
                                    <form>
                                      <div className="row mb-3">
                                        <div className="col-lg-12">
                                          <div className="frm-hd mt-3 mb-3 d-inline-block">
                                            <h4>APPLICANT # 2</h4>
                                            <div className="form-check ml-3 d-inline-block">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="apl2Check"
                                                value={this.state.fillApl2}
                                                onChange={(e) => {
                                                  console.log(
                                                    `Check biox checked`,
                                                    e.target.value
                                                  );
                                                  this.setState({
                                                    fillApl2:
                                                      !this.state.fillApl2,
                                                  });
                                                }}
                                              />
                                              <label
                                                className="form-check-label text-sm"
                                                htmlFor="apl2Check"
                                              >
                                                Fill Second Applicant Form
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {Boolean(this.state.fillApl2) && (
                                        <div class="row">
                                          <div class="col-12">
                                            <div className="row">
                                              <div className="col-lg-3">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-name-input"
                                                  >
                                                    First Name *
                                                  </Label>
                                                  <Input
                                                    id="applicantName2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        applicantName2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .applicantName2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .applicantName2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-3">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-name-input"
                                                  >
                                                    Last Name *
                                                  </Label>
                                                  <Input
                                                    id="applicantName2last"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        applicantName2last:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .applicantName2last && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .applicantName2last
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-phn-input"
                                                  >
                                                    Phone *
                                                  </Label>
                                                  <Input
                                                    id="applicantPhone2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        applicantPhone2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .applicantPhone2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .applicantPhone2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-12">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-address-input"
                                                  >
                                                    Current address *
                                                  </Label>
                                                  <Input
                                                    id="applicantCurrentAddress2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        applicantCurrentAddress2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .applicantCurrentAddress2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .applicantCurrentAddress2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-addrs-input"
                                                  >
                                                    How long at current address?
                                                    (Years) *
                                                  </Label>
                                                  <Input
                                                    id="howLong2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        howLong2: e.target.value,
                                                      });
                                                    }}
                                                    type="number"
                                                    onWheel={(e) => e.target.blur()}
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .howLong2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .howLong2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-email-input"
                                                  >
                                                    Email *
                                                  </Label>
                                                  <Input
                                                    id="applicantEmail2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        applicantEmail2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .applicantEmail2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .applicantEmail2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-name-input"
                                                  >
                                                    Current landlord's name *
                                                  </Label>
                                                  <Input
                                                    id="currentLandloard2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        currentLandloard2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .currentLandloard2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .currentLandloard2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-phone-input"
                                                  >
                                                    Landlord's phone *
                                                  </Label>
                                                  <Input
                                                    id="currentLandlordPhone2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        currentLandlordPhone2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .currentLandlordPhone2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .currentLandlordPhone2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-12">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-address-input"
                                                  >
                                                    Previous address
                                                  </Label>
                                                  <Input
                                                    id="previousAddress2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        previousAddress2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .previousAddress2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .previousAddress2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-time-input"
                                                  >
                                                    How long at previous Address?
                                                    (Years)
                                                  </Label>
                                                  <Input
                                                    id="howLongAtPreviousAddress2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        howLongAtPreviousAddress2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="number"
                                                    onWheel={(e) => e.target.blur()}
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .howLongAtPreviousAddress2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .howLongAtPreviousAddress2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-land-input"
                                                  >
                                                    Previous landlord's name
                                                  </Label>
                                                  <Input
                                                    id="previousLandloardName2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        previousLandloardName2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .previousLandloardName2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .previousLandloardName2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-phn-input"
                                                  >
                                                    Phone
                                                  </Label>
                                                  <Input
                                                    id="previousLandloardPhone2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        previousLandloardPhone2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .previousLandloardPhone2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .previousLandloardPhone2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-time-input"
                                                  >
                                                    Current employer *
                                                  </Label>
                                                  <Input
                                                    id="currentEmployer2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        currentEmployer2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .currentEmployer2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .currentEmployer2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-land-input"
                                                  >
                                                    How long at current employer?
                                                    (Years) *
                                                  </Label>
                                                  <Input
                                                    id="currentEmployerFor2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        currentEmployerFor2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="number"
                                                    onWheel={(e) => e.target.blur()}
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .currentEmployerFor2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .currentEmployerFor2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-occ-input"
                                                  >
                                                    Occupation *
                                                  </Label>
                                                  <Input
                                                    id="occupation2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        occupation2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                </div>
                                                {this.state.apl2FormErrors
                                                  .occupation2 && (
                                                    <Label style={{ color: "red" }}>
                                                      {
                                                        this.state.apl2FormErrors
                                                          .occupation2
                                                      }
                                                    </Label>
                                                  )}
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-income-input"
                                                  >
                                                    Annual income *
                                                  </Label>
                                                  <Input
                                                    id="annualIncome2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        annualIncome2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .annualIncome2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .annualIncome2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-supr-input"
                                                  >
                                                    Supervisor/Manager *
                                                  </Label>
                                                  <Input
                                                    id="manager2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        manager2: e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .manager2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .manager2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-phn-input"
                                                  >
                                                    Phone *
                                                  </Label>
                                                  <Input
                                                    id="currentEmployerPhone2"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.setState({
                                                        currentEmployerPhone2:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                  />
                                                  {this.state.apl2FormErrors
                                                    .currentEmployerPhone2 && (
                                                      <Label
                                                        style={{ color: "red" }}
                                                      >
                                                        {
                                                          this.state.apl2FormErrors
                                                            .currentEmployerPhone2
                                                        }
                                                      </Label>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-12">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-firstname-input"
                                                  >
                                                    Attach 2 pieces of
                                                    Identification Documents *
                                                  </Label>
                                                  <Dropzone
                                                    onDrop={(acceptedFiles) =>
                                                      this.handleAcceptedFiles2(
                                                        acceptedFiles
                                                      )
                                                    }
                                                  >
                                                    {({
                                                      getRootProps,
                                                      getInputProps,
                                                    }) => (
                                                      <div className="dropzone">
                                                        <div
                                                          className="dz-message needsclick mt-2"
                                                          {...getRootProps()}
                                                        >
                                                          <input
                                                            {...getInputProps()}
                                                            accept=".jpg,.jpeg,.png"
                                                          />
                                                          <div className="mb-3">
                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                          </div>
                                                          <h4>
                                                            Drop files here or
                                                            click to upload.
                                                          </h4>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Dropzone>
                                                  <div
                                                    className="dropzone-previews mt-3"
                                                    id="file-previews"
                                                  >
                                                    {this.state.selectedFiles2 &&
                                                      this.state.selectedFiles2.map(
                                                        (f, i) => {
                                                          return (
                                                            <Card
                                                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                              key={i + "-file"}
                                                            >
                                                              <div className="p-2">
                                                                <Row className="align-items-center">
                                                                  <Col className="col-auto">
                                                                    <img
                                                                      data-dz-thumbnail=""
                                                                      height="80"
                                                                      className="avatar-sm rounded bg-light"
                                                                      alt={f.name}
                                                                      src={
                                                                        f.preview
                                                                      }
                                                                    />
                                                                  </Col>
                                                                  <Col>
                                                                    <Link
                                                                      to="#"
                                                                      className="text-muted font-weight-bold"
                                                                    >
                                                                      {f.name}
                                                                    </Link>
                                                                    <p className="mb-0">
                                                                      <strong>
                                                                        {
                                                                          f.formattedSize
                                                                        }
                                                                      </strong>
                                                                    </p>
                                                                  </Col>
                                                                  <Col className="trash-btn">
                                                                    <button
                                                                      type="button"
                                                                      className="btn btn-soft-secondary waves-effect waves-light"
                                                                      onClick={() => {
                                                                        let selectedFiles2 =
                                                                          this.state.selectedFiles2.filter(
                                                                            (
                                                                              file
                                                                            ) =>
                                                                              file !==
                                                                              f
                                                                          );
                                                                        this.setState(
                                                                          {
                                                                            selectedFiles2,
                                                                          }
                                                                        );
                                                                      }}
                                                                    >
                                                                      <i className="bx bx-trash-alt"></i>
                                                                    </button>
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Card>
                                                          );
                                                        }
                                                      )}
                                                    {this.state.apl2FormErrors
                                                      .document2 && (
                                                        <Label
                                                          style={{ color: "red" }}
                                                        >
                                                          {
                                                            this.state.apl2FormErrors
                                                              .document2
                                                          }
                                                        </Label>
                                                      )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </form>
                                    {/* </TabPane>
                                  </TabContent> */}
                                  </TabPane>
                                  <TabPane tabId={3}>
                                    <div>
                                      <form>
                                        <div className="row">
                                          <div className="col">
                                            <div className="frm-hd my-3">
                                              <h4>Other information</h4>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mb-3">
                                          <h6 className="d-inline-block me-3">Do you have pets ?</h6>
                                          <button
                                            // className="btn btn-primary"
                                            className={this.state.yes ? "btn btn-primary ms-2" : " btn btn-secondary ms-2"}
                                            onClick={this.showPets}
                                          >
                                            YES
                                          </button>
                                          <button
                                            className={this.state.no ? "btn btn-primary ms-2" : " btn btn-secondary ms-2"}
                                            onClick={this.hidePets}
                                          >
                                            NO
                                          </button>
                                          <div id={"divhidshowpet"} style={{ color: "red" }}></div>
                                        </div>
                                        {/* {this.state.showpets ? (
                                        <div className="mb-3">
                                          <h6 className="d-inline-block me-3">Add pets</h6>
                                          <button
                                            className="btn btn-primary"
                                            href="javascript:void(0)"
                                            onClick={(e) => {
                                              e.preventDefault()
                                              this.addPets(
                                                this.state.Pets_Array
                                                  .length - 1
                                              )
                                            }
                                            }
                                          >
                                            <i class="bx bx-plus"></i>
                                          </button>
                                        </div>
                                      ) : (
                                        <></>
                                      )} */}

                                        {this.state.showpets ?
                                          this.state.Pets_Array.map((x, key) => {
                                            return (
                                              <div className="row">
                                                <div className="col-lg">
                                                  <div class="row">
                                                    <div class="col-lg">
                                                      <div className="mb-3">
                                                        <Label
                                                          className="form-label"
                                                          htmlFor="formrow-name-input"
                                                        >
                                                          Pets *
                                                        </Label>
                                                        <select className="form-select"
                                                          id={"Pets" + x.index}
                                                          onChange={(e) =>
                                                            this.updatePets(
                                                              e,
                                                              x.index,
                                                              "divpets" + x.index
                                                            )
                                                          }

                                                          value={x.pets}
                                                        >

                                                          <option>Select One</option>
                                                          <option>Cat</option>
                                                          <option>Dog</option>
                                                          <option>Other</option>
                                                        </select>
                                                        <div id={"divpets" + x.index} style={{ color: "red" }}></div>
                                                      </div>
                                                    </div>
                                                    {x.showname ?
                                                      <div class="col-lg">
                                                        <div className="mb-3">
                                                          <Label
                                                            className="form-label"
                                                            htmlFor="formrow-name-input"
                                                          >
                                                            Name *
                                                          </Label>
                                                          <Input
                                                            id={"name" + x.index}
                                                            onChange={(e) =>
                                                              this.updateName(
                                                                e,
                                                                x.index
                                                              )
                                                            }
                                                            value={x.name}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Petname"
                                                          />
                                                        </div>
                                                      </div>
                                                      : <></>}
                                                    <div class="col-lg">
                                                      <div className="mb-3">
                                                        <Label
                                                          className="form-label"
                                                          htmlFor="formrow-name-input"
                                                        >
                                                          Breed*
                                                        </Label>
                                                        <Input
                                                          id={"breed" + x.index}

                                                          onChange={(e) =>
                                                            this.updateBreed(
                                                              e,
                                                              x.index,
                                                              "divbreed" + x.index
                                                            )
                                                          }
                                                          value={x.breed}
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Breed"
                                                        />
                                                        <div id={"divbreed" + x.index} style={{ color: "red" }}></div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-3">
                                                  <div className="mb-3">
                                                    <Label
                                                      className="form-label"
                                                      htmlFor="formrow-app-input"
                                                    >
                                                      Weight *
                                                    </Label>
                                                    <Input
                                                      id={"weight" + x.index}
                                                      onChange={(e) =>
                                                        this.updateWeight(e, x.index, "divweight" + x.index)
                                                      }
                                                      value={x.weight}
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Weight"
                                                    />
                                                    <div id={"divweight" + x.index} style={{ color: "red" }}></div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-3">
                                                  <div className="mb-3">
                                                    <Label
                                                      className="form-label"
                                                      htmlFor="formrow-age-input"
                                                    >
                                                      Age *
                                                    </Label>
                                                    <Input
                                                      id={"age" + x.index}
                                                      onChange={(e) =>
                                                        this.updateAge(e, x.index, "divage" + x.index)
                                                      }
                                                      value={x.age}
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Age"
                                                    />
                                                    <div id={"divage" + x.index} style={{ color: "red" }}></div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-auto">
                                                  <div className="mb-3 minWidthCol">
                                                    <Label
                                                      className="form-label"
                                                      htmlFor="formrow-name-input"
                                                    >
                                                      &nbsp;
                                                    </Label>
                                                    <br />
                                                    {key == 0 ?
                                                      <button
                                                        className="btn btn-primary"
                                                        href="javascript:void(0)"
                                                        onClick={(e) => {
                                                          e.preventDefault()
                                                          this.addPets(
                                                            this.state.Pets_Array
                                                              .length - 1
                                                          )
                                                        }
                                                        }
                                                      >
                                                        <i class="bx bx-plus"></i>
                                                      </button> :
                                                      <button
                                                        className="btn btn-secondary"
                                                        href="javascript:void(0)"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.minusPets(x.index)
                                                        }
                                                        }
                                                      >
                                                        <i class="bx bx-minus"></i>
                                                      </button>}

                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }) : <></>}

                                        {this.state.aplicant.map((x, key) => {

                                          return (
                                            <div className="row">
                                              <div className="col-lg">
                                                <Label
                                                  className="form-label"
                                                  htmlFor="formrow-name-input"
                                                >
                                                  Names of other persons who will
                                                  reside in the unit
                                                </Label>
                                                <div className="row">
                                                  <div className="col-lg-6">
                                                    <div className="mb-3">
                                                      <Input
                                                        id={"first" + x.index}
                                                        onChange={(e) =>
                                                          this.updateValue(
                                                            e,
                                                            x.index,
                                                            "div" + x.index
                                                          )
                                                        }
                                                        value={x.first_n}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter first name"
                                                      />
                                                      <div id={"div" + x.index} style={{ color: "red" }}></div>
                                                    </div>

                                                  </div>
                                                  <div className="col-lg-6">
                                                    <div className="mb-3">
                                                      <Input
                                                        id={"last" + x.index}
                                                        onChange={(e) =>
                                                          this.updateValue3(
                                                            e,
                                                            x.index,
                                                            "div1" + x.index
                                                          )
                                                        }
                                                        value={x.last_n}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter last name"
                                                      />
                                                      <div id={"div1" + x.index} style={{ color: "red" }}></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-3">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-app-input"
                                                  >
                                                    Relation to applicant(s) *
                                                  </Label>
                                                  <Input
                                                    id={"mrelation" + x.index}
                                                    onChange={(e) =>
                                                      this.updateValue1(e, x.index, "div2" + x.index)
                                                    }
                                                    value={x.value1}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Relation to applicant"
                                                  />
                                                  <div id={"div2" + x.index} style={{ color: "red" }}></div>

                                                </div>
                                              </div>
                                              <div className="col-lg-3">
                                                <div className="mb-3">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-age-input"
                                                  >
                                                    Age *
                                                  </Label>
                                                  <Input
                                                    id={"mage" + x.index}
                                                    onChange={(e) =>
                                                      this.updateValue2(e, x.index, "div3" + x.index)
                                                    }
                                                    value={x.value2}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter age"
                                                  />
                                                  <div id={"div3" + x.index} style={{ color: "red" }}></div>

                                                </div>
                                              </div>
                                              <div className="col-lg-auto">
                                                <div className="mb-3 minWidthCol">
                                                  <Label
                                                    className="form-label"
                                                    htmlFor="formrow-name-input"
                                                  >
                                                    &nbsp;
                                                  </Label>
                                                  <br />
                                                  {key == 0 ? (
                                                    <button
                                                      className="btn btn-primary"
                                                      href="javascript:void(0)"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        this.addaplicant(
                                                          this.state.aplicant
                                                            .length - 1
                                                        )
                                                      }
                                                      }
                                                    >
                                                      <i class="bx bx-plus"></i>
                                                    </button>
                                                  ) : (
                                                    <button
                                                      className="btn btn-secondary"
                                                      href="javascript:void(0)"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        this.minusaplicant(x.index)
                                                      }
                                                      }
                                                    >
                                                      <i class="bx bx-minus"></i>
                                                    </button>
                                                  )}
                                                  <button
                                                    className="btn btn-secondary ms-2"
                                                    href="javascript:void(0)"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.NA(key)
                                                    }
                                                    }
                                                  >
                                                    NA
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}

                                        <div className="row">
                                          <div className="col-lg">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-name-input"
                                            >
                                              1- Person to notify in case of
                                              emergency *
                                            </Label>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Input
                                                    id="emergencyContactName1first"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.state.emergencyContactName1first =
                                                        e.target.value;
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter first name"
                                                  />
                                                  <span style={{ color: "red" }}>{this.state.err["emergencyContactName1first"]}</span>

                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Input
                                                    id="emergencyContactName1last"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.state.emergencyContactName1last =
                                                        e.target.value;
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter last name"
                                                  />
                                                  <span style={{ color: "red" }}>{this.state.err["emergencyContactName1last"]}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-app-input"
                                              >
                                                Relation to applicant(s) *
                                              </Label>
                                              <Input
                                                id="relation1"
                                                onChange={(e) =>
                                                (this.state.relation1 =
                                                  e.target.value)
                                                }
                                                type="text"
                                                className="form-control"
                                                placeholder="Relation to applicant"
                                              />
                                              <span style={{ color: "red" }}>{this.state.err["relation1"]}</span>

                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-phn-input"
                                              >
                                                Phone *
                                              </Label>
                                              <Input
                                                id="emergencyContactPhone1"
                                                onChange={(e) => {
                                                  e.target.style.borderColor =
                                                    "grey";
                                                  this.state.emergencyContactPhone1 =
                                                    e.target.value;
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter phone number"
                                              />
                                              <span style={{ color: "red" }}>{this.state.err["emergencyContactPhone1"]}</span>

                                            </div>
                                          </div>
                                          <div className="col-lg-auto">
                                            <span className="blankCol minWidthCol"></span>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg">
                                            <Label
                                              className="form-label"
                                              htmlFor="formrow-name-input"
                                            >
                                              2- Person to notify in case of
                                              emergency *
                                            </Label>
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Input
                                                    id="emergencyContactName2first"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.state.emergencyContactName2first =
                                                        e.target.value;
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter first name"
                                                  />
                                                  <span style={{ color: "red" }}>{this.state.err["emergencyContactName2first"]}</span>

                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="mb-3">
                                                  <Input
                                                    id="emergencyContactName2last"
                                                    onChange={(e) => {
                                                      e.target.style.borderColor =
                                                        "grey";
                                                      this.state.emergencyContactName2last =
                                                        e.target.value;
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter last name"
                                                  />
                                                  <span style={{ color: "red" }}>{this.state.err["emergencyContactName2last"]}</span>

                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-app-input"
                                              >
                                                Relation to applicant(s) *
                                              </Label>
                                              <Input
                                                id="relation2"
                                                onChange={(e) => {
                                                  e.target.style.borderColor =
                                                    "grey";
                                                  this.state.relation2 =
                                                    e.target.value;
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Relation to applicant"
                                              />
                                              <span style={{ color: "red" }}>{this.state.err["relation2"]}</span>

                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-phn-input"
                                              >
                                                Phone *
                                              </Label>
                                              <Input
                                                id="emergencyContactPhone2"
                                                onChange={(e) => {
                                                  e.target.style.borderColor =
                                                    "grey";
                                                  this.state.emergencyContactPhone2 =
                                                    e.target.value;
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter phone Number"
                                              />
                                              <span style={{ color: "red" }}>{this.state.err["emergencyContactPhone2"]}</span>

                                            </div>
                                          </div>
                                          <div className="col-lg-auto">
                                            <span className="blankCol minWidthCol"></span>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-12">
                                            <div className="mb-2">
                                              <CardTitle className="h3">
                                                <b>Terms and Conditions *</b>
                                              </CardTitle>
                                              <div className="form-check">
                                                <input
                                                  onChange={(e) =>
                                                  (e.target.style.borderColor =
                                                    "grey")
                                                  }
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  id="formCheck1"
                                                />
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="formCheck1"
                                                >
                                                  I warrant, to the best of my
                                                  knowledge, all of the information
                                                  provided in this application is
                                                  true, accurate, complete and
                                                  correct as of the date of this
                                                  application. If any information
                                                  provided by me is determined to be
                                                  false, such false statement will
                                                  be grounds for disapproval of my
                                                  application.
                                                </label>
                                              </div>
                                            </div>
                                            <div className="decla-pt mb-3">
                                              <CardTitle className="h4">
                                                <b>I understand and agree:</b>
                                              </CardTitle>
                                              <ul className="list-unstyled mb-0">
                                                <li>
                                                  This is an application to rent
                                                  only and does not guarantee that I
                                                  will be offered the property.
                                                </li>
                                                <li>
                                                  Landlord may accept more than one
                                                  application for the property and
                                                  using their sole discretion, will
                                                  select the best qualified
                                                  applicant.
                                                </li>
                                                <li>
                                                  I hereby authorize the Landlord or
                                                  Manager or Agent to verify the
                                                  information provided and obtain a
                                                  credit report on me.
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="mb-3">
                                              <Label
                                                className="form-label"
                                                htmlFor="formrow-name-input"
                                              >
                                                Applicant's Signature *
                                              </Label>
                                              <SignatureCanvas
                                                penColor="black"
                                                id="signatureCanvas1"
                                                ref={(ref) => {
                                                  this.sigPad1 = ref;
                                                }}
                                                onEnd={() => {
                                                  const imageData = this.sigPad1
                                                    .getTrimmedCanvas()
                                                    .toDataURL("image/png");
                                                  this.setState({
                                                    trimmedDataURL1: imageData,
                                                  });
                                                  //input.onChange({ name: input.name, data: imageData });
                                                }}
                                                canvasProps={{
                                                  width: 500,
                                                  height: 200,
                                                  className: "sigCanvas",
                                                }}
                                              />
                                              <a
                                                href="javascript:void(0)"
                                                onClick={this.clear}
                                                class="btn btn-secondary"
                                              >
                                                Clear
                                              </a>
                                            </div>

                                            <div
                                              id="signerror"
                                              style={{
                                                display: "none",
                                                color: "red",
                                              }}
                                            >
                                              Please enter your signature!
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="mb-3">
                                              <Label
                                                htmlFor="example-date-input"
                                                className="form-Label"
                                              >
                                                Date:
                                              </Label>
                                              <Label
                                                htmlFor="example-date-input"
                                                className="form-Label"
                                              >
                                                {this.getDate()}{" "}
                                              </Label>
                                            </div>
                                          </div>
                                        </div>
                                        {this.state.applicantName2 != "" ? (
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <div className="mb-3">
                                                <Label
                                                  className="form-label"
                                                  htmlFor="formrow-name-input"
                                                >
                                                  Applicant's Signature
                                                </Label>

                                                <SignatureCanvas
                                                  penColor="black"
                                                  id="signatureCanvas2"
                                                  ref={(ref) => {
                                                    this.sigPad2 = ref;
                                                  }}
                                                  onEnd={() => {
                                                    const imageData = this.sigPad2
                                                      .getTrimmedCanvas()
                                                      .toDataURL("image/png");
                                                    this.setState({
                                                      trimmedDataURL2: imageData,
                                                    });
                                                    //input.onChange({ name: input.name, data: imageData });
                                                  }}
                                                  canvasProps={{
                                                    width: 500,
                                                    height: 200,
                                                    className: "sigCanvas",
                                                  }}
                                                />
                                                <a
                                                  href="javascript:void(0)"
                                                  onClick={this.clear1}
                                                  class="btn btn-secondary"
                                                >
                                                  Clear
                                                </a>
                                              </div>

                                              <div
                                                id="signerror1"
                                                style={{
                                                  display: "none",
                                                  color: "red",
                                                }}
                                              >
                                                Please enter your signature!
                                              </div>
                                            </div>
                                            <div className="col-lg-6">
                                              <div className="mb-3">
                                                <Label
                                                  htmlFor="example-date-input"
                                                  className="form-Label"
                                                >
                                                  Date:{" "}
                                                </Label>
                                                <Label
                                                  htmlFor="example-date-input"
                                                  className="form-Label"
                                                >
                                                  {this.getDate()}{" "}
                                                </Label>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </form>
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <ul className="pager wizard twitter-bs-wizard-pager-link">
                                  <li
                                    className={
                                      this.state.activeTabProgress === 1
                                        ? "previous disabled"
                                        : "previous"
                                    }
                                  >
                                    <Link
                                      to="#"
                                      className={
                                        this.state.activeTabProgress === 1
                                          ? "btn btn-primary disabled"
                                          : "btn btn-primary"
                                      }
                                      onClick={() => {
                                        this.toggleTabProgress(
                                          this.state.activeTabProgress - 1
                                        );
                                      }}
                                    >
                                      <i className="bx bx-chevron-left me-1"></i>{" "}
                                      Previous
                                    </Link>
                                  </li>

                                  <li
                                    className={
                                      this.state.activeTabProgress === 3
                                        ? "next disabled"
                                        : "next"
                                    }
                                  >
                                    <Link
                                      type="submit"
                                      to="#"
                                      className="btn btn-primary"
                                      // aria-disabled={this.btnDisbale}
                                      onClick={async (event) => {
                                        if (!this.state.btnDisbale) {
                                          $("body input").css(
                                            "border-color",
                                            "grey"
                                          );
                                          if (this.state.activeTabProgress === 3) {
                                            //this.getSignature1();

                                            const [validForm, errors] =
                                              this.validateInformationform();
                                            console.log(validForm, errors);

                                            //return;
                                            // Terms & Condition Checkbox
                                            const termsAndConditionAccepted =
                                              document.getElementById(
                                                "formCheck1"
                                              ).checked;
                                            if (termsAndConditionAccepted != true)
                                              document.getElementById(
                                                "formCheck1"
                                              ).style.borderColor = "red";

                                            if (
                                              this.state.trimmedDataURL1 == null
                                            ) {
                                              document.getElementById(
                                                "signerror"
                                              ).style.display = "block";
                                            } else {
                                              document.getElementById(
                                                "signerror"
                                              ).style.display = "none";
                                            }

                                            if (this.state.applicantName2) {
                                              if (
                                                this.state.trimmedDataURL2 == null
                                              ) {
                                                document.getElementById(
                                                  "signerror1"
                                                ).style.display = "block";
                                              } else {
                                                document.getElementById(
                                                  "signerror1"
                                                ).style.display = "none";
                                              }
                                              if (
                                                this.state.trimmedDataURL1 !== null &&
                                                this.state.trimmedDataURL2 !== null &&
                                                validForm &&
                                                termsAndConditionAccepted
                                              ) {
                                                console.log(
                                                  this.state.trimmedDataURL1
                                                );
                                                //return;
                                                this.submitApplicantInformation(
                                                  event
                                                );
                                              } else {
                                                for (const error in errors) {
                                                  const element =
                                                    document.getElementById(error);
                                                  if (element) {
                                                    element.value = "";
                                                    element.style.borderColor = "red";
                                                    element.placeholder =
                                                      errors[error];
                                                    element.innerText =
                                                      errors[error];
                                                  }

                                                }
                                              }
                                            }
                                            else {
                                              if (
                                                this.state.trimmedDataURL1 !== null &&
                                                validForm &&
                                                termsAndConditionAccepted
                                              ) {
                                                console.log(
                                                  this.state.trimmedDataURL1
                                                );
                                                //return;
                                                this.submitApplicantInformation(
                                                  event
                                                );
                                              } else {
                                                for (const error in errors) {
                                                  const element =
                                                    document.getElementById(error);
                                                  if (element) {
                                                    element.value = "";
                                                    element.style.borderColor = "red";
                                                    element.placeholder =
                                                      errors[error];
                                                    element.innerText =
                                                      errors[error];
                                                  }

                                                }
                                              }
                                            }
                                          }
                                          else if (
                                            this.state.activeTabProgress === 2
                                          ) {
                                            this.setState({ show: true })
                                            console.log(`Validating Forms`);
                                            const validForm =
                                              this.validateApplicantForm();
                                            const validForm2 =
                                              this.validateApplicantForm2();
                                            if (validForm && validForm2) {
                                              this.toggleTabProgress(
                                                this.state.activeTabProgress + 1
                                              );
                                            }
                                          } else {
                                            const isFormValid =
                                              this.validateMainForm();
                                            if (isFormValid) {
                                              this.toggleTabProgress(
                                                this.state.activeTabProgress + 1
                                              );
                                            }
                                          }
                                        }
                                      }}
                                    >
                                      Next{" "}
                                      <i
                                        id="nexticon"
                                        className="bx bx-chevron-right ms-1"
                                      ></i>
                                      <div
                                        id="saveSpinner"
                                        style={{
                                          display: "none",
                                          height: "15px",
                                          width: "15px",
                                          marginLeft: "5px",
                                        }}
                                        className="spinner-border"
                                        role="status"
                                      ></div>
                                      <i
                                        id="failedSaveErrorIcon"
                                        style={{
                                          display: "none",
                                          marginLeft: "5px",
                                        }}
                                        className="fa fa-exclamation-triangle"
                                        aria-hidden="true"
                                      ></i>
                                    </Link>
                                  </li>
                                </ul>
                              </form>
                            </div>
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                    <div id="thanks" className="text-center thanks white-bg">
                      <img src={ThankYou} />
                      <div className={`thankyou-title`}>
                        <span>Thank You !</span>
                      </div>
                      <p>
                        Your application has been successfully entered with us.
                      </p>
                      <p>
                        Redirecting back to website in{" "}
                        {this.state.redirectSecondsRemaining} seconds...
                      </p>

                      <a
                        onClick={() => this.validurl()}
                        className="btn btn-primary"
                      >
                        Go back
                      </a>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default TicketManager;
