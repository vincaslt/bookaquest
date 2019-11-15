import { Card } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import * as React from 'react';
import AspectRatio from 'react-aspect-ratio';
import styled from 'styled-components';
import { CreateEscapeRoom, EscapeRoom } from '@bookaquest/interfaces';

const StyledParagraph = styled(Paragraph)`
  min-height: 105px;
`;

interface Props {
  escapeRoom: EscapeRoom | CreateEscapeRoom;
  onSelect?: (escapeRoom: EscapeRoom) => void;
}

export function EscapeRoomCard({ escapeRoom, onSelect }: Props) {
  const handleSelect = () => {
    if (onSelect && 'id' in escapeRoom) {
      onSelect(escapeRoom);
    }
  };

  return (
    <Card
      hoverable={!!onSelect}
      onClick={handleSelect}
      cover={
        <AspectRatio ratio="532/320">
          <img
            className="object-cover"
            src={escapeRoom.images[0]}
            alt={`${escapeRoom.name} cover`}
          />
        </AspectRatio>
      }
    >
      <Card.Meta
        title={escapeRoom.name}
        description={
          <StyledParagraph ellipsis={{ rows: 5 }}>
            {escapeRoom.description}
          </StyledParagraph>
        }
      />
    </Card>
  );
}
