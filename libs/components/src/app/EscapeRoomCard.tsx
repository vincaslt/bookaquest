import { Card } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import AspectRatio from 'react-aspect-ratio';
import * as React from 'react';
import styled from 'styled-components';
import { CreateEscapeRoom, EscapeRoom } from '@bookaquest/interfaces';

const StyledParagraph = styled(Paragraph)`
  min-height: 105px;
`;

interface Props {
  escapeRoom:
    | EscapeRoom
    | (Omit<CreateEscapeRoom, 'image'> & {
        images: string[];
      });
  onSelect?: (escapeRoom: EscapeRoom) => void;
}

export function EscapeRoomCard({ escapeRoom, onSelect }: Props) {
  const src = escapeRoom.images[0];

  const [imgSrc, setImgSrc] = React.useState(
    src || 'https://placehold.it/532x320'
  );

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleSelect = () => {
    if (onSelect && '_id' in escapeRoom) {
      onSelect(escapeRoom);
    }
  };

  return (
    <Card
      bordered={!('_id' in escapeRoom)}
      hoverable={!!onSelect}
      onClick={handleSelect}
      cover={
        <AspectRatio ratio="532/320">
          <img
            onError={() => setImgSrc('https://placehold.it/532x320')}
            className="object-cover"
            src={imgSrc}
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
