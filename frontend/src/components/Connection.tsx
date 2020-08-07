import React, { useContext } from 'react'

export enum ConnectionState {
  Connecting,
  Connected,
  Disconnect,
}
export const ConnectionCtx = React.createContext(ConnectionState.Connecting)
export const useConnection = () => useContext(ConnectionCtx)
