import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import Button from "../../components/button"

const AdminGalleryDashboard = () => {
    return <SideLayout title="gallery">
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add Gallery</h1>
        </div>
        <Table headers={['value', 'cost', 'is active']} data={[]} />
    </SideLayout>
}

export default AdminGalleryDashboard