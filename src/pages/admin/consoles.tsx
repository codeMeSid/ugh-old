import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import Button from "../../components/button"

const AdminConsolesDashboard = () => {
    return <SideLayout title="consoles">
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add Consoles</h1>
        </div>
        <Table headers={['value', 'cost', 'is active']} data={[]} />
    </SideLayout>
}

export default AdminConsolesDashboard