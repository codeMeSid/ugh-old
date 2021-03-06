import Router from "next/router";
import React, { useState } from "react";
import { CategoryDoc } from "../../../../server/models/category";
import DialogButton from "../../../components/button/dialog";
import ProgressButton from "../../../components/button/progress";
import Input from "../../../components/input/input";
import SideLayout from "../../../components/layout/sidelayout";
import { serverRequest } from "../../../hooks/server-request";
import { useRequest } from "../../../hooks/use-request";

const CategoryEditAdminPage = ({
  currentUser,
  category,
  errors,
}: {
  currentUser?: any;
  errors: Array<any>;
  category: CategoryDoc;
}) => {
  const [messages, setMessages] = useState(errors);
  const [name, setName] = useState(category?.name);
  const [sc, setSc] = useState(category?.sub || []);
  const [scv, setScv] = useState("");

  const onSubmitHandler = (_, next: any) => {
    if (!name) {
      setMessages([{ message: "Category name is required." }]);
      return next(false, "Failed");
    }
    if (sc.length === 0) {
      setMessages([{ message: "SubCategory should have atleast 1 item." }]);
      return next(false, "Failed");
    }
    const { doRequest } = useRequest({
      url: `/api/ugh/category/update/${category?.id}`,
      body: { name, subCategory: sc },
      method: "put",
      onSuccess: () => Router.replace("/admin/categorys"),
      onError: (err) => setMessages(err),
    });
    doRequest();
  };
  return (
    <SideLayout
      currentUser={currentUser}
      title="Update Category"
      messages={messages}
    >
      <div className="detail">
        <div className="row">
          <div className="col">
            <Input
              placeholder="category name"
              value={name}
              onChange={(n: any, v: string) => {
                if (v?.split(" ").length === 1) setName(v);
              }}
            />
          </div>
        </div>
        <div className="row">
          <DialogButton
            title="Add Sub-Category"
            style={{ position: "fixed", width: 400 }}
            onAction={(onSuccess, onError) => {
              if (scv === "") {
                onError(null);
              } else {
                setSc([...sc, scv]);
                setScv("");
                onSuccess(null);
              }
            }}
          >
            <Input
              placeholder={`Sub-Category ${sc.length + 1}`}
              value={scv}
              onChange={(n, v) => {
                if (v?.split(" ").length === 1) setScv(v);
              }}
            />
          </DialogButton>
        </div>
        <div className="row">
          {sc.map((sv, index) => (
            <div
              className="pill"
              key={Math.random()}
              onClick={() => {
                setSc(sc.filter((v, i) => i !== index));
              }}
            >
              {sv}
            </div>
          ))}
        </div>
        <div style={{ color: "red", fontSize: 16 }}>
          **Note: White Spaces not allowed, Use "-" instead.
        </div>
        <div className="row">
          <div className="col">
            <ProgressButton
              text="Update Category"
              type="link"
              size="medium"
              onPress={onSubmitHandler}
            />
          </div>
        </div>
      </div>
    </SideLayout>
  );
};

CategoryEditAdminPage.getInitialProps = async (ctx) => {
  const { categoryId } = ctx.query;
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/category/fetch/${categoryId}`,
    body: {},
    method: "get",
  });
  return { category: data, errors: errors || [] };
};

export default CategoryEditAdminPage;
