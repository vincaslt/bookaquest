import { Card, Divider, Icon } from 'antd';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import AspectRatio from 'react-aspect-ratio';
import times from 'ramda/es/times';
import * as React from 'react';
import styled from 'styled-components';
import { EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';

const StyledCard = styled(Card)`
  min-width: 40%;
  max-width: 300px;
`;

interface Props {
  selectedRoom?: EscapeRoom;
}

// ! TODO: show currency and allow selection in manager app
export function BookingSummary({ selectedRoom }: Props) {
  const { t } = useI18n();

  if (!selectedRoom) {
    return null;
  }

  const [minParticipants, maxParticipants] = selectedRoom.participants;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Title level={3}>{selectedRoom.name}</Title>
          <div className="flex flex-wrap font-semibold">
            <div className="mb-4 flex items-baseline">
              <Icon type="team" className="flex mr-1" />
              {t`${minParticipants}-${maxParticipants} players`}
              <Divider type="vertical" />
            </div>
            <div className="mb-4 flex items-baseline">
              <Icon type="clock-circle" className="flex mr-1" />
              {t`${selectedRoom.interval} min`}
              <Divider type="vertical" />
            </div>
            <div className="mb-4 flex items-center">
              {t`Difficulty`}
              <div className="ml-2 flex items-center">
                {times(
                  i => (
                    <Icon key={i} type="lock" theme="filled" />
                  ),
                  selectedRoom.difficulty
                )}
                {times(
                  i => (
                    <Icon key={i} type="lock" />
                  ),
                  5 - selectedRoom.difficulty
                )}
              </div>
            </div>
          </div>
          <Paragraph>{selectedRoom.description}</Paragraph>
        </div>
        <div>
          <StyledCard
            className="ml-5 mb-5"
            cover={
              <AspectRatio ratio="532/320">
                <img
                  className="object-cover"
                  src={selectedRoom.images[0]}
                  alt={t`Escape room`}
                />
              </AspectRatio>
            }
          >
            <Card.Meta
              title={t`Contacts`}
              description={
                <>
                  <div className="mb-2 mr-4 flex items-baseline">
                    <Icon type="home" className="flex mr-2" theme="filled" />
                    {selectedRoom.location}
                  </div>
                  <div className="mb-2 flex items-center">
                    <Icon type="phone" className="flex mr-2" theme="filled" />
                    +1234567890
                  </div>
                  <div className="mb-2 flex items-center">
                    <Icon type="mail" className="flex mr-2" theme="filled" />
                    support@escapium.com
                  </div>
                  <div className="mb-2 flex items-center">
                    <Icon type="skype" className="flex mr-2" theme="filled" />
                    escapium
                  </div>
                </>
              }
            />
          </StyledCard>
        </div>
      </div>
    </>
  );
}
