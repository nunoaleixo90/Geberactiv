import { useState, useEffect } from 'react';

export default function Status() {
    const [statusData, setStatusData] = useState([]);
    const [legicCount, setLegicCount] = useState(0); 
    const [barcodeCount, setBarcodeCount] = useState(0);  

    useEffect(() => {
        loadStatusData();
        loadLegicCount();   
        loadBarcodeCount(); 
    }, []);

    function loadStatusData() {
        let legicStatus = localStorage.getItem('gactiveImportedData');
        if (legicStatus) {
            let parsedData = JSON.parse(legicStatus);
            setStatusData(parsedData);
        }
    }

    function loadLegicCount() {
        let count = localStorage.getItem('legicCount') || 0;
        setLegicCount(parseInt(count));
    }

    function loadBarcodeCount() {
        let count = localStorage.getItem('barcodeCount') || 0;
        setBarcodeCount(parseInt(count));
    }

    function resetStatusData() {
        localStorage.removeItem('gactiveImportedData');
        localStorage.removeItem('legicCount'); 
        localStorage.removeItem('barcodeCount'); 
        setStatusData([]);
        setLegicCount(0);
        setBarcodeCount(0);
        window.location.reload();
    }

    return (
        <section className='files-management-container'>
            <h2>Status das Leituras</h2>

            {}
            <p>Total de Legics registados: <strong>{legicCount}</strong></p>

            {}
            <p>Total de Códigos de Barras registados: <strong>{barcodeCount}</strong></p>

            <button className='clean-button' onClick={resetStatusData}>Limpar Lista</button>

            {statusData.length > 0 ? (
                <section className='import-data-table-section'>
                    <table className='import-data-table'>
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Nome</th>
                                <th>Legic/Código de Barras</th>
                                <th>Centro de Custo</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data[0]}</td>
                                    <td>{data[1]}</td>
                                    <td>{data[2]}</td>
                                    <td>{data[3]}</td>
                                    <td className='td-span'>
                                        <span className="material-symbols-sharp">{data[4]}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ) : (
                <p>Nenhum status disponível.</p>
            )}
        </section>
    );
}
