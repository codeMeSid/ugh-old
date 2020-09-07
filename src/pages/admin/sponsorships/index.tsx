import { useState, useEffect } from 'react'
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import { useRequest } from '../../../hooks/use-request'
import { SponsorshipDoc } from '../../../../server/models/sponsorship'
import Switch from 'react-switch';
import Link from 'next/link'
import Button from '../../../components/button/main'

const AdminSponsorshipDashboard = () => {
    const [sData, setSData] = useState([]);
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeSActivity(id)} />
    }
    const TableLink = (name: string, id: string) => <Link href={`/admin/sponsorships/${id}`}>
        <a className="table__link">{name}</a>
    </Link>
    const { doRequest } = useRequest({
        url: "/api/ugh/sponsorship/fetch/all",
        body: {},
        method: "get",
        onSuccess: (data: Array<SponsorshipDoc>) => {
            setSData(data.map(s => ([
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ height: 50, width: 50, backgroundColor: s.color, marginRight: 10 }} />
                    <div>{TableLink(s.name.toUpperCase(), s.id)}</div>
                </div>,
                <ul>
                    {s.packs.map(pack => <ol key={Math.random() * 9} style={{ marginTop: 5 }}>{pack.duration} Months - &#8377;{pack.price}</ol>)}
                </ul>,
                SwitchBlade(s.id, s.isActive)
            ])))
        }
    });
    useEffect(() => {
        doRequest();
    }, [])
    const changeSActivity = async (id: string) => {
        const { doRequest: updateSRequest } = useRequest({
            url: `/api/ugh/sponsorship/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateSRequest();
        await doRequest();
    }
   
    return <SideLayout title={`packs(${sData.length})`}>
        <Link href="/admin/sponsorships/add">
            <a style={{ marginBottom: 20 }}>
                <Button text="Add Pack" />
            </a>
        </Link>
        <Table headers={[
            { text: "name", isResponsive: false },
            { text: "packs", isResponsive: false },
            { text: "activity", isResponsive: false }
        ]} data={sData} />
    </SideLayout>
}

export default AdminSponsorshipDashboard