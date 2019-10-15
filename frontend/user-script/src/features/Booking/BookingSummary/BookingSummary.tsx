import { Card, Typography } from 'antd'
import * as React from 'react'
import AspectRatio from 'react-aspect-ratio'
import styled from 'styled-components'
import WorkHours from '~/../commons/components/WorkHours'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { useI18n } from '~/../commons/utils/i18n'

const { Title, Paragraph } = Typography

const StyledCard = styled(Card)`
  min-width: 40%;
  max-width: 300px;
`

interface Props {
  selectedRoom?: EscapeRoom
}

function BookingSummary({ selectedRoom }: Props) {
  const { t } = useI18n()

  if (!selectedRoom) {
    return null
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Title level={3}>{selectedRoom.name}</Title>
          <Paragraph>{selectedRoom.description}</Paragraph>
        </div>
        <StyledCard
          className="ml-5 mb-5"
          cover={
            <AspectRatio ratio="532/320">
              <img className="object-cover" src={selectedRoom.images[0]} />
            </AspectRatio>
          }
        >
          <Card.Meta
            title={t`Work hours`}
            description={<WorkHours businessHours={selectedRoom.businessHours} />}
          />
        </StyledCard>
      </div>
      <div>Location: {selectedRoom.location}</div>
    </>
  )
}

export default BookingSummary
