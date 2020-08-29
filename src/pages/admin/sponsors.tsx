import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import Button from "../../components/button"

const AdminSponsorDashboard = () => {
    return <SideLayout title="sponsors">
        <Table headers={['value', 'cost', 'is active']} data={[]} />
    </SideLayout>
}

export default AdminSponsorDashboard