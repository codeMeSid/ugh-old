import { useEffect, useState } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import NumberCard from "../../components/card/numer"
import { useRequest, HttpMethod } from "@monsid/ugh"

const AdminDashboard = () => {
    const [data, setData] = useState(null)
    const { doRequest } = useRequest({
        url: "/api/ugh/admin/fetch/metrics",
        method: HttpMethod.Get,
        body: {},
        onSuccess: (data) => { setData(data) }
    })
    return <SideLayout title="admin">
        <div className="grid">
            <NumberCard title="users" count={data?.users} />
            <NumberCard title="tournaments" count={data?.tournaments} />
            <NumberCard title="sponsors" count={data?.sponsors} />
            <NumberCard title="streams" count={data?.streams} />
            <NumberCard title="console" count={data?.consoles} />
            <NumberCard title="games" count={data?.games} />
            <NumberCard title="news" count={data?.news} />
            <NumberCard title="gallery" count={data?.gallery} />
        </div>
    </SideLayout>
}

export default AdminDashboard