import { useEffect, useState } from "react";
import { useRequest } from "../../../hooks/use-request";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import Link from 'next/link';

interface Dispute {
  bracketId: string;
  ughId: {
    on: string;
    by: string;
  };
  gameType: string;
  proof: string;
  wasResolved: string;
}

const AdminDisputeDashboard = () => {
  const [disputeData, setDisputeData] = useState([]);
  const [messages, setMessages] = useState([]);
  const TableLink = (id: string) => <Link href={`/admin/disputes/${id}`}>
    <a className="table__link">{id.toUpperCase()}</a>
  </Link>
  const { doRequest } = useRequest({
    url: "/api/ugh/bracket/fetch/disputes",
    method: "get",
    body: {},
    onSuccess: (data: Array<Dispute>) => {
      setDisputeData(data.map(dispute => [
        TableLink(dispute.bracketId),
        <>
          <div>BY: {dispute.ughId.by.toUpperCase()}</div>
          <div>ON: {dispute.ughId.on.toUpperCase()}</div>
        </>,
        dispute.gameType.toUpperCase(),
        <a href={dispute.proof} target="_blank"><img style={{ maxWidth: 200, maxHeight: 200 }} src={dispute.proof} /></a>,
        <div style={{ color: dispute.wasResolved ? "green" : "red" }}>{dispute.wasResolved ? "YES" : "NO"}</div>
      ]))
    },
    onError: (errors) => setMessages(errors),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return <SideLayout messages={messages} title="Disputes">
    <Table data={disputeData} headers={[
      { text: "bracket", isResponsive: false },
      { text: "ughId", isResponsive: false },
      { text: "game type", isResponsive: true },
      { text: "proof", isResponsive: true },
      { text: "was resolved", isResponsive: false }
    ]} />
  </SideLayout>
};

export default AdminDisputeDashboard;