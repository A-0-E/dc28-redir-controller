import React from 'react'
import { State } from '../generated/graphql'
import { Select } from 'antd'

const { Option } = Select

type StateSelectProps = {
  value: State,
  onChange: (s: State) => void,
}

const StateStyle: Record<State, React.CSSProperties> = {
  [State.Ignore]: {
    background: '#fff',
    color: '#000',
  },
  [State.Stealth]: {
    background: '#e54545',
    color: '#fff',
  },
  [State.Normal]: {
    background: '#0ABF5B',
    color: '#fff',
  },
}

export const StateSelect: React.FC<StateSelectProps> = ({ value, onChange }) => {
  return <>
    <Select
      value={value}
      onChange={onChange}
      bordered={false}
      style={StateStyle[value]}
    >
      { Object.values(State).map(v => <Option style={StateStyle[v]} key={v} value={v}>{v}</Option>) }
    </Select>
  </>
}
