import styles from './Input.module.css';

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Input(props: InputProps) {
    const inputClass = props.className 
        ? `${styles.input} ${props.className}`
        : styles.input;

    return (
        <input
            type="text"
            value={props.value}
            onChange={e => props.onChange(e.target.value)}            
            placeholder={props.placeholder}
            className={inputClass}
        />
    );
}