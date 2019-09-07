import { Card, Col, Row, Spin } from 'antd'
import splitEvery from 'ramda/es/splitEvery'
import * as React from 'react'
import styled from 'styled-components'
import * as api from '../../../api/application'
import { EscapeRoom } from '../../../interfaces/escapeRoom'

const Centered = styled.div`
  display: flex;
  justify-content: center;
`

const StyledRow = styled(Row)`
  margin-bottom: 16px;
`

interface Props {
  organizationId: string
  onSelect: (room: EscapeRoom) => void
}

function EscapeRoomStep({ organizationId, onSelect }: Props) {
  const [loading, setLoading] = React.useState(true)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  React.useEffect(() => {
    api
      .getEscapeRooms(organizationId)
      .then(setEscapeRooms)
      .finally(() => setLoading(false))
  }, [])

  const rows = splitEvery(3, escapeRooms)

  return loading ? (
    <Centered>
      <Spin />
    </Centered>
  ) : (
    <>
      {rows.map((row, i) => (
        <StyledRow type="flex" gutter={16} key={i}>
          {row.map(escapeRoom => (
            <Col span={8} key={escapeRoom.id}>
              <Card onClick={() => onSelect(escapeRoom)} hoverable title={escapeRoom.name}>
                {escapeRoom.description}
              </Card>
            </Col>
          ))}
        </StyledRow>
      ))}
    </>
  )
}

export default EscapeRoomStep
