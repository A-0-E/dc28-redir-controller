import React, { useState } from 'react'
import { useInitQuery, InitQuery, State, useSubscriptionConfigSubscription, useSetServiceStateMutation } from './generated/graphql'
import { Loading } from './components/Loading'
import { TransposeTable } from './components/TransposeTable'
import { Checkbox } from 'antd'
import { StateSelect } from './components/StateSelect'

const ServiceTable: React.FC<InitQuery> = ({ config: { team, service }, allState }) => {
  useSubscriptionConfigSubscription()

  const [ setServiceState, result ] = useSetServiceStateMutation()
  const [ transpose, setTranspose ] = useState(false)
  const data = allState.map(({ team, service, state }) => ({
    team: team.name,
    service: service.name,
    state,
  }))

  return <>
    <Checkbox checked={transpose} onChange={e => setTranspose(e.target.checked)}>Transpose</Checkbox>
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
      render={(node: typeof data[0] | undefined, teamName, serviceName) => {
        const state = node ? node.state : State.Ignore
        return <StateSelect value={state} onChange={(state) => {
          console.log(teamName, serviceName)
          setServiceState({
            variables: {
              teamName,
              serviceName,
              state
            }
          })
        }} />
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
