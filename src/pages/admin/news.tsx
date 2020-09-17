import { useState, useEffect } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import Table from "../../components/table"
import { useRequest } from '../../hooks/use-request'
import { NewsDoc } from '../../../server/models/news'
import Switch from 'react-switch';
import DialogButton from '../../components/button/dialog'
import Input from '../../components/input/input'
import FileInput from '../../components/input/file'

const AdminNewsDashboard = () => {
    const [newsData, setNewsData] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [messages, setMessages] = useState([]);
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeNewsActivity(id)} />
    }
    const { doRequest } = useRequest({
        url: "/api/ugh/news/fetch/all",
        body: {}, method: "get",
        onSuccess: (data: Array<NewsDoc>) => setNewsData(data.map(news => ([news.title, <a href={news?.uploadUrl || ""} target="_blank"><img className="gallery__image" src={news?.uploadUrl || ""} /></a>, SwitchBlade(news.id, news.isActive)]))),
        onError: (errors) => setMessages(errors)
    });
    const { doRequest: addNewsRequest } = useRequest({
        url: "/api/ugh/news/add",
        body: { title, description, uploadUrl },
        method: "post",
        onSuccess: () => {
            setMessages([{ message: "News added successfully", type: "success" }])
            doRequest()
        },
        onError: (errors) => setMessages(errors)
    });
    useEffect(() => {
        doRequest();
    }, []);
    const onChangeHandler = (name: string, val: string) => {
        switch (name) {
            case "title": return setTitle(val);
            case "description": return setDescription(val);
            case 'uploadUrl': return setUploadUrl(val);
        };
    }
    const changeNewsActivity = async (id: string) => {
        const { doRequest: updateNewsRequest } = useRequest({
            url: `/api/ugh/news/update/activity/${id}`,
            method: "put",
            body: {},
            onSuccess: () => setMessages([{ message: "Updated successfully", type: "success" }]),
            onError: (errors) => setMessages(errors)
        });
        await updateNewsRequest();
        await doRequest();
    }
    return <SideLayout messages={messages} title={`news(${newsData.length})`}>
        <DialogButton title="add news" onAction={addNewsRequest}>
            <FileInput onChange={onChangeHandler} name="uploadUrl" placeholder="news image" showImage />
            <Input onChange={onChangeHandler} placeholder="title" name="title" value={title} />
            <Input onChange={onChangeHandler} placeholder="description" name="description" value={description} />
        </DialogButton>
        <Table headers={[
            {
                text: "title",
                isResponsive: false
            },
            {
                text: "image",
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