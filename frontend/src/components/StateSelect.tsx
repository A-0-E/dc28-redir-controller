import React from 'react'
import { State } from '../generated/graphql'
import { Select, Tooltip } from 'antd'

const { Option } = Select

type StateSelectProps = {
  value: State,
  onChange: (s: State) => void,
  tooltip?: React.ReactNode
  disabled?: boolean
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

export const StateSelect: React.FC<StateSelectProps> = ({ value, onChange, tooltip, disabled }) => {
  return <>
    <Tooltip placement='left' title={tooltip}>
      <Select
        disabled={disabled}
        value={value}
        onChange={onChange}
        bordered={false}
        style={StateStyle[value]}
      >
        { Object.values(State).map(v => <Option style={StateStyle[v]} key={v} value={v}>{v}</Option>) }
      </Select>
    </Tooltip>
  </>
}
