import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form } from "antd";
import "./public/css/todoTable.css";
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

  /**
   * @param props
   * @returns It returns Context Provider structure using dataSource and setDataSource.
   * @constructor
   */
  const ModifiedDataSourceProvider = (props) => {
    return (
      <EditableContext.Provider value={[dataSource, setDataSource]}>
        {props.children}
      </EditableContext.Provider>
    );
  };

  /**
   * @param index: The button location from the list.
   * @param isFinished: The state of the button.
   * @returns It returns <FinishIcon> with Context Provider using dataSource and setDataSource.
   */
  const getIcon = (index, isFinished) => {
    return (
      <ModifiedDataSourceProvider>
        <FinishIcon isFinished={isFinished} index={index} />
      </ModifiedDataSourceProvider>
    );
  };

  /**
   * Tasks data example
   */
  let dataSourceInit = [
    {
      key: 0,
      title: "Dear friend ",
      isFinished: false,
    },
    {
      key: 1,
      title: "I'm Bill :)",
      isFinished: true,
    },
  ];

  /**
   * @dataSource: the original data set for tasks.
   *
   * @Param key: task track key.
   * @Param title: task title or description
   * @Param isFinished: whether this task is finished
   */
  const [dataSource, setDataSource] = useState(
      JSON.parse(localStorage.getItem("data_source")) || dataSourceInit
  );

  /**
   * @modifiedDataSource: It will change along with dataSource. modifiedDataSource has the
   * elements presented in <Table>.
   *
   * @Param key: task track key.
   * @Param title: task title or description.
   * @Param isFinished: whether this task is finished.
   * @Param buttonIcon: the ✔ button component with <FinishIcon />.
   *
   * Other than @buttonIcon, the rest of the params should be the same as dataSource has.
   */
  const [modifiedDataSource, setModifiedDataSource] = useState();

  /**
   * Add ✔ button in modifiedDataSource and store data in Local Storage
   */
  useEffect(() => {
    const newData = dataSource;
    newData.map((row, index) => {
      row.buttonIcon = getIcon(index, row.isFinished);
    });
    setModifiedDataSource(newData);
    localStorage.setItem("data_source", JSON.stringify(dataSource));
  }, [dataSource]);

  const [count, setCount] = useState(2);
  const [editable, setEditable] = useState(false);

  /**
   * Handle delete action
   */
  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };


  /**
   * Handle add action
   */
  const handleAdd = () => {
    const newData = {
      key: count,
      title: "New Task",
      isFinished: false,
    };
    setCount(count + 1);
    setDataSource([...dataSource, newData]);
  };

  /**
   * EditableCell handleSave config
   */
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  /**
   * Table components config
   */
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  /**
   * Table columns config
   */
  const columnsConfig = [
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
      /**
       * @param text
       * @param record
       * @returns Here renders the delete pop up window.
       */
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

  /**
   * Table columns processed config
   */
  const processedColumnsConfig = columnsConfig.map((col) => {
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
        <Button className={"button-add"} onClick={handleAdd} type="primary">
          Add
        </Button>

        <Button
          className={"button-edit"}
          onClick={() => {
            setEditable(!editable);
          }}
          type="primary"
          style={{
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
        columns={processedColumnsConfig}
      />
    </div>
  );
}

export default TodoTable;
