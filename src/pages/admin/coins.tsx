import { useState, useEffect } from 'react';
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import Button from "../../components/button/main";
import { useRequest } from '../../hooks/use-request';
import { CoinDoc } from '../../../server/models/coin';
import Switch from 'react-switch';
import DialogButton from '../../components/button/dialog';
import Input from '../../components/input/input';

const AdminCoinsDashboard = () => {
    // states
    const [coinData, setCoinData] = useState([]);
    const [cost, setCost] = useState(0);
    const [value, setValue] = useState(0);
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
    const { doRequest: addCoinRequest } = useRequest({
        url: "/api/ugh/coin/add",
        body: { cost, value },
        method: "post",
        onSuccess: doRequest
    });
    const onChangeHandler = (name: string, val: any) => {
        switch (name) {
            case "cost": return setCost(val);
            case "value": return setValue(val)
        }
    }
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
        <DialogButton title="add coin" onAction={addCoinRequest}>
            <Input name="cost" type="number" placeholder="cost" value={cost} onChange={onChangeHandler} />
            <Input name="value" type="number" placeholder="value" value={value} onChange={onChangeHandler} />
        </DialogButton>
        <Table headers={[
            { text: "value", isResponsive: false },
            { text: "cost", isResponsive: false },
            { text: "activity", isResponsive: false }]}
            data={coinData} />
    </SideLayout>
}

export default AdminCoinsDashboard