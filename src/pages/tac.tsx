import React from "react";
import MainLayout from "../components/layout/mainlayout";
import RichText from "../components/rich-text";
import { serverRequest } from "../hooks/server-request";

const PrivacyPage = ({ tou, errors }) => (
    <MainLayout messages={errors}>
        <div className="about">
            <div className="about__title">
                Terms Of Use
            </div>
            <div>
                <RichText className="about__content" content={tou} />
            </div>
        </div>
    </MainLayout>
)

PrivacyPage.getInitialProps = async (ctx) => {
    const { data: tou, errors } = await serverRequest(ctx, { url: "/api/ugh/settings/fetch/termsOfService", body: {}, method: "get" });
    return {
        tou,
        errors: errors || []
    };
}

export default PrivacyPage;