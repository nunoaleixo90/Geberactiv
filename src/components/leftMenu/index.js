export default function LeftMenu({ onClick, selected, excelData }) {
    return (
        <section className='menu-bar'>
            <h2 onClick={() => onClick('legic')} className={`${selected === 'legic' && 'active'}`}>Legic</h2>
            <h2 onClick={() => onClick('barcode')} className={`${selected === 'barcode' && 'active'}`}>Código de Barras</h2>
            <h2 onClick={() => onClick('importar')} className={`${selected === 'importar' && 'active'}`}>Importar</h2>
            <h2 onClick={() => onClick('limpar')} className={`${selected === 'limpar' && 'active'}`}>Limpar</h2>
            
            {}
            {excelData && (
                <>
                    <h2 onClick={() => onClick('exportar')} className={`${selected === 'exportar' && 'active'}`}>Exportar</h2>
                    <h2 onClick={() => onClick('status')} className={`${selected === 'status' && 'active'}`}>Status</h2>
                </>
            )}
        </section>
    );
}
