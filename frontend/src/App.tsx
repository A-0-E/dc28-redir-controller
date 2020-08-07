import React from 'react'
import { AdminView } from './AdminView'
import { NormalView } from './NormalView'

export const App: React.FC = () => {
  return <>
    { window.location.pathname === '/admin' ? <AdminView /> : <NormalView />}
  </>
}
