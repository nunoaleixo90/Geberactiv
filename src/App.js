import logo from './assets/logo.png';
import * as XLSX from 'xlsx';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [inputLegic, setInputLegic] = useState('');
  const [startView, setStartView] = useState(true);
  const [mainContainer, setMainContainer] = useState(false);
  const [importFiles, setImportFiles] = useState(false);
  const [exportFiles, setExportFiles] = useState(false);
  const [statusSection, setStatusSection] = useState(false);
  const [activeView, setActiveView] = useState('');
  const [fileName, setFileName] = useState('Presenças');
  const [excelData, setExcelData] = useState(null);
  const [dataToFilter, setDataToFilter] = useState(null);
  const [excelTableData, setExcelTableData] = useState(null);
  const [legicDB, setLegicDB] = useState([]);
  const [registeredLegicData, setRegisteredLegicData] = useState(true);
  const [exportButtonDisplay, setExportButtonDisplay] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('legicList');

  useEffect(()=>{
    checkDb();
  },[])

  function checkDb(){
    let getLocalStorage = localStorage.getItem('gactiveLegicReadData');
    if (getLocalStorage){
      setExportButtonDisplay(true);
    } 
  }

  useEffect(()=>{
    if(inputLegic.length === 6){
      if(excelData !== null){
        let legicArray = inputLegic.split('');
        legicArray.shift();
        const stringTransform = legicArray.toString();
        const legic = stringTransform.replaceAll(',', '');
        let userData = excelData[legic];

        if(userData !== undefined && userData !== null){
          let doubleVerify = legicDB.filter(data => data[2] === legic)
          if(doubleVerify !== undefined){
            if (doubleVerify.length > 0){
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
              let formatJson = jsonConvert.reduce((acc,current) => {
                return {...acc, ...{[current[2]]:current}}
              },{})
              let getUserToStatus = formatJson[legic]
              delete jsonConvert[legic];
              getUserToStatus.push('OK');
              const legicStatus = [...jsonConvert];
              localStorage.setItem('gactiveImportedData', JSON.stringify(legicStatus))
              checkDb();
              setInputLegic('');
            }
          }
        } else {
          alert('Este Legic não existe')
          setInputLegic('');
        }
      } else {
        alert('importe um ficheiro')
        setInputLegic('');
      }
    }
  },[inputLegic]);

  function handleLegicView(){
    setStartView(false);
    setMainContainer(true);
    setActiveView('main');
    if(importFiles){
      setImportFiles(!importFiles);
    };
    if(exportFiles){
      setExportFiles(!exportFiles);
    };
    if(statusSection){
      setStatusSection(!statusSection);
    }
  };

  function handleImportView(){
    setStartView(false);
    setImportFiles(true);
    setActiveView('import');

    if(exportFiles){
      setExportFiles(!exportFiles);
    };
    if(mainContainer){
      setMainContainer(!mainContainer);
    };
    if(statusSection){
      setStatusSection(!statusSection);
    }
  };

  function handleExportView(){
    setStartView(false);
    setExportFiles(true);
    setActiveView('export');
    if(mainContainer){
      setMainContainer(!mainContainer);
    };
    if(importFiles){
      setImportFiles(!importFiles);
    };
    if(statusSection){
      setStatusSection(!statusSection);
    }
  };

  function handleStatusView(){
    setStartView(false);
    setStatusSection(true);
    setActiveView('status');
    if(mainContainer){
      setMainContainer(!mainContainer);
    };
    if(importFiles){
      setImportFiles(!importFiles);
    };
    if(exportFiles){
      setExportFiles(!exportFiles);
    }
  };

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

      let defineLegicKey = jsonData.reduce((acc,current) => {
        return {...acc, ...{[current[2]]:current}}
      },{})

      let formatToFilter = jsonData.reduce((acc,current) => {
        return {...acc, ...{[current[0]]:current}}
      },{})

      // Update state with the Excel data
      localStorage.setItem('gactiveImportedData', JSON.stringify(jsonData))
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

  function renderImportData(){
    const dataToArray = Object.values(excelData);

    if(filterValue.length === 8){
      let getUser = dataToFilter[filterValue];
      if(getUser !== undefined){
        return (
          <tr>
            <td>{getUser[0]}</td>
            <td>{getUser[1]}</td>
            <td>{getUser[2]}</td>
            <td>{getUser[3]}</td>
          </tr>
        )
      } else {
        console.log('Não existe')
        return dataToArray.map((data)=>{
          return(
            <tr>
              <td>{data[0]}</td>
              <td>{data[1]}</td>
              <td>{data[2]}</td>
              <td>{data[3]}</td>
            </tr>
          )
        })
      }     
      
    } else {
      return dataToArray.map((data)=>{
        return(
          <tr>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td>{data[2]}</td>
            <td>{data[3]}</td>
          </tr>
        )
      })
    }
    
    
  }

  function renderResgisteredLegicData(){
    let getRegisteredData = localStorage.getItem('gactiveLegicReadData')
    if(getRegisteredData){
      let formatData = JSON.parse(getRegisteredData);
      return formatData.map((data)=>{
        return(
          <tr>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td>{data[2]}</td>
            <td>{data[3]}</td>
          </tr>
        )
      })
    } else {
      setRegisteredLegicData(false)
    }
  }

  function resetRegisteredData(){
    localStorage.removeItem('gactiveLegicReadData');
    localStorage.removeItem('gactiveImportedData');
    setLegicDB([]);
    setExportButtonDisplay(false)
    window.location.reload();
  }

  function resetStatusData(){
    localStorage.removeItem('gactiveImportedData');
    setLegicDB([]);
    window.location.reload();
  }

  function renderStatusData(){
    let legicStatus = localStorage.getItem('gactiveImportedData');
    let convertToJson = JSON.parse(legicStatus);
    return convertToJson.map((data) => {
      return(
        <tr>
          <td>{data[0]}</td>
          <td>{data[1]}</td>
          <td>{data[2]}</td>
          <td>{data[3]}</td>
          <td>{data[4]}</td>
        </tr>
      )
    })
    
  }

  return (
    <div className="App">
      <section className='menu-bar'>
        <h2 onClick={handleLegicView} className={`${activeView === 'main' && 'active'}`}>Registo Legic</h2>
        <h2 onClick={handleImportView} className={`${activeView === 'import' && 'active'}`}>Importar</h2>
        {exportButtonDisplay &&
          <>
          <h2 onClick={handleExportView} className={`${activeView === 'export' && 'active'}`}>Exportar</h2>
          <h2 onClick={handleStatusView} className={`${activeView === 'status' && 'active'}`}>Status</h2>
          </>
        }
        
      </section>
      {startView &&
        <section className="main-container">
          <img src={logo} className="App-logo" alt="logo" />
        </section>
      }
      {mainContainer &&
        <section className="main-container">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Introduza o seu Número de Legic
          </p>
          <input className='legic-number-input' type='number' placeholder='Legic' onChange={(e) => setInputLegic(e.target.value)} value={inputLegic} autoFocus></input>
        </section>
      }
      {importFiles &&
        <section className='files-management-container'>
          <p>Importar Ficheiros</p>
          <input type="file" onChange={handleFileUpload} />

          {excelTableData &&
            <section className='import-data-table-section'>
              <p>Filtro:</p>
              <input className='filter-input' placeholder='Número colaborador' onChange={(e)=>setFilterValue(e.target.value)}></input>
              <table className='import-data-table'>
                <th className='th-styled'>Numero</th>
                <th className='th-styled'>Nome</th>
                <th className='th-styled'>Legic</th>
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
          <input className='download-filename' placeholder='NOME DO FICHEIRO' onChange={(e)=> setDownloadFileName(e.target.value)}/>
          <button className='clean-button' onClick={handleDownload}>Download Excel</button>
          <p>Limpar Leituras</p>
          <button className='clean-button' onClick={resetRegisteredData}>Limpar Lista</button>
          {registeredLegicData &&
            <section className='import-data-table-section'>
              <table className='import-data-table'>
                <th>Numero</th>
                <th>Nome</th>
                <th>Legic</th>
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
                <th>Legic</th>
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
