import React from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import Option from "../input/option";
import Select from "../input/select";

interface Props {
  headers: Array<{ text: string; isResponsive: boolean }>;
  data: Array<any>;
  hasLoader?: boolean;
}

class Table extends React.Component<Props> {
  state = {
    rowsPerPage: 10,
    page: 0,
  };
  onPageClickHandler(type: string) {
    const { page, rowsPerPage } = this.state;
    const { data } = this.props;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    switch (type) {
      case "-":
        if (page > 0) this.setState((ps: any) => ({ page: ps.page - 1 }));
        break;
      case "+":
        if (page + 1 !== pageCount)
          this.setState((ps: any) => ({ page: ps.page + 1 }));
    }
  }

  render() {
    const { data, headers, hasLoader } = this.props;
    const { page, rowsPerPage } = this.state;
    const itemCount = page * rowsPerPage;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    const dataList = data.slice(itemCount, itemCount + rowsPerPage);
    return (
      <>
        <table>
          <thead>
            <tr>
              {headers.map(({ text, isResponsive }) => (
                <th
                  key={Math.random() * 1000}
                  className={`${isResponsive ? "table__hidden" : ""}`}
                >
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !hasLoader
              ? Array(10)
                  .fill(0)
                  .map(() => {
                    return (
                      <tr key={Math.random() * 1000}>
                        {Array(headers.length)
                          .fill(0)
                          .map((_, index: number) => {
                            return (
                              <td
                                key={Math.random() * 1000}
                                className={`${
                                  headers[index].isResponsive
                                    ? "table__hidden"
                                    : ""
                                }`}
                              >
                                <Skeleton />
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })
              : dataList.map((points: any[]) => {
                  return (
                    <tr key={Math.random() * 1000}>
                      {" "}
                      {points.map((point: any, index: number) => {
                        return (
                          <td
                            key={Math.random() * 1000}
                            className={`${
                              headers[index].isResponsive ? "table__hidden" : ""
                            }`}
                          >
                            {point}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </tbody>
        </table>
        {data.length > 0 && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              fontSize: 30,
              marginTop: 10,
            }}
          >
            <div>
              <Select
                onSelect={(e) =>
                  this.setState({ rowsPerPage: e.currentTarget.value })
                }
                placeholder="rows per page"
                value={rowsPerPage}
                options={[5, 10, 20, 50].map((v) => {
                  return <Option key={v} display={v} value={v} />;
                })}
              />
            </div>
            <div>
              <span>
                <AiFillCaretLeft
                  style={{
                    color: page === 0 ? "gray" : "black",
                    cursor: "pointer",
                  }}
                  onClick={() => this.onPageClickHandler("-")}
                />
              </span>
              <span style={{ fontSize: 22, verticalAlign: "top" }}>
                page {page + 1} of {pageCount}
              </span>
              <span>
                <AiFillCaretRight
                  style={{
                    color: page + 1 !== pageCount ? "black" : "gray",
                    cursor: "pointer",
                  }}
                  onClick={() => this.onPageClickHandler("+")}
                />
              </span>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Table;
