import styles from './Button.module.css';

interface ButtonProps {
    children?: string;
    disabled?: boolean;
    icon?: string;
    onClick: () => void;
}

export function Button(props: ButtonProps) {
    return (
        <button 
            className={styles.button}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.icon && <img src={props.icon} className={styles.icon} />}
            {props.children}
        </button>
    );
}