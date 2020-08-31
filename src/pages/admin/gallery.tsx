import { useState, useEffect } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import Button from "../../components/button/main"
import { useRequest } from '../../hooks/use-request'
import { GalleryDoc } from '../../../server/models/gallery'
import Switch from 'react-switch';

const AdminGalleryDashboard = () => {
    // states
    const [galleryData, setGalleryData] = useState([]);
    // components
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeGalleryActivity(id)} />
    }
    // requests
    const { doRequest } = useRequest({
        url: "/api/ugh/gallery/fetch/all", body: {}, method: "get", onSuccess: (data: Array<GalleryDoc>) => {
            setGalleryData(data.map(gallery => ([gallery.name.toUpperCase(), <a href={gallery.imageUrl} target="_blank"><img className="gallery__image" src={gallery.imageUrl} /></a>, SwitchBlade(gallery.id, gallery.isActive)])))
        }
    });
    // effect
    useEffect(() => {
        doRequest();
    }, []);
    // method
    const changeGalleryActivity = async (id: string) => {
        const { doRequest: updateGalleryRequest } = useRequest({
            url: `/api/ugh/gallery/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateGalleryRequest();
        await doRequest();
    }
    // render
    return <SideLayout title={`gallery(${galleryData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add Gallery</h1>
        </div>
        <Table headers={[
            { text: "name", isResponsive: true },
            { text: "image", isResponsive: false },
            { text: "activity", isResponsive: false }]} data={galleryData} />
    </SideLayout>
}

export default AdminGalleryDashboard