import React, { useState } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import { serverRequest } from "../../../hooks/server-request";
import Input from "../../../components/input/input";
import Select from "../../../components/input/select";
import Option from "../../../components/input/option";
import { format } from "date-fns";
import ProgressButton from "../../../components/button/progress";
import { useRequest } from "../../../hooks/use-request";
import Router from "next/router";
import Link from "next/link";
import Button from "../../../components/button/main";
import { UserDoc } from "../../../../server/models/user";

const UserDetail = ({
  user,
  errors,
  currentUser,
}: {
  user: UserDoc;
  errors: any;
  currentUser?: any;
}) => {
  const [coins, setCoins] = useState(user?.wallet?.coins || 0);
  const [role, setRole] = useState(user?.role);
  const [dob, setDob] = useState(user?.dob || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [email, setEmail] = useState(user?.email || "");
  const [messages, setMessages] = useState(errors);

  const { doRequest } = useRequest({
    url: `/api/ugh/user/update/profile/${user?.ughId}`,
    body: { coins, role, dob, mobile, email },
    method: "put",
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });

  const onChangeHandler = (_, val: number) => setCoins(val || 0);
  const onSelectHandler = (e) => setRole(e.currentTarget.value);
  return (
    <SideLayout
      currentUser={currentUser}
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
            <Input
              placeholder="email"
              value={email}
              type="email"
              onChange={(n, v) => setEmail(v)}
            />
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
              type="date"
              value={dob}
              onChange={(n, v) => setDob(new Date(v))}
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
              value={mobile}
              onChange={(n, v) => setMobile(v)}
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
            <Input placeholder="Steam Id" value={user?.gamerProfile?.steamId} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input placeholder="PSN Id" value={user?.gamerProfile?.psnId} />
          </div>
          <div className="col"></div>
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
          size="medium"
          type="link"
          text="Update"
          onPress={async (_, next) => {
            if (mobile !== user?.mobile) {
              const mobRegex = new RegExp("[+]91[1-9]{1}[0-9]{9}");
              if (!mobRegex.test(mobile)) {
                setMessages([{ message: "Invalid Mobile Number Format" }]);
                next(false, "Failed");
                return;
              }
            }
            await doRequest();
            next();
          }}
        />
        <Link href={`/admin/users/passbook/${user?.ughId}`}>
          <a style={{ marginLeft: 10 }}>
            <Button size="medium" text="Passbook" type="github" />
          </a>
        </Link>
        <Link href={`/admin/users/tournament/${user?.ughId}`}>
          <a style={{ marginLeft: 10 }}>
            <Button size="medium" text="Tournaments" type="facebook" />
          </a>
        </Link>
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
    errors: errors || [],
  };
};

export default UserDetail;
