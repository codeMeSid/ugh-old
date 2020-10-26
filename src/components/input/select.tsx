



const Select = ({ onSelect, name, value, options, placeholder, isWhite = false }: { onSelect?: any, value?: any, options?: any, name?: string, placeholder?: string, isWhite?: boolean }) => {
    return <div style={{ display: "flex", flexDirection: "column" }}>
        <select onChange={onSelect} name={name} value={value} className={`form__input form__select ${isWhite ? "white" : ""}`}>
            {options}
        </select>
        <small className="form__input__helper">{placeholder}</small>
    </div>
}
export default Select;