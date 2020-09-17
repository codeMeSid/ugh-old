import React from "react";
import { MdClose } from 'react-icons/md';

interface GProps {
    image?: string,
    onClick: any
}

class GalleryMagnify extends React.Component<GProps> {
    state = {
        image: this.props.image
    }

    componentDidUpdate(prevProps) {
        const { image: pImage } = prevProps;
        const { image } = this.props;
        if (image !== pImage) this.setState({ image });
    }

    render() {
        const { onClick } = this.props;
        const { image } = this.state;
        return image && (<div className="gallery__magnify">
            <div style={{ backgroundImage: `url(${image})` }} className="gallery__magnify__container">
                <MdClose onClick={onClick} className="gallery__magnify__container__close" />
            </div>
        </div>);
    }
}

export default GalleryMagnify;