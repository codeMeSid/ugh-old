import { useState, useEffect } from "react";
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import Switch from "react-switch";
import { useRequest } from "../../hooks/use-request";
import { ConsoleDoc } from "../../../server/models/console";
import DialogButton from "../../components/button/dialog";
import Input from "../../components/input/input";
import IconDialogButton from "../../components/button/icon-dialog";
import { AiFillDelete } from "react-icons/ai";
import Router from "next/router";

const AdminConsolesDashboard = ({ currentUser }) => {
  // states
  const [consoleData, setConsoleData] = useState([]);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  // components
  const SwitchBlade = (id: string, activity: boolean) => {
    return (
      <Switch checked={activity} onChange={() => changeConsoleActivity(id)} />
    );
  };
  // request
  const { doRequest } = useRequest({
    url: "/api/ugh/console/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<ConsoleDoc>) =>
      setConsoleData(
        data.map((console) => [
          console.name.toUpperCase(),
          SwitchBlade(console.id, console.isActive),
          <IconDialogButton
            Icon={AiFillDelete}
            iconStyle={{ color: "red", fontSize: 24 }}
            style={{ width: 300 }}
            onAction={(onSuccess, onError) => {
              const { doRequest: deleteConsole } = useRequest({
                url: `/api/ugh/admin/delete/console/${console.id}`,
                method: "delete",
                body: {},
                onSuccess: Router.reload,
                onError: setMessages,
              });
              deleteConsole(onSuccess, onError);
            }}
          >
            <div style={{ margin: 10, fontSize: 18 }}>Are you Sure?</div>
          </IconDialogButton>,
        ])
      ),
    onError: (errors) => setMessages(errors),
  });

  const { doRequest: addConsoleRequest } = useRequest({
    url: "/api/ugh/console/add",
    body: { name },
    method: "post",
    onSuccess: () => {
      setMessages([{ message: "Console successfully added", type: "success" }]);
      doRequest();
    },
    onError: (errors) => setMessages(errors),
  });
  // effect
  useEffect(() => {
    doRequest();
  }, []);
  // method
  const changeConsoleActivity = async (id: string) => {
    const { doRequest: updateConsoleRequest } = useRequest({
      url: `/api/ugh/console/update/activity/${id}`,
      method: "put",
      body: {},
      onError: (errors) => setMessages(errors),
      onSuccess: () =>
        setMessages([
          { message: "Console successfully updates", type: "success" },
        ]),
    });
    await updateConsoleRequest();
    await doRequest();
  };
  // render
  return (
    <SideLayout
      currentUser={currentUser}
      messages={messages}
      title={`console(${consoleData.length})`}
    >
      <DialogButton title="add console" onAction={addConsoleRequest}>
        <Input
          name="name"
          placeholder="name"
          onChange={(_, val) => setName(val)}
          value={name}
        />
      </DialogButton>
      <Table
        headers={[
          { text: "name", isResponsive: false },
          { text: "activity", isResponsive: false },
          { text: "delete", isResponsive: true },
        ]}
        data={consoleData}
      />
    </SideLayout>
  );
};

export default AdminConsolesDashboard;
