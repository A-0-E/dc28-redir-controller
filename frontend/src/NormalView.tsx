import React, { useState } from 'react'
import { useInitQuery, InitQuery, useSubscriptionConfigSubscription, useSubscriptionServiceStateSubscription } from './generated/graphql'
import { Loading } from './components/Loading'
import { Radio, Button } from 'antd'

const ServiceTable: React.FC<InitQuery> = ({ config: { service } }) => {
  useSubscriptionConfigSubscription()
  useSubscriptionServiceStateSubscription()

  const [ selectService, setSelectService ] = useState(service[0].name)
  // const [ setServiceState ] = useSetServiceStateMutation()

  return <>
    <div>
      <label>Service name</label>
    </div>
    <div>
      <Radio.Group onChange={e => setSelectService(e.target.value)} value={selectService}>
        {service.map(i => <Radio.Button key={i.name} value={i.name}>{i.name}</Radio.Button>)}
      </Radio.Group>
    </div>
    <br />
    <Button>STEALTH</Button>
  </>
}

export const NormalView: React.FC = () => {
  const { loading, data, error } = useInitQuery()

  return <>
    <div className='App'>
      { error && 'Error:' + String(error) }
      { loading ? <Loading /> : <ServiceTable {...data!} /> }
    </div>
  </>
}
