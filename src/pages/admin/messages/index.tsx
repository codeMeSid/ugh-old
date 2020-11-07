import SideLayout from "../../../components/layout/sidelayout";
import MessengerList from "../../../components/messenger";
import { serverRequest } from "../../../hooks/server-request";
const MessagesDashboard = ({ chats, errors, currentUser }: { chats: Array<any>, errors: Array<any>, currentUser: any }) => {

    return <SideLayout messages={errors} title="chats">
        <MessengerList from="admin" currentUser={currentUser} chats={chats.filter(chat => chat.to !== currentUser?.ughId)} />
    </SideLayout>
}

MessagesDashboard.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, {
        url: "/api/ugh/user/fetch/all",
        body: {},
        method: "get",
    });
    const chats = data?.map((user: any) => {
        return ({ to: user.ughId, channel: 'admin', profile: user?.uploadUrl, title: user.ughId })
    });
    return { chats: chats || [], errors: errors || [] }
}

export default MessagesDashboard;