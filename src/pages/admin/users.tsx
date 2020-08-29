import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"

const AdminUserDashboard = () => {
    return <SideLayout title="users">
        <Table headers={['value', 'cost', 'is active']} data={[]} />
    </SideLayout>
}

export default AdminUserDashboard