const Option = ({ display, value, style }: { display: any, value: any, style?: Object }) => {
    return <option className="form__select__option" style={style} value={value}>{display}</option>
}

export default Option;