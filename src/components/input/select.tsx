const Select = ({ onSelect, value, options, placeholder }: { onSelect: any, value: any, options: any, placeholder: string }) => {
    return <>
        <select onChange={onSelect} name="role" value={value} className="form__input form__select">
            {options}
        </select>
        <small className="form__input__helper">{placeholder}</small>
    </>
}
export default Select;