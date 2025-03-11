import * as XLSX from 'xlsx';
import { useState } from 'react';

function Importar({ setExcelData, setDataToFilter, setExcelTableData, showMessage, setTotalEntries }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      readExcel(file);
    }
  };

  const readExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      jsonData.shift();

      let defineLegicKey = jsonData.reduce((acc, current) => {
        return { ...acc, [current[2]]: current };
      }, {});

      let formatToFilter = jsonData.reduce((acc, current) => {
        return { ...acc, [current[0]]: current };
      }, {});
      setTotalEntries(jsonData.length);

      localStorage.setItem('gactiveImportedData', JSON.stringify(jsonData));
      setExcelData(defineLegicKey);
      setDataToFilter(formatToFilter);
      setExcelTableData(true);
      showMessage("Ficheiro importado com sucesso!");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <section className='files-management-container'>
      <p>Importar Ficheiros</p>
      <input type='file' onChange={handleFileUpload} />
    </section>
  );
}

export default Importar;
