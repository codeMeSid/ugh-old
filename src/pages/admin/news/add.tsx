import React, { useState } from "react";
import ProgressButton from "../../../components/button/progress";
import TextEditor from "../../../components/editor";
import FileInput from "../../../components/input/file";
import Input from "../../../components/input/input";
import SideLayout from "../../../components/layout/sidelayout";
import { useRequest } from "../../../hooks/use-request";
import Router from 'next/router';

export default () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [messages, setMessages] = useState([]);

    const { doRequest: addNewsRequest } = useRequest({
        url: "/api/ugh/news/add",
        body: { title, description, uploadUrl },
        method: "post",
        onSuccess: () => {
            setMessages([{ message: "News added successfully", type: "success" }]);
            Router.replace("/admin/news");
        },
        onError: (errors) => setMessages(errors)
    });

    const onChangeHandler = (name: string, val: string) => {
        switch (name) {
            case "title": return setTitle(val);
            case "description": return setDescription(val);
            case 'uploadUrl': return setUploadUrl(val);
        };
    }
    return <SideLayout messages={messages} title="add news">
        <div className="row">
            <FileInput onChange={onChangeHandler} name="uploadUrl" placeholder="news image" showImage />
        </div>
        <div className="row">
            <Input onChange={onChangeHandler} placeholder="title" name="title" value={title} />
        </div>
        <div className="row">
            <div style={{ fontSize: 20 }}>Description</div>
        </div>
        <div className="row">
            <TextEditor name="description" onChange={onChangeHandler} />
        </div>
        <div className="row">
            <ProgressButton type="linkedin" size="large" text="Submit" onPress={addNewsRequest} />
        </div>
    </SideLayout>
}