import React from "react";

export const columns = [
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