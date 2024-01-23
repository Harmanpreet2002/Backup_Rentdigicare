import React from 'react'
import { useCallback } from 'react';
import Company from './Company'
import axios from '../api/axios'
import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function CompanyList(props) {
    const GET_COMPANIES_URL = `/company/list?page=${props.pageno}&limit=10`
    const TOTAL_COMPANIES_URL = `/company/total`
    const COMPANY_NAME_URL = `/company/filter/company_list`
    const [companies, setCompanies] = useState([]);
    const [CompanyName, setCompanyName] = useState([]);
    const [totalcompanies, setotalcompanies] = useState(0);
    const decode = jwt_decode(window.localStorage.accessToken)



    React.useEffect(() => {

        companyName()

        if (props.filter.filter === false) {
            getCompanies(GET_COMPANIES_URL)
        }

        if (props.filter.filter === true) {
            filterCompany(GET_COMPANIES_URL, {
                role: decode.role,
                filter: props.filter.filter,
                filterCompanyName: props.filter.company,
                filterOwnerName: props.filter.ownwername,
                filterCity: props.filter.city

            })
        }

    }, [props.pageno, props.one]);

    // API Call
    const companyName = async () => {
        const response = await axios.get(COMPANY_NAME_URL);
        const temp = (response.data.companies)
        setCompanyName(temp)
    }
    const getCompanies = async () => {
        const response = await axios.post(GET_COMPANIES_URL);
        const temp = (response.data.results.companies)
        setCompanies(temp)
    }
    const filterCompany = async (url, data) => {
        const response = await axios.post(url, data);
        console.log(response)
        const temp = (response.data.results.companies)
        setCompanies(temp)
    }
    const totalCompanies = async () => {
        const response = await axios.get(TOTAL_COMPANIES_URL);
        setotalcompanies(response.data.totalCompanies)
    }

    useState(async () => {
        await getCompanies()
        await totalCompanies()
    })

    let number = 0 ;
    let number1 = props.pageno > 1 ? (props.pageno - 1)* 10 : 0 ;



    props.settotal(totalcompanies)
    props.companyName(CompanyName)
    return (
        companies.map(company => {
            number++
            return (<Company
                number={number+number1}
                adminID={decode.id}
                id={company._id}
                name={company.name}
                owner={company.ownerFirstName + " " + company.ownerLastName}
                city={company.city}
                addresses={company.address}
                state={company.state}
                email={company.email}
                domain={company.domain}
                zip={company.zip}
                phone={company.phone}
                script={company.scriptURL}
                ownerFirstName={company.ownerFirstName}
                ownerLastName={company.ownerLastName}
                logo={company?.logo}
            />)
        })
    )

}
