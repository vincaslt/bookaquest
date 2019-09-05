import { Card, Col, Row } from 'antd'
import splitEvery from 'ramda/es/splitEvery'
import * as React from 'react'
import styled from 'styled-components'
import { EscapeRoom } from '../interfaces/escapeRoom'

const StyledRow = styled(Row)`
  margin-bottom: 16px;
`

// TODO: better selected style
const SelectableCard = styled(Card)`
  ${({ selected }: { selected?: boolean }) => (selected ? 'border-color: blue' : '')};
`

interface Props {
  escapeRooms: EscapeRoom[]
  selectedId: string
  onSelect: (id: string) => void
}

function EscapeRoomPicker({ escapeRooms, selectedId, onSelect }: Props) {
  const rows = splitEvery(3, escapeRooms)

  return (
    <>
      {rows.map((row, i) => (
        <StyledRow type="flex" gutter={16} key={i}>
          {row.map(escapeRoom => (
            <Col span={8} key={escapeRoom.id}>
              <SelectableCard
                selected={selectedId === escapeRoom.id}
                onClick={() => onSelect(escapeRoom.id)}
                hoverable
                title={escapeRoom.name}
              >
                {escapeRoom.description}
              </SelectableCard>
            </Col>
          ))}
        </StyledRow>
      ))}
    </>
  )
}

export default EscapeRoomPicker
