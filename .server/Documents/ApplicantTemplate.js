const admZip = require("adm-zip");
const fs = require("fs");
const { promises: fs2 } = require('fs');
module.exports = async  (content, signatureOne, signatureTwo, totalApplicant) => {

        // for both applicant
        return `
                    
                 <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Document</title>
                        </head>
                    <style>
                        body { 
                            font-size: 11px;
                            font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                            color: #444;

                        }
                    </style>
                          <body>
                        <div >
                            <table bgcolor="#f6f6f6" cellspacing="0" style=" padding: 10px; width: 100%; border:0px;">
                                <tbody>
                                    <!-- <tr>
                                        <td width="5px" style="padding: 0;"></td>
                                        <td style="clear: both; display: block; margin: 0 auto; max-width: 820px; padding: 10px 0;">
                                            <table width="100%" cellspacing="0" style="border-collapse: collapse;">
                                                <tbody>
                                                    <tr>
                                                        <td style="padding: 0;">
                                                            <a
                                                                href="#"
                                                                style="color: #348eda;"
                                                                target="_blank"
                                                            >
                                                                <img
                                                                    src="logo.png"
                                                                    alt="Bootdey.com"
                                                                    style="height: 50px; max-width: 100%; width: 157px;"
                                                                    height="50"
                                                                    width="157"
                                                                />
                                                            </a>
                                                        </td>
                                                        <td style="color: #999; font-size: 12px; padding: 0; text-align: right;" align="right">
                                                            Bootdey<br />
                                                            Invoice #3440952<br />
                                                            August 04, 2018
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td width="5px" style="padding: 0;"></td>
                                    </tr> -->
                        
                                    <!-- <tr>
                                        <td width="5px" style="padding: 0;"></td>
                                        <td bgcolor="#FFFFFF" style="border: 1px solid #000; clear: both; display: block; margin: 0 auto; max-width: 820px; padding: 0;">
                                            <table width="100%" style="background: #f9f9f9; border-bottom: 1px solid #eee; border-collapse: collapse; color: #999;">
                                                <tbody>
                                                    <tr>
                                                        <td width="50%" style="padding: 20px;"><strong style="color: #333; font-size: 24px;">$23.95</strong> Paid</td>
                                                        <td align="right" width="50%" style="padding: 20px;">Thanks for Buy <span class="il">our Property</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td style="padding: 0;"></td>
                                        <td width="5px" style="padding: 0;"></td>
                                    </tr> -->
                                    <tr>
                                        <td width="5px" style="padding: 0;"></td>
                                        <td style="border: 1px solid #ddd;  clear: both; display: block; margin: 0 auto;  padding: 0;">
                                            <table cellspacing="0" style="border-collapse: collapse;  margin: 0 auto; width: 100%; ">
                                                <tbody>
                                                    <tr>
                                                        <td valign="top"  style="width: 100%">
                                                            <h3
                                                                style="
                                                                     text-transform: uppercase;
                                                                        color: #fff;
                                                                        font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                                        font-size: 14px;
                                                                        font-weight: normal;
                                                                        margin: 0;
                                                                        line-height:inherit;
                                                                        background-color: #348eda;
                                                                        padding: 10px 10px 8px 10px;
                                                                        
                                                                "
                                                            >
                                                            Property Info 
                                                            </h3>
                                                            <table cellspacing="0" style="border-collapse: collapse;  margin-bottom: 5px; width: 100%;">
                                                                <tbody>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">City </td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.main.city}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd">
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Property </td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.main.property}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd">
                                                                        <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Moving Date</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${formatDate(content.main.date)}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd">
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Layout</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.main.layout}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Source</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.main.source}</td>
                                                                    </tr>                                                                  
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td valign="top">
                                                            <h3
                                                            style="
                                                                 text-transform: uppercase;
                                                                    color: #fff;
                                                                    font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                                    font-size: 14px;
                                                                    font-weight: normal;
                                                                    margin: 0;
                                                                    line-height:inherit;
                                                                    background-color: #348eda;
                                                                    padding: 10px 10px 8px 10px;
                                                                    
                                                            "
                                                        >
                                                            Applicants Info 1
                                                            </h3>
                                                            <table cellspacing="0" style="border-collapse: collapse;  width: 100%;">
                                                                <tbody>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">First Name </td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].firstname}</td>
                                                                    </tr>
                                                                    
                                                                     ${getLastName(content,0)}
                                                                                                                                   
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Phone </td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].phone}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Address</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].currentAddress}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">How long at current address? (Years)</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].howLong}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Email</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].email}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Landlord Name</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].currentLandloard}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Landlord Phone</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].currentLandlordPhone}</td>
                                                                    </tr>
                                                                    
                                                                    
                                                                     ${getPreviousAddressInformation(content, 0)}
                                                                    
                                                                    
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Employer</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].currentEmployer}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">How long at current employer? (Years)</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].currentEmployerFor}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Occupation</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].occupation}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Annual Income</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">$ ${content.applicants[0].annualIncome}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Supervisor/Manager</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].manager}</td>
                                                                    </tr>
                                                                    <tr style="border-bottom:1px solid #ddd" >
                                                                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Employer Phone</td>
                                                                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[0].currentEmployerPhone}</td>
                                                                    </tr>
                                                                    <!-- <tr>
                                                                        <td style="border-bottom: 2px solid #000; border-top: 2px solid #000; font-weight: bold; padding: 5px 0;">Amount paid</td>
                                                                        <td align="right" style="border-bottom: 2px solid #000; border-top: 2px solid #000; font-weight: bold; padding: 5px 0;">$23.95</td>
                                                                    </tr> -->
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    ${totalApplicant === 2 ? getApplicant2(content): `<span></span>`}
                                                    <tr>
                                                        <td valign="top">
                                                            <h3
                                                            style="
                                                                 text-transform: uppercase;
                                                                    color: #fff;
                                                                    font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                                    font-size: 14px;
                                                                    font-weight: normal;
                                                                    margin: 0;
                                                                    line-height:inherit;
                                                                    background-color: #348eda;
                                                                    padding: 10px 10px 8px 10px;
                                                                    
                                                            "
                                                        >
                                                            Resident Information
                                                            </h3>
                                                            <table cellspacing="0" style="border-collapse: collapse; width: 100%;">
                                                                <tbody>
                                                                       ${getResidePersons(content)}
                                                                    <tr>    
                                                                     ${content.pets ? `
                                                                     <table width="100%" cellspacing="0" style="border-collapse: collapse;">                                                                       
                                                                            <tbody>
                                                                              <tr >
                                                                                     <td colspan="2" style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">
                                                                                            <h3 style="
                                                                                                 text-transform: uppercase;
                                                                                                    color: #fff;
                                                                                                    font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                                                                    font-size: 14px;
                                                                                                    font-weight: normal;
                                                                                                    margin: 0;
                                                                                                    line-height:inherit;
                                                                                                    background-color: #348eda;
                                                                                                    padding: 10px 10px 8px 10px;"
                                                                                            >Pets Information</h3>
                                                                                        </td>
                                                                                    <!-- <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">YES</td> -->
                                                                              </tr>
                                                                              <tr style="border-bottom:1px solid #ddd">
                                                                                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Do You Have Pets? </td>
                                                                                    <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">YES</td>
                                                                              </tr>
                                                                              <tr style="border-bottom:1px solid #ddd">
                                                                                  <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Total Pets </td>
                                                                                  <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.pets.numberOfPets}</td>
                                                                              </tr>
                                                                               ${getPets(content.pets)}
                                                                            </tbody>
                                                                         </table>
                                                                    ` : ""}
                                                                       
                                                                        <table width="100%" cellspacing="0" style="border-collapse: collapse;">
                                                                                <h5 style="
                                                                                     text-transform: uppercase;
                                                                    color: #fff;
                                                                    font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                                                                    font-size: 14px;
                                                                    font-weight: normal;
                                                                    margin: 0;
                                                                    line-height:inherit;
                                                                    background-color: #348eda;
                                                                    padding: 10px 10px 8px 10px;
                                                                    margin-top:10px;">Emergency Contacts</h5>
                                                                     <tr style="border-bottom:1px solid #ddd" >
                                                                <td colspan="2" style="padding: 10px; font-weight: bold; color: #348eda; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px;"> Emergency Contacts 1</td>
                                    <!-- <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">YES</td> -->                                 
                                                                      </tr>
                                                                           <tbody>
                                                                                 ${getEmergencyContact(content, 0)}
                                                                            </tbody>
                                                                      </table>
                                                                      
                                                                        <table width="100%" cellspacing="0" style="border-collapse: collapse;">
                                                                      
                                                                <td colspan="2" style="padding: 10px; font-weight: bold; color: #348eda; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px;"> Emergency Contacts 2</td>
                                    <!-- <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">YES</td> -->                                 
                                                                      </tr>
                                                                            
                                                                           <tbody>
                                                                                 ${getEmergencyContact(content, 1)}
                                                                            </tbody>
                                                                      </table> 
                                                                      <table style="border-bottom:1px solid #ddd; border-top:1px solid #ddd; margin-bottom: 10px; width: 100%;" >
                                                                        <tbody> 
                                                                            <tr>
                                                                                <td colspan="2" style="padding: 10px; padding-bottom: 0px; font-weight: bold; color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px;">
                                                                                Terms and Conditions *</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">
                                                                                    I warrant, to the best of my knowledge, all of the information provided in this application is true, accurate, complete and correct as of the date of this application. If any information provided by me is determined to be false, such false statement will be grounds for disapproval of my application.
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colspan="2" style="padding: 10px; padding-top: 0px; padding-bottom: 0px; font-weight: bold; color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px;">
                                                                                    I understand and agree:</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">
                                                                                <ul style="padding:0px; margin-left: 20px; margin-top: 5px;">
                                                                                    <li style="padding: 5px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">This is an application to rent only and does not guarantee that I will be offered the property.</li>
                                                                                    <li style="padding: 5px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Landlord may accept more than one application for the property and using their sole discretion, will select the best qualified applicant.</li>
                                                                                    <li style="padding: 5px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">I hereby authorize the Landlord or Manager or Agent to verify the information provided and obtain a credit report on me.</li>
                                                                                    
                                                                                </ul>
                                                                                </td>
                                                                            </tr>

                                                                      </table>
                                                                        <table width="100%" cellspacing="0" style="border-collapse: collapse;border-bottom:1px solid #ddd">
                                                                        <tbody> 
                                                                             <tr>
                                                                                <td colspan="2" style="padding: 10px"><b>Applicant 1 Signature: </b></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colspan="2" style="padding: 10px;  width: 100%;" >
                                                                                    <img width='100' height='100' src="data:image/png;base64,${signatureOne}"/>
                                                                                </td>
                                                                            </tr>
                                                                            ${getSignatureTwo(signatureTwo)}
                                                                        </tbody>
                                                                        </table> 
                                                                        
                                                                        
                                                                        ${await getDocuments(content._id, content?.documents)}
                                                                    </tr>
                                                                   
                                                                    <!-- <tr>
                                                                        <td style="border-bottom: 2px solid #000; border-top: 2px solid #000; font-weight: bold; padding: 5px 0;">Amount paid</td>
                                                                        <td align="right" style="border-bottom: 2px solid #000; border-top: 2px solid #000; font-weight: bold; padding: 5px 0;">$23.95</td>
                                                                    </tr> -->
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td width="5px" style="padding: 0;"></td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                                </body>
                    </html>
                       `
}


function getApplicant2(content) {
    let html = `
                <tr>
                <td valign="top" >
                <h3
                style="
                text-transform: uppercase;
                color: #fff;
                font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                line-height:inherit;
                background-color: #348eda;
                padding: 10px 10px 8px 10px;
                
                "
                >
                Applicants Info 2
                </h3>
                <table cellspacing="0" style="border-collapse: collapse;  width: 100%;">
                <tbody>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">First Name </td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].firstname}</td>
                </tr>                                                            
                ${getLastName(content, 1)}                                                           
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Phone </td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].phone}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Address</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].currentAddress}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">How long at previous address? (Years)</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].howLong}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Email</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].email}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Landlord Name</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].currentLandloard}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Landlord Phone</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].currentLandlordPhone}</td>
                </tr>
                
                ${getPreviousAddressInformation(content, 1)}   
                
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px;  font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Employer</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].currentEmployer}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Employer For</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].currentEmployerFor}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Occupation</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].occupation}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Annual Income</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">$ ${content.applicants[1].annualIncome}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Supervisor/Manager</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[1].manager}</td>
                </tr>
                <tr >
                <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Current Employer Phone</td>
                <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">  </td>
                </tr>
                <!-- <tr>
                <td style="border-bottom: 2px solid #000; border-top: 2px solid #000; font-weight: bold; padding: 5px 0;">Amount paid</td>
                <td align="right" style="border-bottom: 2px solid #000; border-top: 2px solid #000; font-weight: bold; padding: 5px 0;">$23.95</td>
                </tr> -->
                </tbody>
                </table>
                </td>
                </tr>
    `
    return html
}

function getPets(petsInformation) {
    let petsHTML = ``
    petsInformation.petsInformation.forEach( (petInfo, index) => {
        petsHTML += `
                    <tr style="border-bottom:1px solid #ddd" >
                    <td colspan="2" style="padding: 10px; font-weight: bold; color: #348eda; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 18px;">
                    Pet ${index +1}</td>
                    <!-- <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">YES</td> -->
                    </tr>
                    <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Pet Type</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${petInfo.petType}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Breed</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${petInfo.breed}</td>
                    </tr>
                    
                    <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Weight</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${petInfo.weight}</td>
                    </tr>
                    <tr>
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; border-bottom:1px solid #ddd">Age</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${petInfo.age}</td>
                    </tr>
        `

    })

    return petsHTML
}


function formatDate(date){
    // let month = parseInt(date.getMonth()) +1
    let month = parseInt(date.getMonth())
    let day = date.getDay()
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    return days[day] +", "+ months[month] + " " + date.getDate() +", "+ date.getFullYear()
}


function getLastName(content, applicantNo){
    if(content.applicants[applicantNo].lastname && content.applicants[applicantNo].lastname !== ""){
        return `
        <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Last Name </td>
            <td align="right" style="padding: 10px;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].lastname}</td>
        </tr>
        `
    }else{
        return ""
    }
}

function getSignatureTwo(signatureTwo) {
    if(signatureTwo) {
        return ` 
                    <tr>
                    <td colspan="2" style="padding: 10px"><b>Applicant 2 Signature: </b></td>
                    </tr>
                    <tr>
                    <td colspan="2" style="padding: 10px;  width: 100%;"  >
                    <img width='100' height='100' src="data:image/png;base64,${signatureTwo}"/>
                    </td>
                    </tr>
                   
                `
    }else{
        return `<span></span>`
    }
}

async function getDocuments(applicantID, docs) {
    let html = ``
    let dir = `uploads/applicant/${applicantID}`;
    try{
        if(fs.existsSync(dir + "/applicant-one.zip")){
            // deleting old files !
            if(fs.existsSync("Documents/temp/applicant-one")){
                fs.rmdirSync("Documents/temp/applicant-one", { recursive: true });
            }

            //  extracting applicant files
            let zip = new admZip(dir + "/applicant-one.zip");
            zip.extractAllTo("Documents/temp/applicant-one", true);

            const files  = await fs2.readdir("Documents/temp/applicant-one")
            files.forEach((filename) => {
                let base64 = base64_encode(`Documents/temp/applicant-one/${filename}`)
                html += `
                <h3 style="padding:0px 10px;  width: 100%;page-break-inside: avoid ; page-break-before: always;" >Documents</h3>
             <center><img style="max-width: 100%;" src="data:image/png;base64,${base64}"/></center>
            `
            })
        }

        if(fs.existsSync(dir + "/applicant-two.zip")){
            if(fs.existsSync("Documents/temp/applicant-two")){
                fs.rmdirSync("Documents/temp/applicant-two", { recursive: true });
            }
            let zip = new admZip(dir + "/applicant-two.zip");
            zip.extractAllTo("Documents/temp/applicant-two", true);
            const files  = await fs2.readdir("Documents/temp/applicant-two")
            files.forEach((filename) => {
                let base64 = base64_encode(`Documents/temp/applicant-two/${filename}`)
                html += `
             <h3 style="padding:0px 10px;  width: 100%;page-break-inside: avoid ; page-break-before: always;" >Documents</h3>
             <center><img style="max-width: 100%;" src="data:image/png;base64,${base64}"/></center>
            `
            })
        }
        if (docs && docs?.length > 0) {
            docs.forEach((link) => {
                html += `
                <h3 style="padding: 0px 10px; width: 100%; page-break-inside: avoid; page-break-before: always;">Documents</h3>
                <center><img style="max-width: 100%;" src="${link}" /></center>
  `;
            });
        }
    }catch(error) {
        console.log(error)
    }
    return html
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

function getEmergencyContactLastname(emergencyContact){
    if(emergencyContact.lastname){
        return `
        <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Last Name </td>
            <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${emergencyContact.lastname}</td>
        </tr>
        `
    }
    return ``
}

function getEmergencyContact(content, emergencyContactNo){
    // TODO change if emergency contact is not mandatory
    let html = ''
    if(emergencyContactNo === 0){
        html += `
            <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">First Name</td>
            <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.emergencyContacts[emergencyContactNo].firstname}</td>
            </tr>
                 
             ${getEmergencyContactLastname(content.emergencyContacts[emergencyContactNo])}                                   
                            
            <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Phone </td>
            <td align="right" style="padding: 10px;" >${content.emergencyContacts[emergencyContactNo].phone}</td>
            </tr>
            
            <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Relation </td>
            <td align="right" style="padding: 10px;" >${content.emergencyContacts[emergencyContactNo].relation}</td>
            </tr>
        `
    }else{
        html += `
            <tr style="border-bottom:1px solid #ddd; border-top:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">First Name</td>
            <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.emergencyContacts[emergencyContactNo].firstname}</td>
            </tr>
                 
             ${getEmergencyContactLastname(content.emergencyContacts[emergencyContactNo])}                                   
                            
            <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Phone </td>
            <td align="right" style="padding: 10px;" >${content.emergencyContacts[emergencyContactNo].phone}</td>
            </tr>
            
            <tr style="border-bottom:1px solid #ddd">
            <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Relation</td>
            <td align="right" style="padding: 10px;" >${content.emergencyContacts[emergencyContactNo].relation}</td>
            </tr>
        `
    }

    return html
}

function getResidePersons(content){
    let html = ``
    if(content.residePersons.length !== 0) {
        content.residePersons.forEach((person) => {
            html +=  `
                    <tr style="border-bottom:1px solid #ddd">
                         <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Name </td>
                         <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${person.name}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #ddd">
                        <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Relation </td>
                        <td align="right" style="padding: 10px;font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${person.relation}</td>
                    </tr>
                    <tr >
                        <td style="padding: 10px; font-weight: bold;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Age</td>
                        <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${person.age}</td>
                    </tr>
        `
        })
    }

    return html
}

function getPreviousAddressInformation(content, applicantNo) {
    if (!content.applicants[applicantNo].previousAddressInformation || content.applicants[applicantNo].previousAddressInformation.previousAddress === "" ) {
        return `
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Previous Address</td>
                    <td align="right" style="padding: 10px;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.previousAddress}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">How long at previous address? (Years)</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.howLongAtPreviousAddress}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Previous Landlord Name</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.previousLandloardName}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Previous Landlord Phone</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.previousLandloardPhone}</td>
                </tr>
                `
    } else {
        return `
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Previous Address</td>
                    <td align="right" style="padding: 10px;  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.previousAddress}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">How long at previous address? (Years)</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.howLongAtPreviousAddress}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Previous Landlord Name</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.previousLandloardName}</td>
                </tr>
                <tr style="border-bottom:1px solid #ddd">
                    <td style="padding: 10px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">Previous Landlord Phone</td>
                    <td align="right" style="padding: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;">${content.applicants[applicantNo].previousAddressInformation.previousLandloardPhone}</td>
                </tr>
    `
    }
}

