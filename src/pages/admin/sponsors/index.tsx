import { useState, useEffect } from 'react'
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import { useRequest } from '../../../hooks/use-request';
import { SponsorDoc } from '../../../../server/models/sponsor';
import Switch from 'react-switch';
import Link from 'next/link'
import Button from '../../../components/button/main';


const AdminSponsorDashboard = () => {
    const [sData, setSData] = useState([]);
    const [messages, setMessages] = useState([]);
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
                    <div style={{ backgroundColor: s.sponsorPack.color }}>{s.sponsorPack.name.toUpperCase()}</div>
                    <div>{s.sponsorPack.pack.duration} months</div>
                    <div>&#8377;{s.sponsorPack.pack.price}</div>
                </div>,
                s.isProccessed
                    ? s.sponsorId
                        ? <Link href={`/admin/sponsors/${s.id}`}>
                            <a style={{ color: "orange" }}>Not updated</a>
                        </Link>
                        : SwitchBlade(s.id, s.isActive)
                    : <Link href={`/admin/sponsors/${s.id}`}>
                        <a style={{ color: "blue" }}>Process</a>
                    </Link>
            ])))
        },
        onError: (errors) => setMessages(errors)
    })
    useEffect(() => {
        doRequest();
    }, []);
    const changeSActivity = async (id: string) => {
        console.log({ id })
        const { doRequest: updateSRequest } = useRequest({
            url: `/api/ugh/sponsor/update/activity/${id}`,
            method: "put",
            body: {},
            onSuccess: () => setMessages([{ message: "Successfully updated", type: "success" }]),
            onError: (errors) => setMessages(errors)
        });
        await updateSRequest();
        await doRequest();
    }
    return <SideLayout messages={messages} title={`sponsors(${sData.length})`}>
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