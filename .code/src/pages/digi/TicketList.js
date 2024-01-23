import React, { useEffect } from "react";
import Ticket from "./TicketRow";
import axios from "../api/axios";
import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function TicketList(props) {
  const ADMIN_TICKET_LIST_URL = "/ticket/admin";
  const COMPANY_TICKET_URL = "/ticket/filter_tickets_company";
  const MANAGER_TICKET_URL = "/ticket/filter_tickets_manager";
  const CUSTOMER_TICKET_URL = "/ticket/filter_tickets_customer";
  const [tickets, setTickets] = useState(
    props.filteredTickets ? props.filteredTickets : []
  );
  const [notesCount, setNotesCount] = useState(
    props.notesCount ? props.notesCount : []
  );
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));
  // API Call
  const getTickets = async (url, data) => {
    console.log(url);
    const response = await axios.post(url, data);
    if (response.data.tickets) {
      // const temp = response.data.tickets.reverse();
      setTickets(response.data.tickets);
      setNotesCount(response.data.notesCount);
      if (response.data.totalCount) {
        props.setTotalTickets(response.data.totalCount);
      }
    }
  };

  const setRole = async () => {
    if (props.filteredTickets.length >= 0) {
      if (decode.role === "company") {
        await getTickets(COMPANY_TICKET_URL, {
          companyDomain: decode.domain,
        });
      }

      if (decode.role === "manager") {
        await getTickets(MANAGER_TICKET_URL, {
          managerID: decode.id,
          pageNumber: 1,
        });
      }

      if (decode.role === "admin") {
        await getTickets(ADMIN_TICKET_LIST_URL, {});
      }

      if (decode.role === "customer") {
        await getTickets(CUSTOMER_TICKET_URL, {
          customerID: decode.id,
          pageNumber: 1,
        });
      }
    }
  };

  useEffect(() => {
    setRole();
  }, []);

  useEffect(() => {
    setNotesCount(props.notesCount);
    setTickets(props.filteredTickets);
  }, [props.filteredTickets]);

  let number = 0;

  let number1 = props.page > 1 ? (props.page - 1) * 10 : 0;

  return tickets.map((ticket) => {
    number++;

    // const date = new Date(ticket.createdAt)
    // const createdAt = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
    return (
      <Ticket
        key={ticket._id}
        id={ticket._id}
        searchTicket={props.searchTicket}
        getTicket={() => {
          setRole();
        }}
        number={number + number1}
        name={ticket.name}
        ticket={ticket}
        quotedVendorTickets={
          ticket.quotedVendorTickets?.length > 0
            ? ticket.quotedVendorTickets
            : []
        }
        email={ticket.email}
        phone={ticket.phone}
        assignedPropertyOwner={ticket?.propertyManagerId?.map(
          (v) =>
            `${v?.firstname ? v?.firstname : ""} ${
              v?.lastname ? v?.lastname : ""
            } ,`
        )}
        priority={ticket.priority}
        requestType={ticket.requestType}
        companyDomain={ticket.companyDomain}
        details={ticket.details}
        type={ticket.requestType}
        permission={ticket.permission}
        property={ticket.property}
        building={ticket.building}
        propertySignature={ticket.propertySignature}
        status={ticket.status}
        createdAt={ticket.createdAt}
        estimatedAmount={
          ticket.quotedVendorTickets?.length > 0
            ? ticket.quotedVendorTickets[0]?.estimatedAmount
            : ""
        }
        role={decode.role}
        assignVendor={ticket.assignVendor}
        startDate={
          ticket?.quotedVendorTickets?.length > 0
            ? ticket?.quotedVendorTickets[0].startDate
            : ticket.startDate
        }
        endDate={
          ticket?.quotedVendorTickets?.length > 0
            ? ticket?.quotedVendorTickets[0].endDate
            : ticket.endDate
        }
        startTime={
          ticket?.quotedVendorTickets?.length > 0
            ? ticket?.quotedVendorTickets[0].startTime
            : ticket.startTime
        }
        endTime={
          ticket?.quotedVendorTickets?.length > 0
            ? ticket?.quotedVendorTickets[0].estimatedETime
            : ticket.estimatedETime
        }
        estimatedEndDate={
          ticket?.quotedVendorTickets?.length > 0
            ? ticket?.quotedVendorTickets[0].estimatedEndDate
            : ticket.estimatedEndDate
        }
        notes={
          ticket?.quotedVendorTickets?.length > 0
            ? ticket?.quotedVendorTickets[0].notes
            : ticket.notes
        }
        isConfirmationSet={ticket.isConfirmationSet}
        suite={ticket.suite}
        isMovedToVendorPortal={ticket.isMovedToVendorPortal}
        confirmedQuote={ticket.confirmedQuote}
        assignedTo={ticket.assignedTo}
        assignSpecificVendors={ticket.assignSpecificVendors}
        internalStatus={ticket.internalStatus}
        rating={ticket.ratings}
        documents={ticket.documents}
        notesCount={props.notesCount}
      />
    );
  });
}
