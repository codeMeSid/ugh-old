import { useState, useEffect } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import { useRequest } from '../../hooks/use-request'
import { NewsDoc } from '../../../server/models/news'
import Switch from 'react-switch';
import DialogButton from '../../components/button/dialog'
import Input from '../../components/input/input'

const AdminNewsDashboard = () => {
    const [newsData, setNewsData] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeNewsActivity(id)} />
    }
    const { doRequest } = useRequest({
        url: "/api/ugh/news/fetch/all", body: {}, method: "get", onSuccess: (data: Array<NewsDoc>) => {
            setNewsData(data.map(news => ([news.title, news.description, SwitchBlade(news.id, news.isActive)])));
        }
    });
    const { doRequest: addNewsRequest } = useRequest({
        url: "/api/ugh/news/add",
        body: { title, description },
        method: "post",
        onSuccess: doRequest
    });
    useEffect(() => {
        doRequest();
    }, []);
    const onChangeHandler = (name: string, val: string) => {
        switch (name) {
            case "title": return setTitle(val)
            case "description": return setDescription(val)
        };
    }
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
        <DialogButton title="add news" onAction={addNewsRequest}>
            <Input onChange={onChangeHandler} placeholder="title" name="title" value={title} />
            <Input onChange={onChangeHandler} placeholder="description" name="description" value={description} />
        </DialogButton>
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