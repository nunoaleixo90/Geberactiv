import { useState, useEffect } from 'react';
import '../barcode/index.css';
import Notification from '../notification/index.js'; 
import { Logo } from '../logo/index.js';
import { Gauge } from '@mui/x-charts/Gauge';
import { LinearProgress } from "@mui/material";

function Barcode({ excelData, legicDB, setLegicDB, totalEntries }) {
  const [inputBarcode, setInputBarcode] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '', show: false });
  const [barcodeCount, setBarcodeCount] = useState(() => parseInt(localStorage.getItem('barcodeCount')) || 0);
  const [totalExpectedBarcodes, setTotalExpectedBarcodes] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTotalExpectedBarcodes(totalEntries || 0);
  }, [totalEntries]);

  useEffect(() => {
    if (totalExpectedBarcodes > 0) {
      setProgress((barcodeCount / totalExpectedBarcodes) * 100);
    } else {
      setProgress(0);
    }
  }, [barcodeCount, totalExpectedBarcodes]);

  function showNotification(message, type = 'success') {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }

  function handleBarcodeInput(barcode) {
    if (!excelData) {
      showNotification('Importe um ficheiro primeiro!', 'error');
      setInputBarcode('');
      return;
    }

    let userData = excelData[barcode];
    if (!userData) {
      showNotification('Este código de barras não existe!', 'error');
      setInputBarcode('');
      return;
    }

    let doubleVerify = legicDB.some(data => String(data[2]) === String(barcode));
    if (doubleVerify) {
      showNotification('Este código de barras já foi registado!', 'warning');
      setInputBarcode('');
      return;
    }

    const legicDBCopy = [...legicDB, userData];
    setLegicDB(legicDBCopy);
    localStorage.setItem('gactiveLegicReadData', JSON.stringify(legicDBCopy));

    let newBarcodeCount = barcodeCount + 1;
    setBarcodeCount(newBarcodeCount);
    localStorage.setItem('barcodeCount', newBarcodeCount);

    let getJsonArray = localStorage.getItem('gactiveImportedData');
    let jsonConvert = JSON.parse(getJsonArray) || {};

    let formatJson = Object.values(jsonConvert).reduce((acc, current) => {
      return { ...acc, [current[2]]: current };
    }, {});

    let getUserToStatus = formatJson[barcode];
    if (getUserToStatus) {
      getUserToStatus.push('check_circle'); 
    }

    localStorage.setItem('gactiveImportedData', JSON.stringify(jsonConvert));

    const personName = userData[1]; 
    showNotification(`Código de barras registado com sucesso para ${personName}!`, 'success');
    setInputBarcode('');
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setInputBarcode(value);

    if (value.length === 8) {
      handleBarcodeInput(value);
    }
  }

  return (
    <div className="main-container">
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: '', show: false })}
        />
      )}
  
      <div className="logo">
        <Logo />
      </div>
  
      <div className="barcode-container">
        <p>Introduza o seu Código de Barras</p>
        <p>
          Total de Códigos de Barras registados: <strong>{barcodeCount}</strong>
        </p>
        <input 
          className="barcode-input" 
          type="number" 
          placeholder="Código de Barras" 
          onChange={handleInputChange}
          value={inputBarcode}
        />

        <div className="progress-container" style={{ width: "100%", textAlign: "center" }}>
          <Gauge 
            value={progress} 
            min={0}
            max={100}
            startAngle={-90} 
            endAngle={90} 
            size={200} 
            valueText={`${barcodeCount} / ${totalExpectedBarcodes}`} 
            sx={{
              '& .MuiGauge-valueArc': {
                stroke: "#1976D2", 
              },
              '& .MuiGauge-referenceArc': {
                stroke: "#E0E0E0", 
              },
              '& .MuiGauge-valueText': {
                fontSize: 20,
                fontWeight: 'bold',
              },
            }}
          />

          <div style={{ width: "80%", margin: "20px auto" }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
          </div>

          <p>{Math.round(progress)}% concluído</p>
        </div>
      </div>
    </div>
  );
}

export default Barcode;
