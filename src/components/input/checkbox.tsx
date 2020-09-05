import Switch from 'react-switch';

const CheckInput = ({ label, value, onChange }: { label: string, value: boolean, onChange: (value: boolean) => any }) => {
    return <div className="form__checkbox">
        <div className="form__checkbox__input">
            <Switch checked={value} onChange={onChange} />
        </div>
        <div className="form__checkbox__label">{label}</div>
    </div>
}

export default CheckInput;