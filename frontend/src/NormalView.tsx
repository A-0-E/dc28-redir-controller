import React, { useState, useEffect, useCallback } from 'react'
import { useInitQuery, useSubscriptionConfigSubscription, useSubscriptionServiceStateSubscription, useSetServiceStateMutation, State, useSubscriptionReloadSubscription } from './generated/graphql'
import { Loading } from './components/Loading'
import { Radio, Table, Button, Tooltip } from 'antd'
import { BatchSelect } from './components/BatchSelect'
import { StateSelect } from './components/StateSelect'
import { ColumnsType } from 'antd/lib/table'
import { useQsState } from './qs'

const ServiceTable: React.FC = () => {
  useSubscriptionConfigSubscription({
    // onSubscriptionData: () => refetch(),
  })
  useSubscriptionServiceStateSubscription({
    // onSubscriptionData: () => refetch(),
  })
  const { loading, data, error, refetch } = useInitQuery()
  useSubscriptionReloadSubscription({
    onSubscriptionData: () => refetch(),
  })

  // const [ selectService, setSelectService ] = useState('')
  const [ state, setState ] = useQsState<{ service: string }>('/')
  const selectService = state.service
  const setSelectService = useCallback((n: string) => setState({
    service: n
  }), [ setState ])
  const [ setServiceState, { loading: submiting } ] = useSetServiceStateMutation()
  const [ selectionKey, setSelectionKey ] = useState<string[]>([])
  useEffect(() => {
    if (data) {
      if (!data.config.service.map(i => i.name).includes(selectService)) {
        setSelectService(data.config.service[0].name)
      }
    }
  }, [data, selectService, setState, setSelectService])

  if (!data || loading) {
    return <Loading loading={loading} />
  }

  const { config: { team, service }, allState } = data
  const dataSource = team.map(({ name, ip }) => ({
    team: name,
    ip,
    state: allState.find(i => i.team.name === name && i.service.name === selectService)?.state ?? State.Ignore
  }))
  const columns: ColumnsType<typeof dataSource[0]> = [{
    title: 'Team name',
    dataIndex: 'team',
    key: 'team',
    render (team, i) {
      return <span>{team} ({i.ip})</span>
    }
  }, {
    title: 'Service status',
    dataIndex: 'state',
    key: 'state',
    render (_, { team, state }) {
      return <StateSelect
        disabled={submiting}
        tooltip={<>
          <div>Team: { team }</div>
          <div>Service: {selectService}</div>
        </>}
        value={state}
        onChange={(state) => {
          setServiceState({
            variables: {
              teamName: team,
              serviceName: selectService,
              state
            }
          })
        }} />
    }
  }]
  const setMulti = (state: State) => async () => {
    let promises = selectionKey.map(teamName => setServiceState({
      variables: {
        teamName,
        serviceName: selectService,
        state
      }
    }))
    await Promise.all(promises)
  }

  return <>
    { error && <>{'Error:' + String(error)} <Button onClick={() => refetch()}>Refetch</Button> </> }
    <div>
      <label>Service name</label>
    </div>
    <div>
      <Radio.Group onChange={e => setSelectService(e.target.value)} value={selectService}>
        {service.map(i => <Tooltip title={<>
          <div>Normal port: {i.normalPort}</div>
          <div>Stealth port: {i.stealthPort}</div>
        </>}>
          <Radio.Button key={i.name} value={i.name}>{i.name}</Radio.Button>
        </Tooltip>)}
      </Radio.Group>
    </div>
    <br />
    <BatchSelect
      onStealth={setMulti(State.Stealth)}
      onNormal={setMulti(State.Normal)}
      onIgnore={setMulti(State.Ignore)}
    />
    <Table
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectionKey,
        onChange: (s) => setSelectionKey(s as string[]),
      }}
      pagination={false}
      rowKey='team'
      columns={columns}
      dataSource={dataSource}
    />
  </>
}

export const NormalView: React.FC = () => {

  return <>
    <div className='App'>
      <ServiceTable />
    </div>
  </>
}
