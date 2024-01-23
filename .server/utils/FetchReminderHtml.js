exports.get = (emailFor, data) => {
  const domain = process.env.DOMAIN;
  const rentdigicareDomain =
    process.env.RENTDIGICARE_DOMAIN + ":" + process.env.PORT;

  // const serverAddress = process.env.DOMAIN + ":" + process.env.PORT;
  // const gskLogo = `${rentdigicareDomain}/images/gsklogo.png`;
  // const gskLogo1 = `${rentdigicareDomain}/images/gsklogo1.jpg`;
  // const rentdigicareLogo = `${rentdigicareDomain}/images/rentdigicarelogo.png`;

  // website domain
  const gskDomain = process.env.GSK_DOMAIN;

  if (emailFor === "APPLICATION_REMINDER") {
    return ` 
              <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
    <head> 
    <meta charset="UTF-8"> 
    <meta content="width=device-width, initial-scale=1" name="viewport"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta content="telephone=no" name="format-detection"> 
    <title>New email template 2022-06-24</title><!--[if (mso 16)]>
      <style type="text/css">
      a {text-decoration: none;}
      </style>
      <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
      <o:AllowPNG></o:AllowPNG>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]--><!--[if !mso]><!-- --> 
    <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"><!--<![endif]--> 
    <style type="text/css">
    #outlook a {
    \tpadding:0;
    }
    .ExternalClass {
    \twidth:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
    \tline-height:100%;
    }
    .es-button {
    \tmso-style-priority:100!important;
    \ttext-decoration:none!important;
    \ttransition:all 100ms ease-in;
    }
    a[x-apple-data-detectors] {
    \tcolor:inherit!important;
    \ttext-decoration:none!important;
    \tfont-size:inherit!important;
    \tfont-family:inherit!important;
    \tfont-weight:inherit!important;
    \tline-height:inherit!important;
    }
    .es-button:hover {
    \tbackground:#555555!important;
    \tborder-color:#555555!important;
    }
    .es-desk-hidden {
    \tdisplay:none;
    \tfloat:left;
    \toverflow:hidden;
    \twidth:0;
    \tmax-height:0;
    \tline-height:0;
    \tmso-hide:all;
    }
    [data-ogsb] .es-button {
    \tborder-width:0!important;
    \tpadding:15px 30px 15px 30px!important;
    }
    [data-ogsb] .es-button.es-button-1 {
    \tpadding:15px 25px!important;
    }
    #myTable {
  width: 100%;
  border-collapse: collapse;
}

#myTable th,
#myTable td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid black;
  border-bottom: 1px solid #ddd;
  font-size: 14px; /* Adjust the font size to your preference */
}

#myTable th {
  background-color: #f2f2f2;
}

#tableBody tr:hover {
  background-color: #f5f5f5;
}
    @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:17px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:14px!important; display:inline-block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
    </style> 
    </head> 
    <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
    <div class="es-wrapper-color" style="background-color:#F1F1F1"><!--[if gte mso 9]>
    \t\t\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    \t\t\t\t<v:fill type="tile" color="#f1f1f1"></v:fill>
    \t\t\t</v:background>
    \t\t<![endif]--> 
     <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
       <tr style="border-collapse:collapse"> 
        <td valign="top" style="padding:0;Margin:0"> 
       
         <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
           <tr style="border-collapse:collapse"> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
               <tr style="border-collapse:collapse"> 
                <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;background-color:#ffffff" bgcolor="#333333" align="left"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0;font-size:0; "><a href="${gskDomain}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:14px"><img src=${data.logo} alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; height:76px;weight:150px" ></a></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
           <tr style="border-collapse:collapse"> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#333333;width:600px" cellspacing="0" cellpadding="0" bgcolor="#333333" align="center"> 
               <tr style="border-collapse:collapse"> 
                <td style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-image:url('https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');background-repeat:no-repeat" align="left" background="https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:40px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#ffffff"> Application Reminder</h1></td> 
                       </tr> 
                       <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
                       </tr>  
                       <!-- <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
                       </tr>  -->
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
           <tr style="border-collapse:collapse"> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
               <tr style="border-collapse:collapse"> 
                <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       
                       <tr style="border-collapse:collapse"> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">${data?.name} , </p></td> 
                       </tr> 
                       <tr style="border-collapse:collapse"> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Your applications status<br></br></p></td> 
                       </tr>
                       <tr style="border-collapse:collapse"> 
                       <table id="myTable">
                   <thead>
                     <tr>
                     <th></th>
                     <th style="color: #FFBF53;">Pending</th>
                     <th style="color: green;">Approved</th>
                     <th style="color: red;">Denied</th>
                     <th style="color: black;">Total</th>
                     </tr>
                   </thead>
                   <tbody id="tableBody">
                     <tr>
                     <td></td>
                      <td>${data.pending}</td>
                      <td>${data.approved}</td>
                      <td>${data.denied}</td>
                      <td>${data.pending + data.approved + data.denied}</td>
                     </tr>
                   </tbody>
                 </table>
                 <br>
                 <br>
                 <br>
                       </tr>
                       <tr style="border-collapse:collapse"> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;text-align: justify;color:#555555;font-size:15px">click on the link below to login <br><a href="${domain}/Login">${domain}/Login</a></p></td> 
                       </tr> 
                       <!-- <tr style="border-collapse:collapse"> 
                        <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">If that doesn't work, copy and paste the following link in your browser:<br></p></td> 
                       </tr>
    \t\t\t\t\t<tr style="border-collapse:collapse"> 
                        <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p href="${domain}/login" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">${domain}/login<br></p></td> 
                       </tr>\t\t\t\t\t  -->
                       <tr style="border-collapse:collapse"> 
                        <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Cheers,<br><strong>Team Rentdigicare</strong></p></td> 
                       </tr> 
                       <!-- <tr style="border-collapse:collapse margin-top: 20px"> 
                        <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px"><strong>Rentdigicare</strong></p></td> 
                       </tr>  -->
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               
             </table></td> 
           </tr> 
         </table> 
       
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
           <tr style="border-collapse:collapse"> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#292828;width:600px" cellspacing="0" cellpadding="0" bgcolor="#292828" align="center"> 
               <tr style="border-collapse:collapse"> 
                <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:40px;padding-right:40px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0;font-size:0"> 
                         <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                         <tr style="border-collapse:collapse"> 
                         <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                           <a href="https://www.facebook.com/gskproperties"><img title="Facebook" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                         <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                           <a href="https://www.instagram.com/gskproperties/"><img title="Instagram" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                        </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
         <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
           <tr style="border-collapse:collapse"> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
               <tr style="border-collapse:collapse"> 
                <td align="left" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                      
                       <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px"> <a target="_blank" class="unsubscribe" href="#" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px">Unsubscribe</a></p></td> 
                       </tr> 
                       <tr style="border-collapse:collapse"> 
                        <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px">Copyright © 2022 - All Rights Reserved.</p></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
         </td> 
       </tr> 
     </table> 
    </div>  
    </body>
    </html>
      `;
  }

  if (emailFor === "COMPANY_USER_REPORT_OF_MANAGERS") {
    const tableRows = data.managerData
      .map((item) => {
        const propertyTitles = item.properties.map((property) => property.title);
        const propertyTitlesString = propertyTitles.join(', ');
        return `
        <tr>
          <td>${item.firstname} ${item.lastname}</td>
          <td>${propertyTitlesString}</td>
          <td>${item.pending + item.approved + item.denied}</td>
          <td>${item.pending}</td>
          <td>${item.approved}</td>
          <td>${item.denied}</td>
        </tr>
      `;
      })
      .join("");
    return `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
<head> 
<meta charset="UTF-8"> 
<meta content="width=device-width, initial-scale=1" name="viewport"> 
<meta name="x-apple-disable-message-reformatting"> 
<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
<meta content="telephone=no" name="format-detection"> 
<title>New email template 2022-06-24</title><!--[if (mso 16)]>
  <style type="text/css">
  a {text-decoration: none;}
  </style>
  <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- --> 
<link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"><!--<![endif]--> 
<style type="text/css">
#outlook a {
\tpadding:0;
}
.ExternalClass {
\twidth:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
\tline-height:100%;
}
.es-button {
\tmso-style-priority:100!important;
\ttext-decoration:none!important;
\ttransition:all 100ms ease-in;
}
a[x-apple-data-detectors] {
\tcolor:inherit!important;
\ttext-decoration:none!important;
\tfont-size:inherit!important;
\tfont-family:inherit!important;
\tfont-weight:inherit!important;
\tline-height:inherit!important;
}
.es-button:hover {
\tbackground:#555555!important;
\tborder-color:#555555!important;
}
.es-desk-hidden {
\tdisplay:none;
\tfloat:left;
\toverflow:hidden;
\twidth:0;
\tmax-height:0;
\tline-height:0;
\tmso-hide:all;
}
[data-ogsb] .es-button {
\tborder-width:0!important;
\tpadding:15px 30px 15px 30px!important;
}
[data-ogsb] .es-button.es-button-1 {
\tpadding:15px 25px!important;
}
#myTable {
  width: 100%;
  border-collapse: collapse;
}

#myTable th,
#myTable td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid black;
  border-bottom: 1px solid #ddd;
  font-size: 14px; /* Adjust the font size to your preference */
}

#myTable th {
  background-color: #f2f2f2;
}

#tableBody tr:hover {
  background-color: #f5f5f5;
}

@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:17px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:14px!important; display:inline-block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
</style> 
</head> 
<body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
<div class="es-wrapper-color" style="background-color:#F1F1F1"><!--[if gte mso 9]>
\t\t\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
\t\t\t\t<v:fill type="tile" color="#f1f1f1"></v:fill>
\t\t\t</v:background>
\t\t<![endif]--> 
 <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
   <tr style="border-collapse:collapse"> 
    <td valign="top" style="padding:0;Margin:0"> 
   
     <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
       <tr style="border-collapse:collapse"> 
        <td align="center" style="padding:0;Margin:0"> 
         <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
           <tr style="border-collapse:collapse"> 
            <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;background-color:#ffffff" bgcolor="#333333" align="left"> 
             <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
               <tr style="border-collapse:collapse"> 
                <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0;font-size:0; "><a href="${gskDomain}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:14px"><img src=${data.logo} alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; height:76px;weight:150px" ></a></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table></td> 
       </tr> 
     </table> 
     <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
       <tr style="border-collapse:collapse"> 
        <td align="center" style="padding:0;Margin:0"> 
         <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#333333;width:600px" cellspacing="0" cellpadding="0" bgcolor="#333333" align="center"> 
           <tr style="border-collapse:collapse"> 
            <td style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-image:url('https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');background-repeat:no-repeat" align="left" background="https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"> 
             <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
               <tr style="border-collapse:collapse"> 
                <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:40px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#ffffff">APPLICATION STATUS</h1></td> 
                   </tr> 
                   <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
                   </tr>  
                   <!-- <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
                   </tr>  -->
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table></td> 
       </tr> 
     </table> 
     <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
       <tr style="border-collapse:collapse"> 
        <td align="center" style="padding:0;Margin:0"> 
         <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
           <tr style="border-collapse:collapse"> 
            <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px"> 
             <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
               <tr style="border-collapse:collapse"> 
                <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:14px">Dear ${data.companyDetails.ownerFirstName} ${data.companyDetails.ownerLastName} ,</td> 
                   </tr> 
                   <tr style="border-collapse:collapse"> 


                   <table id="myTable">
                   <thead>
                     <tr>
                     <th style="color: black;">Manager Name</th>
                     <th style="color: black;">Properties</th>
                     <th style="color: black;">Total</th>
                     <th style="color: #FFBF53;">Pending</th>
                     <th style="color: green;">Approved</th>
                     <th style="color: red;">Denied</th>
                     </tr>
                   </thead>
                   <tbody id="tableBody">
                     ${tableRows}
                     <tr>
                      <th>Total</th>
                      <td></td>
                      <td>${data.totalCount}</td>
                      <td>${data.totalPending}</td>
                      <td>${data.totalApproved}</td>
                      <td>${data.totalDenied}</td>
                     </tr>
                   </tbody>
                 </table>
                 
                   </tr>
                   <tr style="border-collapse:collapse"> 
                    <td></td> 
                   </tr> 
                   <!-- <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">If that doesn't work, copy and paste the following link in your browser:<br></p></td> 
                   </tr>
\t\t\t\t\t<tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p href="${domain}/login" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">${domain}/login<br></p></td> 
                   </tr>\t\t\t\t\t  -->
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:14px">Cheers, <br><strong>Team ${data.companyDetails.name}</strong></p></td> 
                   </tr> 
                   <!-- <tr style="border-collapse:collapse margin-top: 20px"> 
                    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px"><strong>Rentdigicare</strong></p></td> 
                   </tr>  -->
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
           
         </table></td> 
       </tr> 
     </table> 
   
     <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
       <tr style="border-collapse:collapse"> 
        <td align="center" style="padding:0;Margin:0"> 
         <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#292828;width:600px" cellspacing="0" cellpadding="0" bgcolor="#292828" align="center"> 
           <tr style="border-collapse:collapse"> 
            <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:40px;padding-right:40px"> 
             <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
               <tr style="border-collapse:collapse"> 
                <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0;font-size:0"> 
                     <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                     <tr style="border-collapse:collapse"> 
                     <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                       <a href="https://www.facebook.com/gskproperties"><img title="Facebook" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                     <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                       <a href="https://www.instagram.com/gskproperties/"><img title="Instagram" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                    </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table></td> 
       </tr> 
     </table> 
     <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
       <tr style="border-collapse:collapse"> 
        <td align="center" style="padding:0;Margin:0"> 
         <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
           <tr style="border-collapse:collapse"> 
            <td align="left" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px"> 
             <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
               <tr style="border-collapse:collapse"> 
                <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                  
                   <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px"> <a target="_blank" class="unsubscribe" href="#" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px">Unsubscribe</a></p></td> 
                   </tr> 
                   <tr style="border-collapse:collapse"> 
                    <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px">Copyright © 2022 - All Rights Reserved.</p></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table></td> 
       </tr> 
     </table> 
     </td> 
   </tr> 
 </table> 
</div>  
</body>
</html>
  `;
  }
  if (emailFor === "NEW_TICKET_FOR_USER") {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
<head> 
<meta charset="UTF-8"> 
<meta content="width=device-width, initial-scale=1" name="viewport"> 
<meta name="x-apple-disable-message-reformatting"> 
<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
<meta content="telephone=no" name="format-detection"> 
<title>New email template 2022-06-24</title><!--[if (mso 16)]>
<style type="text/css">
a {text-decoration: none;}
</style>
<![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG></o:AllowPNG>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- --> 
<link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"><!--<![endif]--> 
<style type="text/css">
#outlook a {
\tpadding:0;
}
.ExternalClass {
\twidth:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
\tline-height:100%;
}
.es-button {
\tmso-style-priority:100!important;
\ttext-decoration:none!important;
\ttransition:all 100ms ease-in;
}
a[x-apple-data-detectors] {
\tcolor:inherit!important;
\ttext-decoration:none!important;
\tfont-size:inherit!important;
\tfont-family:inherit!important;
\tfont-weight:inherit!important;
\tline-height:inherit!important;
}
.es-button:hover {
\tbackground:#555555!important;
\tborder-color:#555555!important;
}
.es-desk-hidden {
\tdisplay:none;
\tfloat:left;
\toverflow:hidden;
\twidth:0;
\tmax-height:0;
\tline-height:0;
\tmso-hide:all;
}
[data-ogsb] .es-button {
\tborder-width:0!important;
\tpadding:15px 30px 15px 30px!important;
}
[data-ogsb] .es-button.es-button-1 {
\tpadding:15px 25px!important;
}
@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:17px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:14px!important; display:inline-block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
</style> 
</head> 
<body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
<div class="es-wrapper-color" style="background-color:#F1F1F1"><!--[if gte mso 9]>
\t\t\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
\t\t\t\t<v:fill type="tile" color="#f1f1f1"></v:fill>
\t\t\t</v:background>
\t\t<![endif]--> 
<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
<tr style="border-collapse:collapse"> 
<td valign="top" style="padding:0;Margin:0"> 

<table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;background-color:#ffffff" bgcolor="#333333" align="left"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             <tr style="border-collapse:collapse"> 
             
              <td align="center" style="padding:0;Margin:0;font-size:0; "><a href="${gskDomain}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:14px"><img src=${data.logo} alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; height:115px;weight:150px" ></a></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#333333;width:600px" cellspacing="0" cellpadding="0" bgcolor="#333333" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-image:url('https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');background-repeat:no-repeat" align="left" background="https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:40px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#ffffff">Maintenance Request Received!</h1></td> 
             </tr>  
             <!-- <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
             </tr>  -->
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
     <tr style="border-collapse:collapse"> 
      <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Dear, ${data.applicantName}</p></td> 
             </tr> 
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">We have received Your maintenance request for the property ${data.propertyName}.<br></br>

Details:
</br>
</br>

Request Type: ${data.requestType}</br>
Permission To Enter Suite: ${data.permission}</br>
Property: ${data.propertyName}</br>
Suite: ${data.suite}</br>
Phone: ${data.phone}</br>
Description:  ${data.details}
</br>
</br>
</tr>

             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Cheers,<br><strong>Team ${data.companyName}</strong></p></td> 
             </tr> 
             <!-- <tr style="border-collapse:collapse margin-top: 20px"> 
              <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px"><strong>Rentdigicare</strong></p></td> 
             </tr>  -->
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
     
   </table></td> 
 </tr> 
</table> 

<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#292828;width:600px" cellspacing="0" cellpadding="0" bgcolor="#292828" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:40px;padding-right:40px"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;font-size:0"> 
               <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                 <tr style="border-collapse:collapse"> 
                  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                    <a href="https://www.facebook.com/gskproperties"><img title="Facebook" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                    <a href="https://www.instagram.com/gskproperties/"><img title="Instagram" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
<table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td align="left" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
            
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px"> <a target="_blank" class="unsubscribe" href="#" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px">Unsubscribe</a></p></td> 
             </tr> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px">Copyright © 2022 - All Rights Reserved.</p></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
</td> 
</tr> 
</table> 
</div>  
</body>
</html>
`;
  }


  if (emailFor === "LEADS_FOR_SUPER_ADMIN") {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
<head> 
<meta charset="UTF-8"> 
<meta content="width=device-width, initial-scale=1" name="viewport"> 
<meta name="x-apple-disable-message-reformatting"> 
<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
<meta content="telephone=no" name="format-detection"> 
<title>New email template 2022-06-24</title><!--[if (mso 16)]>
<style type="text/css">
a {text-decoration: none;}
</style>
<![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG></o:AllowPNG>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- --> 
<link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"><!--<![endif]--> 
<style type="text/css">
#outlook a {
\tpadding:0;
}
.ExternalClass {
\twidth:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
\tline-height:100%;
}
.es-button {
\tmso-style-priority:100!important;
\ttext-decoration:none!important;
\ttransition:all 100ms ease-in;
}
a[x-apple-data-detectors] {
\tcolor:inherit!important;
\ttext-decoration:none!important;
\tfont-size:inherit!important;
\tfont-family:inherit!important;
\tfont-weight:inherit!important;
\tline-height:inherit!important;
}
.es-button:hover {
\tbackground:#555555!important;
\tborder-color:#555555!important;
}
.es-desk-hidden {
\tdisplay:none;
\tfloat:left;
\toverflow:hidden;
\twidth:0;
\tmax-height:0;
\tline-height:0;
\tmso-hide:all;
}
[data-ogsb] .es-button {
\tborder-width:0!important;
\tpadding:15px 30px 15px 30px!important;
}
[data-ogsb] .es-button.es-button-1 {
\tpadding:15px 25px!important;
}
@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:17px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:14px!important; display:inline-block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
</style> 
</head> 
<body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
<div class="es-wrapper-color" style="background-color:#F1F1F1"><!--[if gte mso 9]>
\t\t\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
\t\t\t\t<v:fill type="tile" color="#f1f1f1"></v:fill>
\t\t\t</v:background>
\t\t<![endif]--> 
<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
<tr style="border-collapse:collapse"> 
<td valign="top" style="padding:0;Margin:0"> 

<table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;background-color:#ffffff" bgcolor="#333333" align="left"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;font-size:0; "><a href="${gskDomain}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:14px"><img src=${data.logo} alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; height:76px;weight:150px" ></a></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#333333;width:600px" cellspacing="0" cellpadding="0" bgcolor="#333333" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-image:url('https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');background-repeat:no-repeat" align="left" background="https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:40px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#ffffff">Application Received!</h1></td> 
             </tr> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
             </tr>  
             <!-- <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
             </tr>  -->
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
     <tr style="border-collapse:collapse"> 
      <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Dear, Super Admin </p></td> 
             </tr> 
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">You have recieved an lead from ${data.applicantName}.<br></br>

Details:
</br>
</br>

Lead Name: ${data.applicantName}</br>
Phone: ${data.phone}</br>
Email: ${data.email}</br>
Company: ${data.company}</br>
</br>

</br>




                Please feel free to contact Us.</p></td> 
             </tr>
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;text-align: justify;color:#555555;font-size:15px">If the above "ACCESS ACCOUNT" button does not work then click on link below:<br><a href="${domain}/Login">${domain}/Login</a></p></td> 
             </tr> 
             <!-- <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">If that doesn't work, copy and paste the following link in your browser:<br></p></td> 
             </tr>
\t\t\t\t\t<tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p href="${domain}/login" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">${domain}/login<br></p></td> 
             </tr>\t\t\t\t\t  -->
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Cheers,<br><strong>Team Rentdigicare</strong></p></td> 
             </tr> 
             <!-- <tr style="border-collapse:collapse margin-top: 20px"> 
              <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px"><strong>Rentdigicare</strong></p></td> 
             </tr>  -->
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
     
   </table></td> 
 </tr> 
</table> 

<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#292828;width:600px" cellspacing="0" cellpadding="0" bgcolor="#292828" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:40px;padding-right:40px"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;font-size:0"> 
               <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
               <tr style="border-collapse:collapse"> 
               <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                 <a href="https://www.facebook.com/Rentdigi/"><img title="Facebook" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
               <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                 <a href="https://www.instagram.com/rentdigi/"><img title="Instagram" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
              </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
<table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
 <tr style="border-collapse:collapse"> 
  <td align="center" style="padding:0;Margin:0"> 
   <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
     <tr style="border-collapse:collapse"> 
      <td align="left" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px"> 
       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
         <tr style="border-collapse:collapse"> 
          <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
            
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px"> <a target="_blank" class="unsubscribe" href="#" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px">Unsubscribe</a></p></td> 
             </tr> 
             <tr style="border-collapse:collapse"> 
              <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px">Copyright © 2022 - All Rights Reserved.</p></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table></td> 
 </tr> 
</table> 
</td> 
</tr> 
</table> 
</div>  
</body>
</html>
`;
  }

  if (emailFor === "REQUEST_REASSIGN_VENDOR") {
    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
 <head> 
  <meta charset="UTF-8"> 
  <meta content="width=device-width, initial-scale=1" name="viewport"> 
  <meta name="x-apple-disable-message-reformatting"> 
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
  <meta content="telephone=no" name="format-detection"> 
  <title>New email template 2022-06-24</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- --> 
  <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"><!--<![endif]--> 
  <style type="text/css">
#outlook a {
\tpadding:0;
}
.ExternalClass {
\twidth:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
\tline-height:100%;
}
.es-button {
\tmso-style-priority:100!important;
\ttext-decoration:none!important;
\ttransition:all 100ms ease-in;
}
a[x-apple-data-detectors] {
\tcolor:inherit!important;
\ttext-decoration:none!important;
\tfont-size:inherit!important;
\tfont-family:inherit!important;
\tfont-weight:inherit!important;
\tline-height:inherit!important;
}
.es-button:hover {
\tbackground:#555555!important;
\tborder-color:#555555!important;
}
.es-desk-hidden {
\tdisplay:none;
\tfloat:left;
\toverflow:hidden;
\twidth:0;
\tmax-height:0;
\tline-height:0;
\tmso-hide:all;
}
[data-ogsb] .es-button {
\tborder-width:0!important;
\tpadding:15px 30px 15px 30px!important;
}
[data-ogsb] .es-button.es-button-1 {
\tpadding:15px 25px!important;
}
@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:17px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:17px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:14px!important; display:inline-block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
</style> 
 </head> 
 <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
  <div class="es-wrapper-color" style="background-color:#F1F1F1"><!--[if gte mso 9]>
\t\t\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
\t\t\t\t<v:fill type="tile" color="#f1f1f1"></v:fill>
\t\t\t</v:background>
\t\t<![endif]--> 
   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
     <tr style="border-collapse:collapse"> 
      <td valign="top" style="padding:0;Margin:0"> 
     
       <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
         <tr style="border-collapse:collapse"> 
          <td align="center" style="padding:0;Margin:0"> 
           <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
             <tr style="border-collapse:collapse"> 
              <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;background-color:#ffffff" bgcolor="#333333" align="left"> 
                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                  <tr style="border-collapse:collapse"> 
                   <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                      <tr style="border-collapse:collapse"> 
                       <td align="center" style="padding:0;Margin:0;font-size:0; "><a href="${gskDomain}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:14px"><img src="${data.logo}" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; height:76px;weight:150px" ></a></td> 
                      </tr> 
                    </table></td> 
                  </tr> 
                </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
         <tr style="border-collapse:collapse"> 
          <td align="center" style="padding:0;Margin:0"> 
           <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#333333;width:600px" cellspacing="0" cellpadding="0" bgcolor="#333333" align="center"> 
             <tr style="border-collapse:collapse"> 
              <td style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-image:url('https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');background-repeat:no-repeat" align="left" background="https://jlbcxs.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                 <tr style="border-collapse:collapse"> 
                  <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                     <tr style="border-collapse:collapse"> 
                      <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:40px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#ffffff">Reassigned Ticket</h1></td> 
                     </tr> 
                     <tr style="border-collapse:collapse"> 
                      <td esdev-links-color="#757575" align="center" style="Margin:0;padding-top:10px;padding-bottom:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#c5c5c5;font-size:15px"></p></td> 
                     </tr> 
                     <!-- <tr style="border-collapse:collapse"> 
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="es-button-border" style="border-style:solid;border-color:#26a4d3;background:none 0% 0% repeat scroll #26a4d3;border-width:0px;display:inline-block;border-radius:50px;width:auto"><a href="${domain}/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;transition:all 100ms ease-in;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;border-style:solid;border-color:#26a4d3;border-width:15px 30px 15px 30px;display:inline-block;background:#26a4d3;border-radius:50px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">ACCESS ACCOUNT</a></span></td> 
                     </tr>  -->
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
         <tr style="border-collapse:collapse"> 
          <td align="center" style="padding:0;Margin:0"> 
           <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
             <tr style="border-collapse:collapse"> 
              <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                 <tr style="border-collapse:collapse"> 
                  <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                     
                     <tr style="border-collapse:collapse"> 
                      <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Dear, ${data.owner}</p></td> 
                     </tr> 
                       <tr style="border-collapse:collapse">
              <td align="left" style="padding:0;Margin:0;padding-bottom:10px; "><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Maintenance request has been reassigned back to you.<br></br>

Details:
</br>
</br>
Reassigned By: ${data.reassignedBy}</br>
Role: ${data.role}</br>
Request Type: ${data.requestType}</br>
Permission To Enter : ${data.permission}</br>
Property: ${data.propertyName}</br>
Suite: ${data.suite}</br>
Phone: ${data.phone}</br>
Description:  ${data.details}
</br>
</br>
</tr>
                     <!-- <tr style="border-collapse:collapse"> 
                      <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">If that doesn't work, copy and paste the following link in your browser:<br></p></td> 
                     </tr>
\t\t\t\t\t<tr style="border-collapse:collapse"> 
                      <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p href="${domain}/login" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">${domain}/login<br></p></td> 
                     </tr>\t\t\t\t\t  -->
                     <tr style="border-collapse:collapse"> 
                      <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px">Cheers,<br><strong>Team ${data.companyName}</strong></p></td> 
                     </tr> 
                     <!-- <tr style="border-collapse:collapse margin-top: 20px"> 
                      <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#555555;font-size:15px"><strong>Rentdigicare</strong></p></td> 
                     </tr>  -->
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
             
           </table></td> 
         </tr> 
       </table> 
     
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
         <tr style="border-collapse:collapse"> 
          <td align="center" style="padding:0;Margin:0"> 
           <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#292828;width:600px" cellspacing="0" cellpadding="0" bgcolor="#292828" align="center"> 
             <tr style="border-collapse:collapse"> 
              <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:40px;padding-right:40px"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                 <tr style="border-collapse:collapse"> 
                  <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                     <tr style="border-collapse:collapse"> 
                      <td align="center" style="padding:0;Margin:0;font-size:0"> 
                       <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                         <tr style="border-collapse:collapse"> 
                          <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                            <a href="https://www.facebook.com/gskproperties"><img title="Facebook" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                          <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px">
                            <a href="https://www.instagram.com/gskproperties/"><img title="Instagram" src="https://jlbcxs.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
       <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
         <tr style="border-collapse:collapse"> 
          <td align="center" style="padding:0;Margin:0"> 
           <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"> 
             <tr style="border-collapse:collapse"> 
              <td align="left" style="Margin:0;padding-top:40px;padding-bottom:40px;padding-left:40px;padding-right:40px"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                 <tr style="border-collapse:collapse"> 
                  <td valign="top" align="center" style="padding:0;Margin:0;width:520px"> 
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                    
                     <tr style="border-collapse:collapse"> 
                      <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px"> <a target="_blank" class="unsubscribe" href="#" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:12px">Unsubscribe</a></p></td> 
                     </tr> 
                     <tr style="border-collapse:collapse"> 
                      <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#666666;font-size:12px">Copyright © 2022 - All Rights Reserved.</p></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
       </td> 
     </tr> 
   </table> 
  </div>  
 </body>
</html>
    `;
  }

}
