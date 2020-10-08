import React from "react";
import MainLayout from "../components/layout/mainlayout";
import RichText from "../components/rich-text";
import { serverRequest } from "../hooks/server-request";

const AboutPage = ({ aboutUs, errors }) => (
    <MainLayout messages={errors}>
        <div className="about">
            <div className="about__title">
                about us
            </div>
            <div>
                <RichText className="about__content" content={aboutUs} />
            </div>
        </div>
    </MainLayout>
)

AboutPage.getInitialProps = async (ctx) => {
    const { data: aboutUs, errors } = await serverRequest(ctx, { url: "/api/ugh/settings/fetch/aboutUs", body: {}, method: "get" });
    return {
        aboutUs,
        errors: errors || []
    };
}

export default AboutPage;