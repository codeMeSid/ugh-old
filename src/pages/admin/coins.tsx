import { useState, useEffect } from 'react';
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import Button from "../../components/button";
import { useRequest } from '../../hooks/use-request';
import { CoinDoc } from '../../../server/models/coin';
import Switch from 'react-switch';

const AdminCoinsDashboard = () => {
    // states
    const [coinData, setCoinData] = useState([]);
    // components
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeCoinActivity(id)} />
    }
    // requests
    const { doRequest } = useRequest({
        url: "/api/ugh/coin/fetch/all",
        method: "get",
        body: {},
        onSuccess: (data: Array<CoinDoc>) => {
            setCoinData(data.map(coin => {
                return [coin.value, coin.cost, SwitchBlade(coin.id, coin.isActive)]
            }))
        }
    });
    // effects
    useEffect(() => {
        doRequest();
    }, [])
    // method
    const changeCoinActivity = async (id: String) => {
        const { doRequest: updateCoinRequest } = useRequest({
            url: `/api/ugh/coin/update/activity/${id}`,
            method: "put",
            body: {}
        });
        await updateCoinRequest();
        await doRequest();
    }
    // render
    return <SideLayout title={`coins(${coinData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add Coins</h1>
        </div>
        <Table headers={[
            { text: "value", isResponsive: false },
            { text: "cost", isResponsive: false },
            { text: "activity", isResponsive: false }]}
            data={coinData} />
    </SideLayout>
}

export default AdminCoinsDashboard