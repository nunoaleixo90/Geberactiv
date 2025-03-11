import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';

export default function Exportar() {
    const [downloadFileName, setDownloadFileName] = useState('legicList');
    const [registeredLegicData, setRegisteredLegicData] = useState([]);

    useEffect(() => {
        const getRegisteredData = localStorage.getItem('gactiveLegicReadData');
        if (getRegisteredData) {
            setRegisteredLegicData(JSON.parse(getRegisteredData));
        }
    }, []);

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(registeredLegicData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, `${downloadFileName}.xlsx`);
    };

    const resetRegisteredData = () => {
        localStorage.removeItem('gactiveLegicReadData');
        setRegisteredLegicData([]);
        window.location.reload();
    };

    return (
        <section className='files-management-container'>
            <p>Exportar Ficheiros</p>
            <input 
                className='download-filename' 
                placeholder='NOME DO FICHEIRO' 
                onChange={(e) => setDownloadFileName(e.target.value)} 
            />
            <button className='clean-button' onClick={handleDownload}>Download Excel</button>
            <p>Limpar Leituras</p>
            <button className='clean-button' onClick={resetRegisteredData}>Limpar Lista</button>
            {registeredLegicData.length > 0 && (
                <section className='import-data-table-section'>
                    <table className='import-data-table'>
                        <thead>
                            <tr>
                                <th>Numero</th>
                                <th>Nome</th>
                                <th>Legic/Codigo de Barras</th>
                                <th>Centro de custo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registeredLegicData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data[0]}</td>
                                    <td>{data[1]}</td>
                                    <td>{data[2]}</td>
                                    <td>{data[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </section>
    );
}
