import React, { useState } from 'react'
import { useInitQuery, InitQuery, State, useSubscriptionConfigSubscription, useSetServiceStateMutation, useSubscriptionServiceStateSubscription } from './generated/graphql'
import { Loading } from './components/Loading'
import { TransposeTable } from './components/TransposeTable'
import { Checkbox, Button } from 'antd'
import { StateSelect } from './components/StateSelect'

const ServiceTable: React.FC<InitQuery & { refetch: () => void }> = ({ config: { team, service }, allState, refetch }) => {
  useSubscriptionConfigSubscription({
    shouldResubscribe: true,
    onSubscriptionData: () => refetch(),
  })
  useSubscriptionServiceStateSubscription({
    shouldResubscribe: true,
    onSubscriptionData: () => refetch(),
  })

  const [ setServiceState, { loading: submiting } ] = useSetServiceStateMutation({
    onCompleted: () => refetch()
  })
  const [ transpose, setTranspose ] = useState(false)
  const data = allState.map(({ team, service, state }) => ({
    team: team.name,
    service: service.name,
    state,
  }))

  return <>
    <Checkbox checked={transpose} onChange={e => setTranspose(e.target.checked)}>Transpose</Checkbox>
    <Button onClick={refetch}>Refetch</Button>
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
        return <StateSelect
          disabled={submiting}
          tooltip={<>
            <div>Team: {teamName}</div>
            <div>Service: {serviceName}</div>
          </>}
          value={state}
          onChange={(state) => {
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

export const AdminView: React.FC = () => {
  const { loading, data, error, refetch } = useInitQuery()

  return <>
    <div className='App'>
      { error && <>{'Error:' + String(error)} <Button onClick={() => refetch()}>Refetch</Button> </> }
      { loading || !data ? <Loading /> : <ServiceTable {...data!} refetch={refetch} /> }
    </div>
  </>
}
