import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';
import { Row, Col, Card, CardBody, Label, Input, Form } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Select from "react-select";
import DynamicTable from './dynamicTable';
import jwt_decode from "jwt-decode";
import axios from "../api/axios";


const Agreement = () => {
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  const [showAddInput, setShowAddInput] = useState('none');
  const [type, setType] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputs, setInputs] = useState([]);
  const [inputError, setInputError] = useState('');
  const [propertyList, setPropertyList] = useState([]);
  const [Property, setProperty] = useState('');
  const [check_property, setcheck_property] = useState(false);
  const [property_error, setproperty_error] = useState('');

  const PROPERTIES_URL_MANAGER = `/property/getManagerProperties`;
  const  PROPERTIES_URL_COMPANY =  `/property/getCompanyProperties`;

  const handleAddInput = () => {
    const isInputNameExists = inputs.some((input) => input.name === inputName);

    if (isInputNameExists) {
      setInputError('Field is already there !')
    } else {
      setInputError('')
      const newInput = {
        name: inputName,
        type: type,
        value: ''
      };
      setInputs([...inputs, newInput]);
      setShowAddInput(showAddInput === 'none' ? 'flex' : 'none');
    }
  };
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedInputs = [...inputs];
    updatedInputs[index] = {
      ...updatedInputs[index],
      value: value
    };
    setInputs(updatedInputs);
  };
  const handleRemoveInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let data = inputs?.reduce((obj, input) => {
      if (input.type == 'number') {
        obj[input.name] = parseInt(input.value);
      } else {
        obj[input.name] = input.value
      }
      return obj;
    }, {})
    console.log(data);
  }
  const getAllPropeties = async (url, role) => {
    try {
      let data = {}
      if(role == 'company'){
        data.domain = decode.domain
      }else{
        data.managerID = decode.id
      }
      const response = await axios.post(url, data)
      if (response.data) {
        setPropertyList(response.data.properties.map((p) => {
          return {
            label: p.title,
            value: p._id
          }
        }))
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if(decode.role == 'company'){
      getAllPropeties(PROPERTIES_URL_COMPANY, 'company')
    }else{
      getAllPropeties(PROPERTIES_URL_MANAGER, 'manager')
    }
  }, [])
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Agreement Form</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Agreement Form" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className='row'>
                    <div className="col-md-12 mt-3">
                      <div className="text-end">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowAddInput(showAddInput == 'none' ? 'flex' : 'none')}
                        >
                          Add Input
                        </button>
                      </div>

                    </div>
                  </div>
                  <div className='row' style={{ display: `${showAddInput}` }}>
                    <div className="col-md-4" >
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-phone-input"
                        >
                          label
                        </Label>
                        <Input
                          placeholder="Enter field"
                          onChange={(e) => setInputName(e.target.value)}

                        />
                      </div>
                    </div>
                    <div className="col-md-4" >
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="formrow-phone-input"
                        >
                          Type
                        </Label>
                        <Select
                          placeholder="Select an input type"
                          onChange={(selectedOption) => setType(selectedOption.value)}
                          options={[
                            { value: "text", label: "Text" },
                            { value: "number", label: "Number" },
                            { value: "date", label: "Date" },
                            // Add more options for different input types as needed
                          ]}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className='mt-4'>
                        <button
                          className="btn btn-primary"
                          onClick={handleAddInput}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {
                      inputError.length > 0 &&
                      <p className='text-danger'>{inputError}</p>
                    }
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="formrow-facility-input"
                          >
                            Building Name *
                          </Label>
                          <Select
                            value={Property}
                            onBlur={(e) => {
                              if (!Property) {
                                setcheck_property(false);
                                setproperty_error(
                                  "Please select a Property!"
                                );
                              } else {
                                setcheck_property(true);
                              }
                            }}
                            onChange={(e) => {
                              setProperty(e);
                            }}
                            options={propertyList}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                          {check_property ? (
                            ""
                          ) : (
                            <Label style={{ color: "red" }}>
                              {property_error}
                            </Label>
                          )}

                        </div>
                      </div>
                      {inputs.length > 0 &&
                        inputs.map((input, index) => (
                          <div className="col-md-4" key={index}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor={`formrow-phone-input-${index}`}>
                                {input.name}
                              </Label>
                              <Input
                                placeholder={`Enter ${input.name}`}
                                type={input.type}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                id={`formrow-phone-input-${index}`}
                              />
                              <button
                                type="button"
                                className="btn btn-danger mt-2"
                                onClick={() => handleRemoveInput(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      {inputs.length > 0 && (
                        <div className="col-md-12">
                          <div className="text-end">
                            <button type="submit" className="btn btn-success save-user">
                              Submit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Form>
                  <div className='row'>
                    <div className="col-md-6">
                    <DynamicTable title={`Table 1`} />
                    </div>
                    <div className="col-md-6">
                    <DynamicTable title={`Table 2`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Agreement;
