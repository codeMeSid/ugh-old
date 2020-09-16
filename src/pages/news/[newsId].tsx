import { NewsDoc } from "../../../server/models/news";
import MainLayout from "../../components/layout/mainlayout";
import NewsTab from "../../components/news-tab";
import { serverRequest } from "../../hooks/server-request";
import format from 'date-fns/format';

const NewsDetail = ({ news }: { news: NewsDoc }) => {
    return <MainLayout>
        <div className="news__container">
            <div className="news__container__image" style={{ backgroundImage: `url(${news?.uploadUrl})` }} />
            <div className="news__container__title">{news?.title}</div>
            <div className="news__container__time">published on {format(new Date(news?.createdAt || Date.now()), "dd/MM/yyyy")}</div>
            <div className="news__container__description">{news?.description}</div>
        </div>
    </MainLayout>
}

NewsDetail.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, { url: `/api/ugh/news/fetch/detail/${ctx.query.newsId}`, method: "get", body: {} });
    return { news: data, errors };
}

export default NewsDetail;