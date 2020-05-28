import React, {useContext, useState} from "react";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import { Button } from "antd";
import {EditableContext, ModifiedContext} from "./editableContext";

function FinishIcon(props) {
  const [dataSource, setDataSource] = useContext(
      EditableContext
  );
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
        console.log(newData);
        console.log(props.index);
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
