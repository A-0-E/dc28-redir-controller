import React, { useMemo, ReactNode } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
// @ts-ignore
import fromEntries from 'core-js-pure/features/object/from-entries'

export type Header = {
  id: string
  title?: React.ReactNode
}
export type Axis = {
  header: Header[]
  fieldKey: string
  title: React.ReactNode
}

export type TransposeTableProps = {
  x: Axis
  y: Axis
  data: Record<string, any>[]
  render: (data?: any) => ReactNode
  transpose?: boolean
}

export const TransposeTable: React.FC<TransposeTableProps> = ({
  x,
  y,
  data,
  transpose,
  render,
}) => {
  if (transpose) {
    [ y, x ] = [ x, y ];
  }

  const columns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: y.title,
        dataIndex: '_yName',
        fixed: 'left',
      },
      ...x.header.map(({ id, title }) => ({
        key: id,
        dataIndex: id,
        title: title ?? id,
        render (item: any) {
          return item
        }
      }))
    ]
  }, [ x.header, y.title ])

  const dataSource = useMemo(() => {
    return y.header.map((i, id) => {
      return {
        _key: id,
        _yName: i.title,
        ...fromEntries(x.header.map(({ id }) => {
          const node = data.find(v => v[x.fieldKey] === id && v[y.fieldKey] === i.id)
          return [ id, render(node) ]
        }))
      }
    })
  }, [ data, x, y, render ])

  return <Table
    rowKey={(_, i) => i!}
    columns={columns}
    dataSource={dataSource}
    pagination={false}
  />
}