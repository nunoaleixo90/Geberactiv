import { useState } from 'react';
import '../limpar/index.css'
export default function Limpar() {
    const [isCleaning, setIsCleaning] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false); 

    const limparDados = () => {
        setIsCleaning(true);
        localStorage.removeItem('gactiveImportedData');
        localStorage.removeItem('legicCount');
        localStorage.removeItem('barcodeCount');
        localStorage.removeItem('gactiveLegicReadData');
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const handleConfirm = () => {
        setShowConfirmation(true); 
    };

    const handleCancel = () => {
        setShowConfirmation(false); 
    };

    return (
        <section className="limpar-container">
            {}
            <p className="clean-text">Se quiser limpar os dados, limpe aqui:</p>
            
            {}
            {showConfirmation ? (
                <div className="confirmation-message">
                    <p>Deseja realmente limpar todos os dados?</p>
                    <button className="confirm-button" onClick={limparDados}>Sim, Limpar</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
                </div>
            ) : (
                <button className="clean-button" onClick={handleConfirm}>
                    Limpar Tudo
                </button>
            )}
        </section>
    );
}
