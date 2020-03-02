import { Card, Divider, Icon, Row, Col } from 'antd';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import AspectRatio from 'react-aspect-ratio';
import { useMeasure } from 'react-use';
import * as React from 'react';
import { EscapeRoom, Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { DifficultyIndicator } from '@bookaquest/components';

interface Props {
  selectedRoom?: EscapeRoom;
  organization?: Organization;
}

export function BookingSummary({ organization, selectedRoom }: Props) {
  const { t } = useI18n();
  const [containerRef, { width }] = useMeasure();

  if (!selectedRoom) {
    return null;
  }

  const [minParticipants, maxParticipants] = selectedRoom.participants;

  return (
    <Row gutter={16}>
      <Col lg={12}>
        <Title level={3}>{selectedRoom.name}</Title>
        <div className="flex flex-wrap font-semibold" ref={containerRef}>
          <div className="mb-4 flex items-center">
            <Icon type="team" className="flex mr-1" />
            {width > 320
              ? t`${minParticipants}-${maxParticipants} players`
              : `${minParticipants}-${maxParticipants}`}
            <Divider type="vertical" />
          </div>
          <div className="mb-4 flex items-center">
            <Icon type="clock-circle" className="flex mr-1" />
            {t`${selectedRoom.interval} min`}
            <Divider type="vertical" />
          </div>
          <div className="mb-4 flex items-center">
            {width > 280 && <span className="mr-2">{t`Difficulty`}</span>}
            <DifficultyIndicator difficulty={selectedRoom.difficulty} />
          </div>
        </div>
        <Paragraph>{selectedRoom.description}</Paragraph>
      </Col>

      <Col sm={14} md={16} lg={12}>
        <Card
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
              <div className="overflow-auto">
                <div className="mb-2 mr-4 flex items-baseline">
                  <Icon type="home" className="flex mr-2" />
                  {selectedRoom.location}
                </div>
                {organization?.phoneNumber && (
                  <div className="mb-2 flex items-center">
                    <Icon type="phone" className="flex mr-2" />
                    {organization?.phoneNumber}
                  </div>
                )}
                {organization?.email && (
                  <div className="mb-2 flex items-center">
                    <Icon type="mail" className="flex mr-2" />
                    {organization?.email}
                  </div>
                )}
                {organization?.website && (
                  <div className="mb-2 flex items-center">
                    <Icon type="link" className="flex mr-2" />
                    {organization?.website}
                  </div>
                )}
              </div>
            }
          />
        </Card>
      </Col>
    </Row>
  );
}
