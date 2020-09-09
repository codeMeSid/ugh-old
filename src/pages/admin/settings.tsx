import SideLayout from "../../components/layout/sidelayout";
import { serverRequest } from "../../hooks/server-request";
import Input from "../../components/input/input";
import ProgressButton from "../../components/button/progress";
import { useState } from "react";
import { useRequest } from "../../hooks/use-request";
import FileInput from "../../components/input/file";

const SettingsPage = ({ settings }) => {
    const [coins, setCoins] = useState(settings?.tournamentFees);
    const [wallpapers, setWallpapers] = useState(settings?.wallpapers || []);
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
            case "wallpaper": return setWallpapers([...wallpapers, val])
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
            <div className="row">
                {
                    wallpapers.map((wallpaper, index) => {
                        return <div key={wallpaper} onClick={() => onClickHandler(index)} style={{ width: 200, margin: "0 2px" }}>
                            <img style={{ width: "100%", height: "auto", border: "1px solid gray" }} src={wallpaper} alt="ugh wallpaper" />
                        </div>
                    })
                }
            </div>
            <div className="row">
                <FileInput name="wallpaper" placeholder="wallpaper" onChange={onChangeHandler} />
            </div>
            <ProgressButton text="UPDATE" type="link" size="large" onPress={async (_, next) => {
                await doRequest();
                next();
            }} />
        </div>
    </SideLayout>
}

SettingsPage.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, {
        url: "/api/ugh/settings/fetch/all",
        method: "get",
        body: {}
    });
    return {
        settings: data,
        errors
    }
}

export default SettingsPage;