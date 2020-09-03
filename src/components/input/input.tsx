const Input = ({ type = "text", placeholder, onChange = () => { }, noHelp = false, name, value }
    : {
        type?: string,
        placeholder: string,
        onChange: (name: string, value: string) => any,
        noHelp?: boolean,
        name: string,
        value?: any
    }) => {

    const formatValue = (val: any) => {
        switch (type) {
            case 'date':
                const valDate = new Date(val);
                const day = valDate.getDate() < 10 ? '0' + valDate.getDate() : valDate.getDate();
                const month = valDate.getMonth() < 10 ? '0' + valDate.getMonth() : valDate.getMonth();
                const year = valDate.getFullYear();
                return `${year}-${month}-${day}`
            default: return val
        }
    }


    return <div className="form__group">
        <input name={name} value={formatValue(value)} type={type} className="form__input" placeholder={placeholder} onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.value)} autoComplete="off" />
        {!noHelp && <small className="form__input__helper">{placeholder}</small>}
    </div>
}

export default Input;