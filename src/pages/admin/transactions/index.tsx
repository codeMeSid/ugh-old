import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import { useRequest } from '../../../hooks/use-request';
import { TransactionDoc } from '../../../../server/models/transaction';
import Link from 'next/link';
import { format } from 'date-fns'

const AdminTransactionDashboard = () => {
    const [tData, setTData] = useState([]);
    const [messages, setMessages] = useState([]);
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
                format(new Date(t.createdAt), "dd/MM/yyyy hh:mm a"),
                <div style={{ color: t.status === "requested" ? "red" : "black" }}>{t.status.toUpperCase()}</div>
            ])))
        },
        onError: (errors) => setMessages(errors)
    });
    useEffect(() => {
        doRequest();
    }, [])
    return <SideLayout messages={messages} title={`bank(${tData.length})`}>
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