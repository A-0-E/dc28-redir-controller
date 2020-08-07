import React from 'react'
import { AdminView } from './AdminView'
import { NormalView } from './NormalView'
import { useConnection, ConnectionState } from './components/Connection'

const Disabled: React.FC = ({ children }) => {
  return <div style={{cursor: 'not-allowed',}}>
    <div style={{
      filter: 'brightness(0.8)',
      pointerEvents: 'none',
    }}>{children}</div>
  </div>
}

export const App: React.FC = () => {
  const state = useConnection()
  const main = window.location.pathname === '/admin' ? <AdminView /> : <NormalView />
  if (state === ConnectionState.Connecting) {
    return <>
      Connecting... <br />
      <Disabled>{ main }</Disabled>
    </>
  }
  if (state === ConnectionState.Disconnect) {
    return <>
      Disconnected, Reconnecting... <br />
      <Disabled>{ main }</Disabled>
    </>
  }
  return <>
    { main }
  </>
}
