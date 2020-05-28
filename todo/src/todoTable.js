import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form } from "antd";
import "./css/todoTable.css";
import { EditableCell } from "./editableCell";
import { EditableContext } from "./editableContext";
import { FinishIcon } from "./finishIcon";

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

function TodoTable() {
  const ModifiedDataSourceProvider = (props) => {
    return (
      <EditableContext.Provider
        value={[dataSource, setDataSource]}
      >
        {props.children}
      </EditableContext.Provider>
    );
  };
  const getIcon = (index, isFinished) => {
    return (
      <ModifiedDataSourceProvider>
        <FinishIcon isFinished={isFinished} index={index} />
      </ModifiedDataSourceProvider>
    );
  };

  let dataSourceInit = [
    {
      key: "0",
      title: "Edward King 0",
      isFinished: false,
    },
    {
      key: "1",
      title: "Edward King 1",
      isFinished: true,
    },
  ];

  let initialization = [
    {
      key: 0,
      title: "Edward King 0",
      isFinished: false,
      buttonIcon: getIcon(0, false),
    },
    {
      key: 1,
      title: "Edward King 1",
      isFinished: true,
      buttonIcon: getIcon(1, true),
    },
  ];
  const [modifiedDataSource, setModifiedDataSource] = useState(initialization);
  const [dataSource, setDataSource] = useState(JSON.parse(localStorage.getItem("data_source")) ||dataSourceInit);
  useEffect(() => {
    console.log(modifiedDataSource);
  }, [modifiedDataSource]);

  useEffect(() => {
    const newData = dataSource;
    newData.map((row, index) => {
      row.buttonIcon = getIcon(index, row.isFinished);
    });
    setModifiedDataSource(newData);
    localStorage.setItem("data_source",JSON.stringify(dataSource));
  }, [dataSource]);

  const [count, setCount] = useState(2);
  const [editable, setEditable] = useState(false);
  const columns = [
    {
      title: "To Do",
      dataIndex: "title",
      width: "80%",
      editable: editable ? true : false,
    },
    {
      dataIndex: "buttonIcon",
    },
    {
      dataIndex: "operation",
      render: (text, record) =>
        editable && modifiedDataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = (key) => {
    setDataSource(
      dataSource.filter((item) => item.key !== key)
    );
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      title: `test ${count}`,
      isFinished: false,
    };
    setCount(count + 1);
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columnsMapping = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div style={{ margin: "auto", width: "70%" }}>
      <div className={"buttons"}>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
            float: "left",
            zIndex: 1,
          }}
        >
          Add
        </Button>

        <Button
          className={"edit"}
          onClick={() => {
            setEditable(!editable);
          }}
          type="primary"
          style={{
            marginBottom: 16,
            float: "right",
            zIndex: 1,
            backgroundColor: editable ? "#eba10c" : "#1890ff",
          }}
        >
          Edit
        </Button>
      </div>

      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={modifiedDataSource}
        columns={columnsMapping}
      />
    </div>
  );
}

export default TodoTable;
