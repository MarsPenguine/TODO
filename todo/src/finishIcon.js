import React, {useContext, useState} from "react";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import { Button } from "antd";
import {EditableContext} from "./editableContext";

function FinishIcon(props) {
  /**
   * Here use global dataSource state from todoTable.
   */
  const [dataSource, setDataSource] = useContext(
      EditableContext
  );
  /**
   * Button can change state along with dataSource, but it can not change
   * display style along with dataSource. It might be the editable limitation from
   * editableCell.(editableCell is based on the example from Ant Design official doc.)
   */
  const [isFinished,setIsFinished] = useState(props.isFinished);

  return (
    <Button
      type="primary"
      shape="circle"
      ghost={isFinished ? false : true}
      icon={
          isFinished ? <CheckOutlined /> : null
      }
      onClick={() => {
        const newData = dataSource;
        const item = newData[props.index];
        item.isFinished = !item.isFinished;
        newData.splice(props.index, 1, item);
        setIsFinished(!isFinished);
        setDataSource(newData);
      }}
    >
      {isFinished ? null : " "}
    </Button>
  );
}

export { FinishIcon };
