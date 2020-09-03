import { useState, useEffect } from 'react';
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import Button from "../../components/button/main";
import Switch from 'react-switch';
import { useRequest } from '../../hooks/use-request';
import { ConsoleDoc } from '../../../server/models/console';
import DialogButton from '../../components/button/dialog';
import Input from '../../components/input/input';

const AdminConsolesDashboard = () => {
    // states
    const [consoleData, setConsoleData] = useState([]);
    const [name, setName] = useState("");
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
    const { doRequest: addConsoleRequest } = useRequest({
        url: "/api/ugh/console/add",
        body: { name },
        method: "post",
        onSuccess: doRequest
    })
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
        <DialogButton title="add console" onAction={addConsoleRequest}>
            <Input name="name" placeholder="name" onChange={(_, val) => setName(val)} value={name} />
        </DialogButton>
        <Table headers={[
            { text: "name", isResponsive: false },
            { text: "activity", isResponsive: false }]} data={consoleData} />
    </SideLayout>
}

export default AdminConsolesDashboard