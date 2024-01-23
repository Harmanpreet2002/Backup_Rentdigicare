const domain = process.env.DOMAIN
const port = process.env.PORT

exports.generateScript = (domainName, buttonColor = "#29ABFF", applicationButtonName = "Submit Application", widgetPosition="right", applicationButtonEnabled = true) => {
    const domain  = process.env.DOMAIN;
    let displayApplicationButton = "block"
    let position = "widgetLeftPosition"
    let positionProperty = "left"
    const RENTDIGI_DOMAIN = process.env.RENTDIGICARE_DOMAIN
    if(widgetPosition === "right"){
        position = "widgetRightPosition";
        positionProperty = "right"
    }

    if(!applicationButtonEnabled){
        displayApplicationButton = "none";
    }
    const htmlContent = `
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        <style>
        body {
            margin: 0;
            font-family: 'Montserrat', sans-serif !important;
        }
        .widgetText {
            background: #fff;
            border: 0;
            box-shadow: rgb(0 18 46 / 18%) 0px 2px 20px 0px;
            border-radius: 16px;
            padding: 10px 15px;
            position: absolute;
            bottom: 23px;
            color: #090909;
            border: 2px solid #29ABFF;
            font-family: 'Montserrat', sans-serif !important;
            
        }
        .widgetText i {
            display: inline-block;
            position: absolute;
            top: 10px;
        }
        .widgetText i img {
            width: 20px;
        }
        .widgetButton {
            width: 60px;
            height: 60px;
            border: 0;
            border-radius: 28px;
            transition: all 0.2s ease-in-out 0s;
            box-shadow: rgb(2 6 16 / 20%) 0px 2px 16px;
            background: #29ABFF;
            position: absolute;
            top: 17px;
            color: #fff;
        }
        .widgetButton::before {
            background: #fff;
            transition: all 0.2s ease-in-out 0s;
            transform: scale(0);
            position: absolute;
            content: "";
            width: 68px;
            height: 68px;
            left: -4px;
            top: -4px;
            border-radius: 68px;
        }
        .widgetButton:hover::before {
            transform: scale(1);
        }
        .widgetButton i svg {
            width: 22px;
            height: 22px;
        }
        .widgetButton .icon2 {
            position: absolute;
            left: 50%;
            transform: translateX(-50%) scale(0);
            transition: all 0.2s ease-in-out 0s;
            color: #29ABFF;
        }
        .widgetButton:hover .icon2 {
            transform: translateX(-50%) scale(1);
        }
        .widgetLeftPosition .widgetText {
            right: 0;
            padding-left: 50px;
        }
        .widgetLeftPosition .widgetText i {
            left: 15px;
        }
        .widgetRightPosition .widgetText {
            left: 0;
            padding-right: 50px;
        }
        .widgetRightPosition .widgetText i {
            right: 15px;
        }
        .widgetLeftPosition .widgetButton {
            left: 10px;
        }
        .widgetRightPosition .widgetButton {
            right: 10px;
        }
    </style>

      <div class="widgetDiv ${position}">
      <a id="scriptUrlLink" href = "${domain}/applicant?name=${domainName}" style="display: none;"></a>
        <button id="applicantButtonText" class="widgetText" style="border-color: ${buttonColor}; cursor: pointer">${applicationButtonName}<i><img src="${RENTDIGI_DOMAIN}:${port}/images/hi.png" /></i></button>
        <button id="applicationButton" class="widgetButton" style="background-color: ${buttonColor}; cursor: pointer">
        <i class="icon1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-check" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
          </svg>
        </i>
        <i class="icon2" style="color: ${buttonColor};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
          </svg>
        </i>
        </button>
      </div>
    `

    const script = `
    let htmlContent = \`${htmlContent}\`;
    let ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", "scriptFrame");
    ifrm.setAttribute("style", "position: fixed; ${positionProperty}: 20px; bottom: 20px; width: 294px; height: 94px; max-height: 100vh; max-width: 100vw; transition: none 0s ease 0s !important; z-index: 99999999; margin: 0; padding: 0; border: 0; display: ${displayApplicationButton};")
    document.body.appendChild(ifrm);
    let doc = document.getElementById("scriptFrame")
    doc.contentWindow.document.open();
    doc.contentWindow.document.write(htmlContent);
    doc.contentWindow.document.close();
    
    const applicationButton = doc.contentWindow.document.getElementById("applicationButton")
    const applicationButtonText = doc.contentWindow.document.getElementById("applicantButtonText")
    
    applicationButton.onclick = redirectApplicant
    applicationButtonText.onclick = redirectApplicant
    
    function redirectApplicant() { window.location.href = "${domain}/applicant?name=${domainName}"; }
    function redirectTicket() { window.location.href = "${domain}/ticket_manager?name=${domainName}"; }
`

    return script
}