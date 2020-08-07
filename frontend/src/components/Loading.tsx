import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

export const Loading: React.FC<{ loading: boolean }> = ({ loading, children }) => {
  return <>
    { loading ? <LoadingOutlined/> : children }
  </>
}
