import { useState, useEffect } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import Button from "../../components/button"

const AdminCoinsDashboard = () => {
    const [coinData, setCoinData] = useState([]);
    return <SideLayout title="coins">
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add Coins</h1>
        </div>
        <Table headers={[
            { text: "value", isResponsive: false },
            { text: "cost", isResponsive: false },
            { text: "activity", isResponsive: false }]}
            data={coinData} />
    </SideLayout>
}

export default AdminCoinsDashboard