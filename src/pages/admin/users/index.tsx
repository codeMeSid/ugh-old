import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import { useRequest } from '../../../hooks/use-request';
import { UserDoc } from '../../../../server/models/user';
import Switch from "react-switch";
import Link from 'next/link';

const AdminUserDashboard = () => {
    // state
    const [userData, setUserData] = useState([]);
    // components
    const SwitchBlade = (id: string, activity: string) =>
        activity === 'inactive'
            ? <div style={{ color: "red", textTransform: "uppercase" }}>inactive</div>
            : <Switch onChange={() => changeUserActivity(id)} checked={activity === 'active'} />;
    const TableLink = (id: string) => <Link href={`/admin/users/${id}`}>
        <a className="table__link">{id}</a>
    </Link>
    // requests
    const { doRequest } = useRequest({
        url: "/api/ugh/user/fetch/all",
        body: {},
        method: "get",
        onSuccess: (data: Array<UserDoc>) => {
            setUserData(data.map((user) => {
                return [TableLink(user.ughId), user.name, user.email, user.wallet.coins, SwitchBlade(user.id, user.activity)]
            }))
        }
    });
    // effects
    useEffect(() => {
        doRequest();
    }, []);
    // methods
    const changeUserActivity = async (id: string) => {
        const { doRequest: updateUserRequest } = useRequest({
            url: `/api/ugh/user/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateUserRequest();
        await doRequest();
    }
    // render
    return <SideLayout title={`users(${userData.length})`}>
        <Table headers={[{ text: 'ughId', isResponsive: false },
        { text: 'name', isResponsive: true },
        { text: 'email', isResponsive: true },
        { text: 'coins', isResponsive: false },
        { text: 'status', isResponsive: false }]}
            data={userData} />
    </SideLayout>
}

export default AdminUserDashboard