import { Statistic, Icon } from 'antd';
import { green } from '@ant-design/colors';
import { Trans } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import AspectRatio from 'react-aspect-ratio';
import Text from 'antd/lib/typography/Text';
import * as React from 'react';
import { Booking, EscapeRoom, BookingStatus } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { Time, DifficultyIndicator } from '@bookaquest/components';
import styled from 'styled-components';

const EscapeRoomImageContainer = styled.div`
  width: 150px;
`;

interface Props {
  booking: Booking;
  escapeRoom: EscapeRoom;
  timeZone?: string;
}

export function BookingDetails({ booking, escapeRoom, timeZone }: Props) {
  const { t } = useI18n();

  const statusText = {
    [BookingStatus.Accepted]: t`Accepted`,
    [BookingStatus.Pending]: t`Pending`,
    [BookingStatus.Rejected]: t`Rejected`,
    [BookingStatus.Canceled]: t`Canceled`
  }[booking.status];

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <Title level={4}>
        <Trans>
          Booking for{' '}
          <Time
            date={[booking.startDate, booking.endDate]}
            type={{ format: 'PPPp' }}
            timeZone={timeZone}
          />
        </Trans>
      </Title>
      {localTimeZone !== timeZone && <Text>{t`Timezone: ${timeZone}`}</Text>}
      <div className="flex justify-between mt-8">
        <Statistic className="mr-4" title={t`Status`} value={statusText} />
        <Statistic
          className="mr-4"
          title={t`Price`}
          value={booking.price}
          precision={2}
          valueStyle={{ color: green[6] }}
          suffix="$"
        />
        <Statistic
          className="mr-4"
          title={t`Participants`}
          value={`${booking.participants} / ${escapeRoom.participants[1]}`}
        />
      </div>

      <div className="flex mt-8">
        <EscapeRoomImageContainer>
          <AspectRatio ratio="532/320">
            <img
              className="object-cover"
              src={escapeRoom.images[0]}
              alt={`${escapeRoom.name} cover`}
            />
          </AspectRatio>
        </EscapeRoomImageContainer>
        <div className="pl-2">
          <div className="font-semibold text-lg">{escapeRoom.name}</div>
          <div className="flex items-center">
            <Icon type="team" className="flex mr-1" />
            {t`${escapeRoom.participants[0]}-${escapeRoom.participants[1]} players`}
          </div>
          <div className="flex items-center">
            <Icon type="clock-circle" className="flex mr-1" />
            {t`${escapeRoom.interval} min`}
          </div>
          <div className="flex items-center">
            {t`Difficulty`}
            <DifficultyIndicator
              className="ml-2"
              difficulty={escapeRoom.difficulty}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <Text strong className="mr-2">{t`Name:`}</Text>
          {booking.name}
        </div>
        <div>
          <Text strong className="mr-2">{t`Phone:`}</Text>
          <a href={`tel:${booking.phoneNumber}`}>{booking.phoneNumber}</a>
        </div>
        <div>
          <Text strong className="mr-2">{t`Email:`}</Text>
          <a href={`mailto:${booking.email}`}>{booking.email}</a>
        </div>
        <div>
          <Text strong className="mr-2">{t`Booked at:`}</Text>
          <Time
            date={booking.createdAt}
            type={{ format: 'PPPp' }}
            timeZone={timeZone}
          />
        </div>
        <div>
          <Text strong className="mr-2">{t`Booking id:`}</Text>
          <Text copyable>{booking._id}</Text>
        </div>
      </div>
    </>
  );
}
