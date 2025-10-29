import styles from './Button.module.css';

interface ButtonProps {
    children?: string;
    disabled?: boolean;
    dropdown?: boolean;
    icon?: string;
    onClick: () => void;
    className?: string;
}

export function Button(props: ButtonProps) {
    const buttonClass = props.className 
        ? `${styles.button} ${props.className}`
        : styles.button;

    return (
        <button 
            className={buttonClass}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.icon && <img src={props.icon} className={styles.icon} />}
            {props.children}
        </button>
    );
}