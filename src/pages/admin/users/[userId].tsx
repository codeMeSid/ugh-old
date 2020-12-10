import { useState } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import { serverRequest } from "../../../hooks/server-request";
import Input from "../../../components/input/input";
import Select from "../../../components/input/select";
import Option from "../../../components/input/option";
import { format } from "date-fns";
import ProgressButton from "../../../components/button/progress";
import { useRequest } from "../../../hooks/use-request";
import Router from "next/router";
import Table from "../../../components/table";

const UserDetail = ({ user }: { user: any }) => {
  const [coins, setCoins] = useState(user?.wallet?.coins || 0);
  const [role, setRole] = useState(user?.role);
  const [messages, setMessages] = useState([]);

  const { doRequest } = useRequest({
    url: `/api/ugh/user/update/profile/${user?.id}`,
    body: { coins, role },
    method: "put",
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });

  const onChangeHandler = (_, val: number) => setCoins(val || 0);
  const onSelectHandler = (e) => setRole(e.currentTarget.value);
  return (
    <SideLayout
      messages={messages}
      title={user?.ughId ? user?.ughId : "not found"}
    >
      <div className="detail">
        <div className="row">
          <img
            src={user?.uploadUrl}
            className="detail__image"
            alt="User profile image"
          />
        </div>
        <div className="row">
          <div className="col">
            <Input placeholder="name" value={user?.name} disabled={true} />
          </div>
          <div className="col">
            <Input placeholder="email" value={user?.email} disabled={true} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            {" "}
            <Input placeholder="ughId" value={user?.ughId} disabled={true} />
          </div>
          <div className="col">
            <Input
              placeholder="date of birth"
              value={format(
                user?.dob ? new Date(user?.dob) : Date.now(),
                "do MMMM yyy"
              )}
              disabled={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              value={user?.address?.country}
              placeholder="country"
              disabled
            />
          </div>
          <div className="col">
            <Input value={user?.address?.state} placeholder="state" disabled />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="phone"
              value={`+91 ${user?.mobile || ""}`}
              disabled={true}
            />
          </div>
          <div className="col">
            <Input
              placeholder="status"
              value={user?.activity.toUpperCase()}
              disabled={true}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Input
              placeholder="tournaments played"
              value={user?.tournaments.length}
              disabled={true}
            />
          </div>
          <div className="col">
            <Input
              placeholder="tournaments won"
              value={user?.tournaments.filter((t) => t.didWin).length}
              disabled={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <img
              src={user?.idProof?.aadharUrl}
              className="detail__image"
              alt={"user aadhar card"}
            />
            <Input
              placeholder="aadhar card"
              value={user?.idProof?.aadharCard}
              disabled
            />
          </div>
          <div className="col">
            <img
              src={user?.idProof?.panUrl}
              className="detail__image"
              alt={"user pan card"}
            />
            <Input
              placeholder="pan card"
              value={user?.idProof?.panCard}
              disabled
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="gamer tag"
              value={user?.gamerProfile?.gamerTag}
            />
          </div>
          <div className="col">
            <Input
              placeholder="Stream Id"
              value={user?.gamerProfile?.steamId}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              name="coins"
              onChange={onChangeHandler}
              placeholder="coins"
              type="number"
              value={coins}
            />
          </div>
          <div className="col">
            <Select
              onSelect={onSelectHandler}
              placeholder="user role"
              value={role}
              options={["admin", "player"].map((role) => (
                <Option key={role} display={role.toUpperCase()} value={role} />
              ))}
            />
          </div>
        </div>

        <ProgressButton
          size="large"
          type="link"
          text="UPDATE"
          onPress={async (_, next) => {
            await doRequest();
            next();
          }}
        />
        <div className="row">
          <h2>PASSBOOK</h2>
        </div>
        <div className="row">
          <Table
            headers={[
              { text: "date", isResponsive: false },
              { text: "type", isResponsive: false },
              { text: "coins", isResponsive: false },
            ]}
            data={user.passbook.map((p) => [
              format(new Date(p.date).valueOf(), "do MMMM yyy hh:mm a"),
              `${p.transactionEnv}`.toUpperCase(),
              <div
                style={{
                  color: p.transactionType === "credit" ? "green" : "red",
                }}
              >
                {`${p.transactionType === "credit" ? "+" : "-"} ${p.coins}`}
              </div>,
            ])}
          />
        </div>
      </div>
    </SideLayout>
  );
};

UserDetail.getInitialProps = async (ctx) => {
  const { userId } = ctx.query;
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/user/fetch/detail/gen/${userId}`,
    body: {},
    method: "get",
  });
  return {
    user: data,
  };
};

export default UserDetail;

//     gamerProfile: UserGamerProfile;
