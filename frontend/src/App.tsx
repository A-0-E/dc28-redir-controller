import React, { useState } from 'react'
import { useInitQuery, InitQuery, State } from './generated/graphql'
import { Loading } from './components/Loading'
import { TransposeTable } from './components/TransposeTable'
import { Checkbox } from 'antd'


const ServiceTable: React.FC<InitQuery> = ({ team, service, allState }) => {
  const [ transpose, setTranspose ] = useState(false)
  const data = allState.map(({ team, service, state }) => ({
    team: team.name,
    service: service.name,
    state,
  }))

  return <>
    <Checkbox value={transpose} onChange={e => setTranspose(e.target.checked)}>Transpose</Checkbox>
    <TransposeTable
      transpose={transpose}
      x={{
        title: 'Team',
        fieldKey: 'team',
        header: team.map(i => ({
          id: i.name,
          title: i.name,
        }))
      }}
      y={{
        title: 'Service',
        fieldKey: 'service',
        header: service.map(i => ({
          id: i.name,
          title: i.name,
        }))
      }}
      render={(node?: typeof data[0]) => {
        return node ? node.state : State.Ignore
      }}
      data={data}
    />
  </>
}

export const App: React.FC = () => {
  const { loading, data, error } = useInitQuery()

  return <>
    <div className='App'>
      { error && 'Error:' + String(error) }
      { loading ? <Loading /> : <ServiceTable {...data!} /> }
    </div>
  </>
}
