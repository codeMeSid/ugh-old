import { useState, useEffect } from 'react';
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import Button from "../../components/button";
import Switch from 'react-switch';
import { useRequest } from '../../hooks/use-request';
import { ConsoleDoc } from '../../../server/models/console';

const AdminConsolesDashboard = () => {
    // states
    const [consoleData, setConsoleData] = useState([]);
    // components
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeConsoleActivity(id)} />
    }
    // request
    const { doRequest } = useRequest({
        url: "/api/ugh/console/fetch/all", body: {}, method: "get", onSuccess: (data: Array<ConsoleDoc>) => {
            setConsoleData(data.map(console => ([console.name.toUpperCase(), SwitchBlade(console.id, console.isActive)])));
        }
    });
    // effect
    useEffect(() => {
        doRequest();
    }, [])
    // method
    const changeConsoleActivity = async (id: string) => {
        const { doRequest: updateConsoleRequest } = useRequest({
            url: `/api/ugh/console/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateConsoleRequest();
        await doRequest();
    }
    // render
    return <SideLayout title={`console(${consoleData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add Consoles</h1>
        </div>
        <Table headers={[
            { text: "name", isResponsive: false },
            { text: "activity", isResponsive: false }]} data={consoleData} />
    </SideLayout>
}

export default AdminConsolesDashboard