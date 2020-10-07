import { NewsDoc } from "../../../server/models/news";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import format from 'date-fns/format';
import RichText from "../../components/rich-text";

const NewsDetail = ({ news, errors }: { news: NewsDoc, errors: any }) => {
    return <MainLayout messages={errors}>
        <div className="news__container">
            <div className="news__container__image" style={{ backgroundImage: `url(${news?.uploadUrl})` }} />
            <div className="news__container__title">{news?.title}</div>
            <div className="news__container__time">published on {format(new Date(news?.createdAt || Date.now()), "dd/MM/yyyy")}</div>
            <div className="news__container__description">
                <RichText content={news?.description} />
            </div>
        </div>
    </MainLayout>
}
NewsDetail.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, { url: `/api/ugh/news/fetch/detail/${ctx.query.newsId}`, method: "get", body: {} });
    return { news: data, errors: errors || [] };
}

export default NewsDetail;