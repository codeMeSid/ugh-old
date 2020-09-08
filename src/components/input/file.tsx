import { useState } from 'react'
import { fire } from '../../../server/utils/firebase';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { AiOutlineFolderAdd } from 'react-icons/ai';

const FileInput = ({ placeholder, onChange = () => { }, name, value = "" }
    : {
        placeholder: string,
        onChange?: (name: string, value: string) => any,
        name: string,
        value?: string
    }) => {
    const [progress, setProgress] = useState(value.length > 0 ? 100 : 0);
    const [image, setImage] = useState(value);

    const onChangeHandler = async (e) => {
        try {
            const file = e.currentTarget.files[0];
            const url: any = await fire.storage(file, (data) => setProgress(data));
            setImage(url);
            onChange(name, url);
        } catch (error) {
            alert(error.message)
        }
    }
    return <div className="form__group">
        {image && progress === 100 ?
            <div className="form__file__container">
                <img src={image} alt={image} className="form__file__image" />
                <RiDeleteBin2Line className="form__file__remove" onClick={() => {
                    setProgress(0);
                    setImage("");
                }} />
            </div>
            : progress > 0
                ? <progress className="form__file__progress" value={progress} max={100} />
                : <div className="form__group">
                    <label htmlFor={`${name}`} className="form__file__label">
                        <span className="form__file__label__icon"><AiOutlineFolderAdd /></span>
                        <span className="form__file__label__text">upload file</span>
                    </label>
                    <input id={`${name}`} type="file" className="form__file__input" onChange={onChangeHandler} />
                </div>}
        <small className="form__file__placeholder">{placeholder}</small>
    </div>
}

export default FileInput;