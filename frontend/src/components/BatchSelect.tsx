import React from 'react'
import { Button } from 'antd'
import { State } from '../generated/graphql'

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

type BatchSelectProps = {
  onStealth: () => void
  onNormal: () => void
  onIgnore: () => void
}

export const BatchSelect: React.FC<BatchSelectProps> = ({ onStealth, onNormal, onIgnore }) => {
  return <>
    <Button style={StateStyle[State.Stealth]} onClick={onStealth}>STEALTH</Button>
    <Button style={StateStyle[State.Normal]} onClick={onNormal}>Normal</Button>
    <Button style={StateStyle[State.Ignore]} onClick={onIgnore}>Ignore</Button>
  </>
}
