import { useState } from "react";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import { UserDoc } from "../../../server/models/user";
import Input from "../../components/input/input";
import FileInput from "../../components/input/file";
import Select from "../../components/input/select";
import Option from "../../components/input/option";
import { locations } from "../../public/location-resource";
import ProgressButton from "../../components/button/progress";
import { useRequest } from "../../hooks/use-request";
import Link from "next/link";
import Button from "../../components/button/main";

const bgImage = require("../../public/asset/edit.png");

const ProfileEdit = ({ user, errors }: { user: UserDoc; errors: any }) => {
  const [uploadUrl, setUploadUrl] = useState(user?.uploadUrl);
  const [dob, setDob] = useState(user?.dob || "");
  const [mobile, setMobile] = useState(user?.mobile);
  const [psnId, setPsnId] = useState(user?.gamerProfile?.psnId);
  const [streamId, setStreamId] = useState(user?.gamerProfile?.steamId);
  const [gamerTag, setGamerTag] = useState(user?.gamerProfile?.gamerTag);
  const [aadharUrl, setAadharUrl] = useState(user?.idProof?.aadharUrl);
  const [aadharCard, setAadharCard] = useState(user?.idProof?.aadharCard);
  const [panUrl, setPanUrl] = useState(user?.idProof?.panUrl);
  const [panCard, setPanCard] = useState(user?.idProof?.panCard);
  const [country, setCountry] = useState(
    user?.address?.country ? user?.address?.country : "India"
  );
  const [state, setState] = useState(
    user?.address?.state ? user?.address?.state : "Tamil Nadu"
  );
  const [bio, setBio] = useState(user?.bio);
  const [messages, setMessages] = useState(errors);

  const onChangeHandler = (name: string, val: string) => {
    switch (name) {
      case "uploadUrl":
        return setUploadUrl(val);
      case "dob":
        return setDob(new Date(val));
      case "mobile":
        return setMobile(val);
      case "psnId":
        return setPsnId(val);
      case "streamId":
        return setStreamId(val);
      case "gamerTag":
        return setGamerTag(val);
      case "aadharUrl":
        return setAadharUrl(val);
      case "aadharCard":
        return setAadharCard(val);
      case "panUrl":
        return setPanUrl(val);
      case "panCard":
        return setPanCard(val);
    }
  };
  const onSelectHandler = ({ currentTarget: { value, name } }) => {
    switch (name) {
      case "state":
        return setState(value);
      case "country":
        return setCountry(value);
    }
  };

  return (
    <MainLayout messages={messages}>
      <div
        style={{ backgroundImage: `url(${bgImage})`, padding: "2rem" }}
        className="detail__bg"
      >
        <h1 style={{ textAlign: "center", color: "white" }}>Profile Edit</h1>
        <div className="row">
          <div className="col">
            <FileInput
              style={{ width: 300 }}
              showImage
              name="uploadUrl"
              placeholder="profile image"
              value={uploadUrl}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input placeholder="name" value={user?.name} disabled />
          </div>
          <div className="col">
            <Input placeholder="email" value={user?.email} disabled />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input placeholder="ughId" value={user?.ughId} disabled />
          </div>
          <div className="col">
            <Input
              placeholder="dob"
              name="dob"
              type="date"
              value={dob}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="mobile (+91)"
              name="mobile"
              value={mobile}
              onChange={onChangeHandler}
            />
          </div>
          <div className="col">
            <Input
              placeholder="psn Id"
              name="psnId"
              value={psnId}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="steam Id"
              name="streamId"
              value={streamId}
              onChange={onChangeHandler}
            />
          </div>
          <div className="col">
            <Input
              placeholder="gamer tag"
              name="gamerTag"
              value={gamerTag}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FileInput
              showImage
              value={aadharUrl}
              name="aadharUrl"
              placeholder="aadhar proof"
              onChange={onChangeHandler}
            />
            <Input
              value={aadharCard}
              placeholder="aadhar number"
              name="aadharCard"
              onChange={onChangeHandler}
            />
          </div>
          <div className="col">
            <FileInput
              showImage
              value={panUrl}
              name="panUrl"
              placeholder="pancard proof"
              onChange={onChangeHandler}
            />
            <Input
              value={panCard}
              placeholder="pan card no."
              name="panCard"
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Select
              name="country"
              onSelect={onSelectHandler}
              value={country}
              placeholder="country"
              options={Object.keys(locations).map((key) => {
                return <Option key={key} display={key} value={key} />;
              })}
            />
          </div>
          <div className="col">
            <Select
              name="state"
              onSelect={onSelectHandler}
              value={state}
              placeholder="state"
              options={locations[country].map((key) => (
                <Option key={key} display={key} value={key} />
              ))}
            />
          </div>
        </div>
        <div className="row">
          <textarea
            placeholder="bio"
            value={bio}
            style={{ maxWidth: "60rem", width: "100%" }}
            onChange={(e) => setBio(e.currentTarget.value)}
          />
        </div>
        <div className="row">
          <ProgressButton
            text="Update"
            type="youtube"
            size="medium"
            onPress={(_, next) => {
              const { doRequest } = useRequest({
                url: "/api/ugh/user/update/profile",
                body: {
                  uploadUrl,
                  dob,
                  mobile,
                  gamerTag,
                  steamId: streamId,
                  psnId,
                  aadharCard,
                  aadharUrl,
                  panUrl,
                  panCard,
                  bio,
                  state,
                  country,
                },
                method: "put",
                onSuccess: () => {
                  setMessages([
                    { message: "Updated Successfuly", type: "success" },
                  ]);
                  next();
                },
                onError: (errors) => {
                  next(false, "Failed");
                  setMessages(errors);
                },
              });
              doRequest();
            }}
          />
          <Link href="/profile">
            <a style={{ marginLeft: 10 }}>
              <Button text="Go Back To Profile" type="link" />
            </a>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

ProfileEdit.getInitialProps = async (ctx) => {
  const { data: user, errors } = await serverRequest(ctx, {
    url: "/api/ugh/user/fetch/profile",
    body: {},
    method: "get",
  });
  return { user, errors: errors || [] };
};

export default ProfileEdit;
