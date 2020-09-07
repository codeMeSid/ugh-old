import SideLayout from "../../../components/layout/sidelayout";
import { serverRequest } from "../../../hooks/server-request";
import { SponsorDoc } from "../../../../server/models/sponsor";
import Input from "../../../components/input/input";
import ProgressButton from "../../../components/button/progress";
import { useRequest } from "../../../hooks/use-request";
import Router from 'next/router';

const SponsorDetail = ({ sponsor, baseUrl }: { sponsor: SponsorDoc, baseUrl: string }) => {

    const { doRequest } = useRequest({
        url: `/api/ugh/sponsor/update/process/${sponsor?.id}`,
        method: "put",
        body: {},
        onSuccess: Router.reload
    })

    return <SideLayout title={"sponsor"}>
        <div className="row">
            <div className="col"><Input placeholder="name" value={sponsor?.name} disabled /></div>
            <div className="col"><Input placeholder="email" value={sponsor?.contact?.email} disabled /></div>
        </div>
        <div className="row">
            <div className="col"><Input placeholder="phone (+91)" value={sponsor?.contact?.phone} disabled /></div>
            <div className="col"><Input placeholder="message" value={sponsor?.message} disabled /></div>
        </div>
        <div className="row">
            <div className="col">
                <Input placeholder="pack name" value={sponsor?.sponsorPack?.name.toUpperCase()} disabled />
            </div>
            <div className="col">
                <Input placeholder="color" type="color" value={sponsor?.sponsorPack?.color} style={{ height: 40 }} disabled />
            </div>
        </div>
        <div className="row">
            <div className="col">
                <Input placeholder="pack duration" value={`${sponsor?.sponsorPack?.pack?.duration} Month`} disabled />
            </div>
            <div className="col">
                <Input placeholder="pack cost" value={`₹ ${sponsor?.sponsorPack?.pack?.price}`} disabled />
            </div>
        </div>
        <div className="row">
            <div className="col">
                {sponsor?.isProccessed ?
                    <Input placeholder="sponsor link" value={`${baseUrl}/sponsors/${sponsor.sponsorId}`} disabled /> :
                    <ProgressButton onPress={async (_, next) => {
                        await doRequest();
                        next();
                    }} type="youtube" text="Process Request" />}
            </div>
            <div className="col">
                {sponsor?.isProccessed && <ProgressButton onPress={async (_, next) => {
                    await doRequest();
                    next();
                }} text="Generate Link" type="link" />}
            </div>
        </div>
    </SideLayout>
}

SponsorDetail.getInitialProps = async (ctx) => {
    const { sponsorId } = ctx.query
    const { data, errors } = await serverRequest(ctx, {
        url: `/api/ugh/sponsor/fetch/detail/${sponsorId}`,
        method: "get",
        body: {}
    });
    const baseUrl = process.env.BASE_URL;
    return {
        sponsor: data, errors, baseUrl
    }
}

export default SponsorDetail;

//       isActive: false,
//       isProccessed: false,
//       links: []
