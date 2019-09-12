import { Card } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import * as React from 'react'
import AspectRatio from 'react-aspect-ratio'
import styled from 'styled-components'
import { EscapeRoom } from '../interfaces/escapeRoom'

const CoverImage = styled.img`
  object-fit: cover;
`

interface Props {
  escapeRoom: EscapeRoom
}

function EscapeRoomCard({ escapeRoom }: Props) {
  return (
    <Card
      cover={
        <AspectRatio ratio="532/320">
          <CoverImage src={escapeRoom.images[0]} alt={`${escapeRoom.name} cover image`} />
        </AspectRatio>
      }
    >
      <Card.Meta
        title={escapeRoom.name}
        description={<Paragraph ellipsis={{ rows: 5 }}>{escapeRoom.description}</Paragraph>}
      />
    </Card>
  )
}

export default EscapeRoomCard
