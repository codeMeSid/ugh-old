import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import Button from "../../../components/button/main"
import { useRequest } from '../../../hooks/use-request';
import { TransactionDoc } from '../../../../server/models/transaction';
import Link from 'next/link';


const AdminTransactionDashboard = () => {
    const [tData, setTData] = useState([]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();
        const hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
        const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
        const timeHandle = d.getHours() < 12 ? "am" : "pm";
        return `${day}/${month}/${year} ${hour}:${minutes}${timeHandle}`;
    }

    const TableLink = (name: string, id: string) => <Link href={`/admin/transactions/${id}`}>
        <a className="table__link">{name}</a>
    </Link>
    const { doRequest } = useRequest({
        url: "/api/ugh/transaction/fetch/all",
        body: {},
        method: "get",
        onSuccess: (data: Array<TransactionDoc>) => {
            setTData(data.map(t => ([
                TableLink(t.orderId, t.orderId),
                <div>&#8377;{t.amount}</div>,
                formatDate(t.createdAt),
                t.status.toUpperCase()
            ])))
        }
    });
    useEffect(() => {
        doRequest();
    }, [])
    return <SideLayout title={`bank(${tData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Create transaction</h1>
        </div>
        <Table headers={[
            {
                text: "trans id",
                isResponsive: false
            },
            {
                text: "amount",
                isResponsive: true
            },
            {
                text: "created at",
                isResponsive: false
            },
            {
                text: "status",
                isResponsive: false
            },

        ]} data={tData} />
    </SideLayout>
}

export default AdminTransactionDashboard;