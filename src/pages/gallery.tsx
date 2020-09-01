import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { GalleryDoc } from "../../server/models/gallery";

const Gallery = ({ currentUser, images }: { currentUser: any, images: Array<GalleryDoc> }) => {
    return <MainLayout currentUser={currentUser}>
        <div className="gallery">
            <div className="gallery__title">See our events in pictures</div>
            <div className="gallery__subtitle">and stay updated with atmosphere</div>

            <div className="gallery__display">
                {
                    images.map(image => {
                        return <div key={image.imageUrl} className="gallery__container">
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
        </div>
    </MainLayout>
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
        errors
    }
}

export default Gallery;