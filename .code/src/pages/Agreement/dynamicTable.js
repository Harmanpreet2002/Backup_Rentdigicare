import React, { useState } from 'react';
import { Table, Input, Button } from 'reactstrap';

const DynamicTable = ({title}) => {
  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    const newRow = { name: '', value: '' };
    setRows([...rows, newRow]);
  };

  const handleRowChange = (e, index, field) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = e.target.value;
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((row, i) => i !== index);
    setRows(updatedRows);
  };

  const calculateTotal = () => {
    let total = 0;
    for (let row of rows) {
      const value = parseFloat(row.value);
      if (!isNaN(value)) {
        total += value;
      }
    }
    return total.toFixed(2);
  };

  return (
    <div>
      <Table>
        <thead>
          <tr className='text-center'>
            <th colSpan="3">{title}</th>
          </tr>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <Input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleRowChange(e, index, 'name')}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={row.value}
                  onChange={(e) => handleRowChange(e, index, 'value')}
                />
              </td>
              <td>
                <Button color="danger" onClick={() => handleRemoveRow(index)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{calculateTotal()}</td>
            <td>
              <Button color="primary" onClick={handleAddRow}>
                Add Row
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default DynamicTable;
