import React, { useState } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Input from "../../../components/input/input";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { HiOutlineDocumentRemove } from "react-icons/hi";
import ProgressButton from "../../../components/button/progress";
import { useRequest } from "../../../hooks/use-request";
import Router from "next/router";
import TextEditor from "../../../components/editor";

const AddSponsorship = ({ currentUser }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000008");
  const [description, setDescription] = useState("");
  const [packs, setPacks] = useState([{ duration: 6, price: 1000 }]);
  const [messages, setMessages] = useState([]);

  const { doRequest } = useRequest({
    url: "/api/ugh/sponsorship/add",
    body: {
      name,
      color,
      packs,
      description,
    },
    method: "post",
    onSuccess: () => Router.replace("/admin/sponsorships"),
    onError: (errors) => setMessages(errors),
  });

  const onChangeHandler = (name: string, val: string) => {
    switch (name) {
      case "name":
        return setName(val);
      case "color":
        return setColor(val);
      case "description":
        return setDescription(val);
    }
  };

  const onUpdateHandler = (index: number, name: string, value: number) => {
    const updatedPacks = [...packs];
    updatedPacks[index][name] = value;
    setPacks(updatedPacks);
  };
  return (
    <SideLayout currentUser={currentUser} messages={messages} title="add pack">
      <div className="detail">
        <div className="row">
          <div className="col">
            <Input
              placeholder="name"
              name="name"
              onChange={onChangeHandler}
              value={name}
            />
          </div>
          <div className="col">
            <Input
              style={{ height: 40 }}
              placeholder="color"
              name="color"
              type="color"
              onChange={onChangeHandler}
              value={color}
            />
          </div>
        </div>
        {packs.map((pack, index) => {
          return (
            <div className="row" key={Math.random()}>
              <div className="col">
                <Input
                  name="duration"
                  type="number"
                  placeholder="duration (in months)"
                  value={pack.duration}
                  onChange={(name, val) => onUpdateHandler(index, name, val)}
                />
              </div>
              <div className="col">
                <Input
                  name="price"
                  type="number"
                  placeholder="price (in ₹)"
                  value={pack.price}
                  onChange={(name, val) => onUpdateHandler(index, name, val)}
                />
              </div>
            </div>
          );
        })}
        <div className="row">
          <div className="col">
            <AiOutlineAppstoreAdd
              onClick={() => {
                setPacks([...packs, { duration: 6, price: 1000 }]);
              }}
              style={{ fontSize: "3rem", cursor: "pointer" }}
            />
          </div>
          {packs.length > 1 && (
            <div className="col">
              <HiOutlineDocumentRemove
                onClick={() => {
                  const updatedPacks = [...packs];
                  updatedPacks.pop();
                  setPacks(updatedPacks);
                }}
                style={{ fontSize: "3rem", cursor: "pointer" }}
              />
            </div>
          )}
        </div>
        <div className="row">
          <TextEditor name="description" onChange={onChangeHandler} />
        </div>
        <div className="row">
          <ProgressButton
            type="link"
            size="large"
            text="Submit"
            onPress={async (_, next) => {
              await doRequest();
              next();
            }}
          />
        </div>
      </div>
    </SideLayout>
  );
};

export default AddSponsorship;
