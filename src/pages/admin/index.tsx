import { useState, useEffect } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import NumberCard from "../../components/card/numer";
import { useRequest } from '../../hooks/use-request';
import Link from 'next/link';


const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const pages = [
        "users",
        "tournaments",
        "sponsors",
        "streams",
        "consoles",
        "games",
        "news",
        "gallery"];
    const { doRequest } = useRequest({
        url: "/api/ugh/admin/fetch/metrics",
        body: {},
        method: "get",
        onSuccess: (val) => setData(val)
    });
    useEffect(() => {
        doRequest();
    }, [])
    return <SideLayout title="admin">
        <div className="grid">
            {pages.map(page => {
                return <Link key={page} href={`/admin/${page}`}>
                    <a style={{ textDecoration: "none", color: "black" }}>
                        <NumberCard title={page} count={data ? data[page] : null} />
                    </a>
                </Link>
            })}
            {/* 
            <NumberCard title= count={data?.tournaments} />
            <NumberCard title= count={data?.sponsors} />
            <NumberCard title= count={data?.streams} />
            <NumberCard title= count={data?.consoles} />
            <NumberCard title= count={data?.games} />
            <NumberCard title= count={data?.news} />
            <NumberCard title= count={data?.gallery} /> */}
        </div>
    </SideLayout>
}

export default AdminDashboard;