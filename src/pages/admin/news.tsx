import { useState, useEffect } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import Button from "../../components/button"
import { useRequest } from '../../hooks/use-request'
import { NewsDoc } from '../../../server/models/news'
import Tooltip from '../../components/tooltip'
import Switch from 'react-switch';

const AdminNewsDashboard = () => {
    const [newsData, setNewsData] = useState([]);
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeNewsActivity(id)} />
    }
    const { doRequest } = useRequest({
        url: "/api/ugh/news/fetch/all", body: {}, method: "get", onSuccess: (data: Array<NewsDoc>) => {
            setNewsData(data.map(news => ([news.title, news.description, SwitchBlade(news.id, news.isActive)])));
        }
    });
    useEffect(() => {
        doRequest();
    }, []);
    const changeNewsActivity = async (id: string) => {
        const { doRequest: updateNewsRequest } = useRequest({
            url: `/api/ugh/news/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateNewsRequest();
        await doRequest();
    }
    return <SideLayout title={`news(${newsData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add News</h1>
        </div>
        <Table headers={[
            {
                text: "title",
                isResponsive: false
            },
            {
                text: "description",
                isResponsive: false
            },
            {
                text: "activity",
                isResponsive: false
            }
        ]} data={newsData} />
    </SideLayout>
}

export default AdminNewsDashboard