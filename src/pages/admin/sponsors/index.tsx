import { useState, useEffect } from 'react'
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import { useRequest } from '../../../hooks/use-request';
import { SponsorDoc } from '../../../../server/models/sponsor';
import Switch from 'react-switch';
import Link from 'next/link'
import Button from '../../../components/button';


const AdminSponsorDashboard = () => {
    const [sData, setSData] = useState([]);
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeSActivity(id)} />
    }
    const TableLink = (name: string, id: string) => <Link href={`/admin/sponsors/${id}`}>
        <a className="table__link">{name}</a>
    </Link>
    const { doRequest } = useRequest({
        url: "/api/ugh/sponsor/fetch/all",
        body: {},
        method: "get",
        onSuccess: (data: Array<SponsorDoc>) => {
            setSData(data.map(s => ([
                <div>
                    <div>{TableLink(s.name, s.id)}</div>
                    <div>{s.contact.email}</div>
                    <div>{s.contact.phone}</div>
                </div>,
                <div>
                    <div>{s.packName.toUpperCase()}</div>
                    <div>{s.pack.duration} months</div>
                    <div>&#8377;{s.pack.price}</div>
                </div>,
                s.isProccessed
                    ? SwitchBlade(s.id, s.isActive)
                    : <Link href={`/admin/sponsors/${s.id}`}>
                        <a><Button text={"process".toUpperCase()} /></a>
                    </Link>
            ])))
        }
    })
    useEffect(() => {
        doRequest();
    }, []);
    const changeSActivity = async (id: string) => {
        console.log({ id })
        const { doRequest: updateSRequest } = useRequest({
            url: `/api/ugh/sponsor/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateSRequest();
        await doRequest();
    }
    return <SideLayout title={`sponsors(${sData.length})`}>
        <Table headers={[
            {
                text: "name",
                isResponsive: false
            },
            {
                text: "pack",
                isResponsive: false
            },
            {
                text: "activity",
                isResponsive: false
            }
        ]} data={sData} />
    </SideLayout>
}

export default AdminSponsorDashboard