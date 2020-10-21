import { useState } from 'react'
import { fire } from '../../../server/utils/firebase';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { AiOutlineFolderAdd } from 'react-icons/ai';

const FileInput = ({ placeholder, onChange = () => { }, name, value = "", showImage }
    : {
        placeholder: string,
        onChange?: (name: string, value: string) => any,
        name: string,
        value?: string,
        showImage?: boolean
    }) => {
    const [progress, setProgress] = useState(value.length > 0 ? 100 : 0);
    const [image, setImage] = useState(value);

    const onChangeHandler = async (e: any) => {
        try {
            const file = e.currentTarget.files[0];
            const bytesIn1Mb = 1000000;
            const fileSize = file.size / bytesIn1Mb;
            const fileType = file.type.split("/")[1];
            if (fileSize > 5) {
                alert("file Size should be less than 5mb");
                return;
            }
            const acceptedFileFormats = ["png", "jpg", "jpeg"];
            const isValidFile = acceptedFileFormats.indexOf(fileType) > -1;
            if (!isValidFile) {
                alert("Only png,jpg and jpeg file formats allowed");
                return;
            }
            const url: any = await fire.storage(file, (data) => setProgress(data));
            onChange(name, url);
            if (showImage) {
                setImage(url);
                return
            }
            setProgress(0);
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
                    onChange(name, "")
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