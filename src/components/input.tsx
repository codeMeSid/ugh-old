const Input = ({ type = "text", placeholder, onChange = () => { }, noHelp = false, name, ...props }
    : {
        type?: string,
        placeholder: string,
        onChange: (name: string, value: string) => any,
        noHelp?: boolean,
        name: string
    }) => <div className="form__group">
        <input name={name} type={type} className="form__input" placeholder={placeholder} onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.value)} {...props} autoComplete="off" />
        {!noHelp && <small className="form__input__helper">{placeholder}</small>}
    </div>

export default Input;