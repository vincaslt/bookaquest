import { List } from 'antd'
import * as React from 'react'
import AspectRatio from 'react-aspect-ratio'
import styled from 'styled-components'
import EscapeRoomCard from '~/../commons/components/EscapeRoomCard'
import useLoading from '~/../commons/hooks/useLoading'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import Section from '../../shared/layout/Section'
import CreateEscapeRoomForm from './CreateEscapeRoomForm'
import NoEscapeRooms from './NoEscapeRooms'

const NewEscapeRoomCard = styled.button`
  background-color: white;
  color: rgba(0, 0, 0, 0.45);
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  transition: border-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: #40a9ff;
  }
`

interface Props {
  organization?: Organization
}

function EscapeRooms({ organization }: Props) {
  const { t } = useI18n()
  const [isLoading, withLoading] = useLoading(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  const organizationId = organization && organization.id

  React.useEffect(() => {
    if (organizationId) {
      withLoading(api.getEscapeRooms(organizationId).then(setEscapeRooms))
    }
  }, [organizationId])

  const handleCreateClick = () => setIsCreating(true)
  const handleCancel = () => setIsCreating(false)
  const handleCreateDone = (escapeRoom: EscapeRoom) => {
    setEscapeRooms(rooms => [...rooms, escapeRoom])
    setIsCreating(false)
  }

  if (isCreating && organization) {
    return (
      <Section>
        <CreateEscapeRoomForm
          onCancel={handleCancel}
          onCreateDone={handleCreateDone}
          organization={organization}
        />
      </Section>
    )
  }

  return escapeRooms.length > 0 || isLoading ? (
    <>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4
        }}
        loading={isLoading}
        dataSource={[...escapeRooms, 'new']}
        renderItem={item => (
          <List.Item>
            {typeof item === 'string' ? (
              organization && (
                <AspectRatio ratio="532/320">
                  <NewEscapeRoomCard onClick={handleCreateClick}>
                    {t`New Escape Room`}
                  </NewEscapeRoomCard>
                </AspectRatio>
              )
            ) : (
              <EscapeRoomCard escapeRoom={item} />
            )}
          </List.Item>
        )}
      />
    </>
  ) : (
    <Section>
      <NoEscapeRooms onClickCTA={handleCreateClick} />
    </Section>
  )
}

export default EscapeRooms