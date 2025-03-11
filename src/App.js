
import * as XLSX from 'xlsx';
import './App.css';
import Barcode from './components/barcode';
import { useEffect, useState } from 'react';
import LeftMenu from './components/leftMenu';
import logo from './assets/logo.png';
import { Logo } from './components/logo';
import Legic from './components/legic';
import Importar from '../src/components/importar';
import Status from '../src/components/status';
import Exportar from '../src/components/exportar';
import { Logoinical } from './components/logoinicial';
import Limpar from './components/limpar';

function App() {
  const [viewSelected, setViewSelected] = useState('logo');
  const [excelData, setExcelData] = useState(null);
  const [inputLegic, setInputLegic] = useState('');
  const [inputBarcode, setInputBarcode] = useState('');
  const [mainContainer, setMainContainer] = useState(false);
  const [importFiles, setImportFiles] = useState(false);
  const [exportFiles, setExportFiles] = useState(false);
  const [statusSection, setStatusSection] = useState(false);
 
  const [dataToFilter, setDataToFilter] = useState(null);
  const [excelTableData, setExcelTableData] = useState(null);
  const [legicDB, setLegicDB] = useState([]);
  const [registeredLegicData, setRegisteredLegicData] = useState(true);
  const [exportButtonDisplay, setExportButtonDisplay] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('legicList');
  const [message, setMessage] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);  // Estado para o número total de entradas

  useEffect(() => {
    checkDb();
  }, []);

  function checkDb() {
    let getLocalStorage = localStorage.getItem('gactiveLegicReadData');
    if (getLocalStorage) {
      setExportButtonDisplay(true);
    }
  }
  function showMessage(tempMessage) {
    setMessage(tempMessage);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function handleConfirm() {
    if (inputLegic.length === 6) {
      handleLegicInput(inputLegic);
      showMessage("Legic inserido com sucesso!");
    } else if (inputBarcode.length === 8) {
      handleBarcodeInput(inputBarcode);
      showMessage("Código de barras inserido com sucesso!");
    } else {
      showMessage("Insira um número válido");
    }
  }
  

  function handleLegicInput(legic) {
    if (excelData !== null) {
      let legicArray = legic.split('');
      legicArray.shift();
      const stringTransform = legicArray.toString();
      const legicCode = stringTransform.replaceAll(',', '');
      let userData = excelData[legicCode];

      if (userData !== undefined && userData !== null) {
        let doubleVerify = legicDB.filter(data => data[2] === legicCode);
        if (doubleVerify.length > 0) {
          alert('Este utilizador já foi registado');
          setInputLegic('');
        } else {
          const legicDBCopy = [...legicDB];
          legicDBCopy.push(userData);
          setLegicDB(legicDBCopy);
          setRegisteredLegicData(true);
          localStorage.setItem('gactiveLegicReadData', JSON.stringify(legicDBCopy));
          let getJsonArray = localStorage.getItem('gactiveImportedData');
          let jsonConvert = JSON.parse(getJsonArray);
          let formatJson = jsonConvert.reduce((acc, current) => {
            return { ...acc, ...{ [current[2]]: current } };
          }, {});
          let getUserToStatus = formatJson[legicCode];
          delete jsonConvert[legicCode];
          getUserToStatus.push('check_circle');
          const legicStatus = [...jsonConvert];
          localStorage.setItem('gactiveImportedData', JSON.stringify(legicStatus));
          checkDb();
          setInputLegic('');
        }
      } else {
        alert('Este Legic não existe');
        setInputLegic('');
      }
    } else {
      alert('Importe um ficheiro');
      setInputLegic('');
    }
  }
///////// codigo de barras
  function handleBarcodeInput(barcode) {
    if (excelData !== null) {
      let userData = excelData[barcode];

      if (userData !== undefined && userData !== null) {
        let doubleVerify = legicDB.filter(data => data[2] === barcode);
        if (doubleVerify.length > 0) {
          alert('Este utilizador já foi registado');
          setInputBarcode('');
        } else {
          const legicDBCopy = [...legicDB];
          legicDBCopy.push(userData);
          setLegicDB(legicDBCopy);
          setRegisteredLegicData(true);
          localStorage.setItem('gactiveLegicReadData', JSON.stringify(legicDBCopy));
          let getJsonArray = localStorage.getItem('gactiveImportedData');
          let jsonConvert = JSON.parse(getJsonArray);
          let formatJson = jsonConvert.reduce((acc, current) => {
            return { ...acc, ...{ [current[2]]: current } };
          }, {});
          let getUserToStatus = formatJson[barcode];
          delete jsonConvert[barcode];
          getUserToStatus.push('check_circle');
          const legicStatus = [...jsonConvert];
          localStorage.setItem('gactiveImportedData', JSON.stringify(legicStatus));
          checkDb();
          setInputBarcode('');
        }
      } else {
        alert('Este código de barras não existe');
        setInputBarcode('');
      }
    } else {
      alert('Importe um ficheiro');
      setInputBarcode('');
    }
  }

  

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

      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      jsonData.shift();

      let defineLegicKey = jsonData.reduce((acc, current) => {
        return { ...acc, ...{ [current[2]]: current } };
      }, {});

      let formatToFilter = jsonData.reduce((acc, current) => {
        return { ...acc, ...{ [current[0]]: current } };
      }, {});

      // Update state with the Excel data
      localStorage.setItem('gactiveImportedData', JSON.stringify(jsonData));
      setExcelData(defineLegicKey);
      setDataToFilter(formatToFilter);
      setExcelTableData(true);
    };

    reader.readAsBinaryString(file);
  };

  const handleDownload = () => {
    let getRegisteredData = localStorage.getItem('gactiveLegicReadData')
    let formatData = JSON.parse(getRegisteredData);
    const worksheet = XLSX.utils.json_to_sheet(formatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Save the Excel file
    XLSX.writeFile(workbook, `${downloadFileName}.xlsx`);
  };

  function renderImportData() {
    const dataToArray = Object.values(excelData);

    if (filterValue.length === 8) {
      let getUser = dataToFilter[filterValue];
      if (getUser !== undefined) {
        return (
          <tr>
            <td>{getUser[0]}</td>
            <td>{getUser[1]}</td>
            <td>{getUser[2]}</td>
            <td>{getUser[3]}</td>
          </tr>
        );
      } else {
        console.log('Não existe');
        return dataToArray.map((data) => {
          return (
            <tr>
              <td>{data[0]}</td>
              <td>{data[1]}</td>
              <td>{data[2]}</td>
              <td>{data[3]}</td>
            </tr>
          );
        });
      }
    } else if (filterValue.length === 6) {
      let getUser = dataToFilter[filterValue];
      if (getUser !== undefined) {
        return (
          <tr>
            <td>{getUser[0]}</td>
            <td>{getUser[1]}</td>
            <td>{getUser[2]}</td>
            <td>{getUser[3]}</td>
          </tr>
        );
      } else {
        console.log('Não existe');
        return dataToArray.map((data) => {
          return (
            <tr>
              <td>{data[0]}</td>
              <td>{data[1]}</td>
              <td>{data[2]}</td>
              <td>{data[3]}</td>
            </tr>
          );
        });
      }
    } else {
      return dataToArray.map((data) => {
        return (
          <tr>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td>{data[2]}</td>
            <td>{data[3]}</td>
          </tr>
        );
      });
    }
  }

  function renderResgisteredLegicData() {
    let getRegisteredData = localStorage.getItem('gactiveLegicReadData');
    if (getRegisteredData) {
      let formatData = JSON.parse(getRegisteredData);
      return formatData.map((data) => {
        return (
          <tr>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td>{data[2]}</td>
            <td>{data[3]}</td>
          </tr>
        );
      });
    } else {
      setRegisteredLegicData(false);
    }
  }

  function resetRegisteredData() {
    localStorage.removeItem('gactiveLegicReadData');
    localStorage.removeItem('gactiveImportedData');
    setLegicDB([]);
    setExportButtonDisplay(false);
    window.location.reload();
  }

  function resetStatusData() {
    localStorage.removeItem('gactiveImportedData');
    setLegicDB([]);
    window.location.reload();
  }

  function renderStatusData() {
    let legicStatus = localStorage.getItem('gactiveImportedData');
    let convertToJson = JSON.parse(legicStatus);
    return convertToJson.map((data) => {
      return (
        <tr>
          <td>{data[0]}</td>
          <td>{data[1]}</td>
          <td>{data[2]}</td>
          <td>{data[3]}</td>
          <td className='td-span'><span class="material-symbols-sharp">{data[4]}</span></td>
        </tr>
      );
    });
  }
////////////////////////////////////////
  function renderSection() {
    switch (viewSelected) {
      case 'logo':
        return <Logoinical />;
      case 'barcode':
        return <Barcode excelData={excelData} legicDB={legicDB} setLegicDB={setLegicDB} showMessage={showMessage} totalEntries={totalEntries}
        />;
      case 'legic':
        return <Legic excelData={excelData} legicDB={legicDB} setLegicDB={setLegicDB} showMessage={showMessage} 
        />;
        case 'status': 
            return <Status />;
            case 'limpar':
              return <Limpar/>
        case 'exportar':
            return <Exportar />;
      case 'importar':
        return <Importar setExcelData={setExcelData} setDataToFilter={setDataToFilter} setExcelTableData={setExcelTableData} showMessage={showMessage} setTotalEntries={setTotalEntries}
        />;
      default:
        return <Logo />;
    }
  }

  ////////////////////////////////////////
  const handleClickMenu = (view) => {
    setViewSelected(view);
  }

  return (
    <div className="App">
      <LeftMenu onClick={handleClickMenu} selected={viewSelected} excelData={excelData} />
      {renderSection()}
      {mainContainer &&
        <section className="main-container">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Introduza o seu Número de Legic
          </p>
          <Legic />
          <input className='legic-number-input' type='number' placeholder='Legic' onChange={(e) => setInputLegic(e.target.value)} value={inputLegic} autoFocus></input>
          <p>
            Introduza o seu Código de Barras
          </p>
          <Barcode />
          <input className='barcode-input' type='number' placeholder='Código de Barras' onChange={(e) => setInputBarcode(e.target.value)} value={inputBarcode}></input>
          <button className='confirm-button' onClick={handleConfirm}>Confirmar</button>
        </section>
      }
      {importFiles &&
        <section className='files-management-container'>
          <p>Importar Ficheiros</p>
          <input type="file" onChange={handleFileUpload} />

          {excelTableData &&
            <section className='import-data-table-section'>
              <p>Filtro:</p>
              <input className='filter-input' placeholder='Número colaborador' onChange={(e) => setFilterValue(e.target.value)}></input>
              <table className='import-data-table'>
                <th className='th-styled'>Numero</th>
                <th className='th-styled'>Nome</th>
                <th className='th-styled'>Legic/Codigo de Barras</th>
                <th className='th-styled'>Centro de custo</th>
                <tbody>
                  {renderImportData()}
                </tbody>
              </table>
            </section>
          }
        </section>
      }

      {exportFiles &&
        <section className='files-management-container'>
          <p>Exportar Ficheiros</p>
          <input className='download-filename' placeholder='NOME DO FICHEIRO' onChange={(e) => setDownloadFileName(e.target.value)} />
          <button className='clean-button' onClick={handleDownload}>Download Excel</button>
          <p>Limpar Leituras</p>
          <button className='clean-button' onClick={resetRegisteredData}>Limpar Lista</button>
          {registeredLegicData &&
            <section className='import-data-table-section'>
              <table className='import-data-table'>
                <th>Numero</th>
                <th>Nome</th>
                <th>Legic/Codigo de Barras</th>
                <th>Centro de custo</th>
                <tbody>
                  {renderResgisteredLegicData()}
                </tbody>
              </table>
            </section>
          }
        </section>
      }
      {statusSection &&
        <section className='files-management-container'>
          <button className='clean-button' onClick={resetStatusData}>Limpar Lista</button>
          {registeredLegicData &&
            <section className='import-data-table-section'>
              <table className='import-data-table'>
                <th>Numero</th>
                <th>Nome</th>
                <th>Legic/Codigo de Barras</th>
                <th>Centro de custo</th>
                <th>Status</th>
                <tbody>
                  {renderStatusData()}
                </tbody>
              </table>
            </section>
          }
        </section>
      }
    </div>
  );
}

export default App;