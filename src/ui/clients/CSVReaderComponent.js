import React, {useEffect, useState} from 'react';
import * as XLSX from 'xlsx';
import {addClient} from "../../services/services";

function XLSXReaderComponent() {
    const [xlsxData, setXLSXData] = useState([]);

    // useEffect(() => {
    //     console.log(xlsxData);
    // }, [xlsxData]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});

            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            let i = 0;
            for (let data of jsonData) {
                if (i > 3) {
                    console.log(data);
                    let company = {
                        name: data[2] ? data[2] : '',
                        bank: '',
                        uniqueNumber: '',
                        vatNumber: data[3] ? data[3] : '',
                        country: data[5] ? data[5] : '',
                        phoneNumber: data[4] ? data[4] : '',
                        email: data[7] ? data[7] : '',
                        currency: data[6] ? data[6] : '',
                        swift: '',
                        iban: data[8] ? data[8] : '',
                        order: i - 3,
                    }
                    await addClient(company, true)
                }
                i++;
            }
            setXLSXData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <input type="file" accept=".xlsx" onChange={handleFileUpload} />

            <table>
                <thead>
                <tr>
                    {xlsxData.length > 0 &&
                        xlsxData[0].map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                </tr>
                </thead>
                <tbody>
                {xlsxData.length > 0 &&
                    xlsxData.slice(1).map((row, index) => (
                        <tr key={index}>
                            {row.map((cell, index) => (
                                <td key={index}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default XLSXReaderComponent;
