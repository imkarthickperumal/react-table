import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import axios from "axios";
import "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import ArticleIcon from "@mui/icons-material/Article";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Table Data Exported to PDF", 10, 10);

    const columns = [
      { title: "ID", dataKey: "id" },
      { title: "FirstName", dataKey: "firstName" },
      { title: "LastName", dataKey: "lastName" },
      { title: "Age", dataKey: "age" },
      { title: "Gender", dataKey: "gender" },
      { title: "Email", dataKey: "email" },
      { title: "Phone", dataKey: "phone" },
    ];

    const rows = data.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      age: item.age,
      gender: item.gender,
      email: item.email,
      phone: item.phone,
    }));

    doc.autoTable({ columns, body: rows });
    doc.save("table_data.pdf");
  };

  return (
    <>
      <div style={{ marginBottom: "10px", marginRight: "72%" }}>
        <Button
          style={{ textTransform: "capitalize" }}
          variant="contained"
          color="primary"
          onClick={exportToExcel}
        >
          <ArticleIcon /> Excel
        </Button>
        <Button
          style={{ marginLeft: "10px", textTransform: "capitalize" }}
          variant="contained"
          color="primary"
          onClick={exportToPDF}
        >
          <PictureAsPdfIcon /> PDF
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{ width: "80rem", alignSelf: "center", marginBottom: "15px" }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            pagination
            checkboxSelection
            onSelectionModelChange={(newSelection) =>
              setSelection(newSelection)
            }
            selectionModel={selection}
            sortingOrder={["asc", "desc"]}
            onRowSelected={(params) => console.log(params)}
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
