import { useState, useEffect } from "react";
import SideLayout from "../../components/layout/sidelayout";
import NumberCard from "../../components/card/numer";
import { useRequest } from "../../hooks/use-request";
import Link from "next/link";

const AdminDashboard = ({ currentUser }) => {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const pages = [
    "users",
    "tournaments",
    "sponsors",
    "streams",
    "consoles",
    "games",
    "news",
    "gallery",
  ];
  const { doRequest } = useRequest({
    url: "/api/ugh/admin/fetch/metrics",
    body: {},
    method: "get",
    onSuccess: (val) => setData(val),
    onError: (errors) => setMessages(errors),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return (
    <SideLayout currentUser={currentUser} messages={messages} title="admin">
      <div className="grid">
        {pages.map((page) => {
          return (
            <Link key={page} href={`/admin/${page}`}>
              <a style={{ textDecoration: "none", color: "black" }}>
                <NumberCard title={page} count={data ? data[page] : null} />
              </a>
            </Link>
          );
        })}
      </div>
    </SideLayout>
  );
};

export default AdminDashboard;
