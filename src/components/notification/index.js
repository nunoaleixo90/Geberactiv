import { useEffect } from "react";
import "../notification/index.css";

export default function Notification({ type, message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 9000); 

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <div className="notification-body">
                <p>{message}</p>
            </div>
            <button onClick={onClose} className="notification-close">X</button>
        </div>
    );
}
