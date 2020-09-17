import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { GalleryDoc } from "../../server/models/gallery";
import GalleryMagnify from "../components/gallery-magnify";
import { useState } from "react";

const Gallery = ({ images, errors }: { images: Array<GalleryDoc>, errors: any }) => {
    const [image, setImage] = useState("");
    return <>
        <MainLayout messages={errors}>
            <section className="gallery">
                <div className="gallery__title">See our events in pictures</div>
                <div className="gallery__subtitle">and stay updated with atmosphere</div>
                <div className="gallery__display">
                    {
                        images.map(image => {
                            return <div key={Math.random()} onClick={() => setImage(image.imageUrl)} className="gallery__container">
                                <div className="gallery__name">{image.name}</div>
                                <img
                                    className="gallery__img"
                                    src={image.imageUrl}
                                    alt={image.name}
                                />
                            </div>
                        })
                    }
                </div>
            </section>
        </MainLayout>
        <GalleryMagnify onClick={() => setImage("")} image={image} />
    </>
}

Gallery.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx,
        {
            url: "/api/ugh/gallery/fetch/active",
            body: {},
            method: "get"
        });
    return {
        images: data || [],
        errors: errors || []
    }
}

export default Gallery;