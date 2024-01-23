``
function genScript(domainName, buttonColor, buttonAlignment, applicantButtonName, ticketButtonName, applicantButtonEnabled, ticketButtonEnabled) {
    const domain  = process.env.DOMAIN

    const script = `let applicant = document.createElement("applicantButton");
    let ticket = document.createElement("ticketButton");
    let parentDiv = document.createElement("div");
    let url = document.createElement("a");
    url.id = "buttonLinkUrl"
    url.href = "${domain}/applicant?name=${domainName}"
    url.style.display = "none"
    applicant.className += "parentDiv";
    
    if(${applicantButtonEnabled}){
        applicant.className += "applicantButton";
        applicant.innerHTML = "${applicantButtonName}";
        parentDiv.appendChild(applicant)
        applicant.onclick = redirectApplicant;
        applicant.style.background = "${buttonColor}";
        applicant.style.padding = "10px 30px";
    }
    
    // if(${ticketButtonEnabled}){
    //     ticket.className += "ticketButton";
    //     ticket.innerHTML += "${ticketButtonName}";
    //     parentDiv.appendChild(ticket)
    //     ticket.onclick = redirectTicket;
    //     ticket.style.background = "${buttonColor}";
    //     ticket.style.padding = "10px 30px";
    //     ticket.style.marginLeft = "10px";
    // }

    
    // Parent Div Positioning and style
    ${getAlignment(buttonAlignment)}
    
    // Addding Div On Page
    document.body.appendChild(parentDiv);

    function redirectApplicant() { window.location.href = "${domain}/applicant?name=${domainName}"; }
    function redirectTicket() { window.location.href = "${domain}/ticket_manager?name=${domainName}"; }
`
    return script
}

function getAlignment(buttonAlignment) {
    if(buttonAlignment === "top-left"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "0";
        parentDiv.style.top = "0";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;
    }else if(buttonAlignment === "top-center"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "50%";
        parentDiv.style.top = "0";
        parentDiv.style.transform = "translateX(-50%)";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;
    }else if(buttonAlignment === "top-right"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.right = "0";
        parentDiv.style.top = "0";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;
    }else if(buttonAlignment === "center-left"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "0";
        parentDiv.style.top = "50%";
        parentDiv.style.transform = "translateY(-50%)";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;

    }else if(buttonAlignment === "center-center"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "50%";
        parentDiv.style.top = "50%";
        parentDiv.style.transform = "translate(-50%, -50%)";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;

    }else if(buttonAlignment === "center-right"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.right = "0";
        parentDiv.style.top = "50%";
        parentDiv.style.transform = "translateY(-50%)";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;

    }else if(buttonAlignment === "bottom-left"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "0";
        parentDiv.style.bottom = "0";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;

    }else if(buttonAlignment === "bottom-center"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "50%";
        parentDiv.style.bottom = "0";
        parentDiv.style.transform = "translateX(-50%)";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;

    }else if(buttonAlignment === "bottom-right"){
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.right = "0";
        parentDiv.style.bottom = "0";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;

    }else{
        const alignmentCSS = `parentDiv.style.zIndex = "999999";
        parentDiv.style.left = "0";
        parentDiv.style.top = "50%";
        parentDiv.style.transform = "translateY(-50%)";
        parentDiv.style.padding = "10px";
        parentDiv.style.color = "white";
        parentDiv.style.borderRadius = "4px";
        parentDiv.style.boxShadow = "0 0 25px 0 rgb(0 0 0 / 30%)";
        parentDiv.style.position = "absolute";
        parentDiv.style.cursor = "pointer";`;
        return alignmentCSS;
    }
}

module.exports = genScript