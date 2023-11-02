import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import axios from "axios";
import "jspdf-autotable";
import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [selection, setSelection] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "FirstName", width: 200 },
    { field: "lastName", headerName: "LastName", width: 200 },
    { field: "age", headerName: "Age", width: 200 },
    { field: "gender", headerName: "Gender", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 200 },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://dummyjson.com/users");
        setData(response.data.users);
        console.log(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const exportToExcel = () => {
    const csvData = data.map((item) => ({
      Dd: item.id,
      Fileirstname: item.firstname,
      Lastname: item.lastname,
      Age: item.age,
      Gender: item.gender,
      Email: item.email,
      Phone: item.phone,
    }));
    const headers = [
      { label: "ID", key: "ID" },
      { label: "FirstName", key: "FirstName" },
      { label: "LastName", key: "LastName" },
      { label: "Age", key: "Age" },
      { label: "Gender", key: "Gender" },
      { label: "Email", key: "Email" },
      { label: "Phone", key: "Phone" },
    ];
    return (
      <CSVLink data={csvData} headers={headers} filename={"dtable_data.csv"}>
        Export to Excel
      </CSVLink>
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Grid Exported to PDF", 10, 10);

    const columns = [
      { title: "ID", dataKey: "id" },
      { title: "FirstName", dataKey: "firstname" },
      { title: "LastName", dataKey: "lastname" },
      { title: "Age", dataKey: "age" },
      { title: "Gender", dataKey: "gender" },
      { title: "Email", dataKey: "email" },
      { title: "Phone", dataKey: "phone" },
    ];

    const rows = data.map((item) => ({
      id: item.id,
      firstname: item.firstname,
      lastname: item.lastname,
      age: item.age,
      gender: item.gender,
      email: item.email,
      phone: item.phone,
    }));

    doc.autoTable({ columns, body: rows });
    doc.save("table_data.pdf");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          Export to Excel
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          variant="contained"
          color="primary"
          onClick={exportToPDF}
        >
          Export to PDF
        </Button>
      </div>
      <div style={{ width: "85rem", alignSelf: "center" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={10}
          pagination
          checkboxSelection
          onSelectionModelChange={(newSelection) => setSelection(newSelection)}
          selectionModel={selection}
          sortingOrder={["asc", "desc"]}
          onRowSelected={(params) => console.log(params)}
        />
      </div>
    </div>
  );
};

export default DataTable;
