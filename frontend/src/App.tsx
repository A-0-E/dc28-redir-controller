import React from 'react'
import { useTeamQuery } from './generated/graphql'
import './App.css'



function App() {
  const result = useTeamQuery()

  return (
    <div className='App'>
      <header className='App-header'>
      </header>
    </div>
  )
}

export default App
