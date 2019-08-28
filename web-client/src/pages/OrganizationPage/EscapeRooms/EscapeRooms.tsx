import { Button, Card, Col, Row, Spin } from 'antd'
import splitEvery from 'ramda/es/splitEvery'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import * as api from '../../../api/application'
import { EscapeRoom } from '../../../interfaces/escapeRoom'
import useLoading from '../../../shared/hooks/useLoading'
import CreateEscapeRoom from './CreateEscapeRoom'
import NoEscapeRooms from './NoEscapeRooms'

const CenteredContainer = styled.div`
  text-align: center;
`

const Toolbar = styled.div`
  margin-bottom: 16px;
`

const StyledRow = styled(Row)`
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`

interface Props {
  organizationId: string
}

function EscapeRooms({ organizationId }: Props) {
  const { t } = useTranslation()
  const [isLoading, withLoading] = useLoading(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  React.useEffect(() => {
    withLoading(api.getEscapeRooms(organizationId).then(setEscapeRooms))
  }, [])

  const handleCreateClick = () => setIsCreating(true)
  const handleCancel = () => setIsCreating(false)
  const handleCreateDone = (escapeRoom: EscapeRoom) => {
    setEscapeRooms(rooms => [...rooms, escapeRoom])
    setIsCreating(false)
  }

  if (isLoading) {
    return (
      <CenteredContainer>
        <Spin />
      </CenteredContainer>
    )
  }

  if (isCreating) {
    return (
      <CreateEscapeRoom
        onCancel={handleCancel}
        onCreateDone={handleCreateDone}
        organizationId={organizationId}
      />
    )
  }

  return escapeRooms.length > 0 ? (
    <>
      <Toolbar>
        <Button onClick={handleCreateClick}>{t('New Escape Room')}</Button>
      </Toolbar>
      {splitEvery(3, escapeRooms).map((row, i) => (
        <StyledRow key={i} gutter={16}>
          {row.map(escapeRoom => (
            <Col key={escapeRoom.id} span={8}>
              <Card title={escapeRoom.name}>{escapeRoom.description}</Card>
            </Col>
          ))}
        </StyledRow>
      ))}
    </>
  ) : (
    <NoEscapeRooms onClickCTA={handleCreateClick} />
  )
}

export default EscapeRooms
