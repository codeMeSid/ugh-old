import SideLayout from "../../components/layout/sidelayout";
import { serverRequest } from "../../hooks/server-request";
import Input from "../../components/input/input";
import ProgressButton from "../../components/button/progress";
import { useState } from "react";
import { useRequest } from "../../hooks/use-request";
import FileInput from "../../components/input/file";
import { SettingsDoc } from "../../../server/models/settings";
import DialogButton from "../../components/button/dialog";

const SettingsPage = ({ settings }: { settings: SettingsDoc }) => {
    const [coins, setCoins] = useState(settings?.tournamentFees);
    const [wallpapers, setWallpapers] = useState(settings?.wallpapers || []);
    const [uploadUrl, setUploadUrl] = useState("");
    const [title, setTitle] = useState("");
    const [href, setHref] = useState("");
    const { doRequest } = useRequest({
        url: "/api/ugh/settings/update",
        body: {
            id: settings.id,
            tournamentFees: coins,
            wallpapers
        },
        method: "put"
    });

    const onChangeHandler = async (name: string, val: any) => {
        switch (name) {
            case "coins": return setCoins(val);
            case 'title': return setTitle(val);
            case 'uploadUrl': return setUploadUrl(val);
            case 'href': return setHref(val);
        }
    }

    const onClickHandler = index => {
        setWallpapers(Array.from(wallpapers).filter((w, i) => i !== index));
    }
    return <SideLayout title="settings">
        <div className="detail">
            <div className="row">
                <Input type="number" name="coins" placeholder="tournament fees" value={coins} onChange={onChangeHandler} />
            </div>
            <DialogButton title="Add Wallpaper" style={{ position: "fixed" }} onAction={async () => {
                if (uploadUrl) {
                    setWallpapers([...wallpapers, { title, href, uploadUrl }]);
                    setTitle("");
                    setHref("");
                    setUploadUrl("")
                }
                else return;
            }} fullButton>
                <FileInput name="uploadUrl" placeholder="wallpaper image" showImage onChange={onChangeHandler} />
                <Input name="title" placeholder="title" value={title} onChange={onChangeHandler} />
                <Input name="href" placeholder="href" value={href} onChange={onChangeHandler} />
            </DialogButton>
            <div className="row">
                <div className="admin__settings">
                    {
                        wallpapers.map((item, index) => {
                            return <div key={Math.random()} className="admin__settings__item">
                                <div onClick={() => onClickHandler(index)} className="admin__settings__item__image">
                                    <img src={item.uploadUrl} alt="UGH WALLPAPER" />
                                    <div className="admin__settings__item__image__text">
                                        click to remove
                                </div>
                                </div>
                                <Input name="title" placeholder="title" value={item.title} disabled />
                                <Input name="href" placeholder="href" value={item.href} disabled />
                            </div>
                        })
                    }
                </div>
            </div>
            <ProgressButton text="UPDATE" type="link" size="large" onPress={async (_, next) => {
                await doRequest();
                next();
            }} />
        </div>
    </SideLayout >
}

SettingsPage.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, {
        url: "/api/ugh/settings/fetch/all",
        method: "get",
        body: {}
    });
    console.log(data.wallpapers);
    return {
        settings: data,
        errors
    }
}

export default SettingsPage;