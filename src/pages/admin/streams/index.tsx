import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import Button from "../../../components/button/main";
import SocialButton from "../../../components/button/social";
import { useRequest } from '../../../hooks/use-request';
import { StreamDoc } from '../../../../server/models/stream';
import Link from 'next/link';
import Switch from 'react-switch';

const AdminStreamDashboard = () => {
    // states
    const [streamData, setStreamData] = useState([]);
    // components
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeStreamActivity(id)} />
    }
    const TableLink = (name: string, id: string) => <Link href={`/admin/streams/${id}`}>
        <a className="table__link">{name}</a>
    </Link>
    // request
    const { doRequest } = useRequest({
        url: "/api/ugh/stream/fetch/all",
        body: {}, method: "get",
        onSuccess: (data: Array<StreamDoc>) => {
            setStreamData(data.map(stream => ([<>
                <div>{TableLink(stream.name.toUpperCase(), stream.id)}</div>
                <div>({stream.game.toUpperCase()})</div>
            </>,
            <a href={stream.href} >
                <SocialButton type={stream.social} />
            </a>,
            SwitchBlade(stream.id, stream.isActive)
            ])));
        }
    });
    // effect
    useEffect(() => {
        doRequest();
    }, [])
    // method
    const changeStreamActivity = async (id: string) => {
        const { doRequest: updateStreamRequest } = useRequest({
            url: `/api/ugh/stream/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateStreamRequest();
        await doRequest();
    }
    // render
    return <SideLayout title={`streams(${streamData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add stream</h1>
        </div>
        <Table headers={[
            {
                text: "name",
                isResponsive: false
            },
            {
                text: "social-link",
                isResponsive: false
            },
            {
                text: "activity",
                isResponsive: false
            }
        ]} data={streamData} />
    </SideLayout>
}

export default AdminStreamDashboard