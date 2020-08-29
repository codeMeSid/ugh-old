import { Component } from 'react'
import SideLayout from "../../components/layout/sidelayout"
import NumberCard from "../../components/card/numer";
import Axios from 'axios';
class AdminDashboard extends Component {
    state = {
        data: null
    }

    componentDidMount() {
        this.doRequest();
    }

    async doRequest() {
        try {
            const response = await Axios.get("/api/ugh/admin/fetch/metrics");
            this.setState({ data: response.data })
        } catch (error) {
            const errors = error.response?.data.errors;
        }
    };

    render() {
        const { data } = this.state;
        return <SideLayout title="admin">
            <div className="grid">
                <NumberCard title="users" count={data?.users} />
                <NumberCard title="tournaments" count={data?.tournaments} />
                <NumberCard title="sponsors" count={data?.sponsors} />
                <NumberCard title="streams" count={data?.streams} />
                <NumberCard title="console" count={data?.consoles} />
                <NumberCard title="games" count={data?.games} />
                <NumberCard title="news" count={data?.news} />
                <NumberCard title="gallery" count={data?.gallery} />
            </div>
        </SideLayout>
    }
}
export default AdminDashboard;