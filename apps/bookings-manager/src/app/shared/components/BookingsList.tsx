import { List, Button } from 'antd';
import Text from 'antd/lib/typography/Text';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import { Booking, BookingStatus, EscapeRoom } from '@bookaquest/interfaces';
import { Time } from '@bookaquest/components';
import { useLoading, useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { IconText } from './IconText';
import { BookingStatusIcon } from './BookingStatusIcon';

const BOOKINGS_PER_PAGE = 10;

interface Props {
  loading?: boolean;
  bookings?: Booking[];
  updateBookings?: (bookings: Booking[]) => void;
  onAcceptDone?: () => void;
  onRejectDone?: () => void;
  timeZone?: string;
  pagination?: PaginationConfig | false;
  escapeRooms?: EscapeRoom[];
  onMoreDetails?: (booking: Booking) => void;
}

export function BookingsList({
  bookings,
  timeZone,
  loading,
  pagination,
  onMoreDetails,
  escapeRooms = [],
  updateBookings = () => undefined,
  onAcceptDone = () => undefined,
  onRejectDone = () => undefined
}: Props) {
  const { t } = useI18n();
  const [loadingUpdate, withLoadingUpdate] = useLoading();

  const handleReject = async (booking: Booking) => {
    const updatedBookings = await withLoadingUpdate(
      api.rejectBooking(booking._id)
    );
    updateBookings(updatedBookings);
    onRejectDone();
  };

  const handleAccept = async (booking: Booking) => {
    const updatedBookings = await withLoadingUpdate(
      api.acceptBooking(booking._id)
    );
    updateBookings(updatedBookings);
    onAcceptDone();
  };

  const getEscapeRoom = (id: string) =>
    escapeRooms.find(({ _id }) => _id === id);

  return (
    <>
      <List
        className="w-full"
        loading={loading}
        itemLayout="horizontal"
        dataSource={bookings}
        pagination={
          pagination ??
          (!!bookings &&
            bookings?.length > BOOKINGS_PER_PAGE && {
              pageSize: BOOKINGS_PER_PAGE
            })
        }
        renderItem={booking => {
          const escapeRoom = getEscapeRoom(booking.escapeRoom);
          return (
            <List.Item
              actions={
                booking.status === BookingStatus.Pending &&
                booking.startDate > new Date()
                  ? [
                      <Button
                        key="reject"
                        loading={loadingUpdate}
                        type="danger"
                        onClick={() => handleReject(booking)}
                      >
                        {t`Reject`}
                      </Button>,
                      <Button
                        loading={loadingUpdate}
                        key="accept"
                        type="primary"
                        onClick={() => handleAccept(booking)}
                      >
                        {t`Accept`}
                      </Button>
                    ]
                  : []
              }
            >
              <div className="flex flex-grow">
                <BookingStatusIcon
                  status={booking.status}
                  className="mr-4 mt-1 text-4xl"
                />
                <div>
                  <List.Item.Meta
                    title={
                      escapeRoom ? (
                        <Text strong>
                          <Time
                            date={[booking.startDate, booking.endDate]}
                            timeZone={timeZone}
                          />
                          {' | '}
                          {escapeRoom.name} | {booking.name}
                        </Text>
                      ) : (
                        <Text strong>{booking.name}</Text>
                      )
                    }
                    description={
                      <Time
                        date={booking.startDate}
                        type="date"
                        timeZone={timeZone}
                      />
                    }
                  />
                  <div className="flex mt-2">
                    <IconText
                      className="mr-4"
                      title={t`Price`}
                      text={booking.price}
                      icon="dollar"
                    />
                    <IconText
                      title={t`Participants`}
                      text={booking.participants}
                      icon="team"
                    />
                    {onMoreDetails && (
                      <Button
                        type="link"
                        onClick={() => onMoreDetails(booking)}
                      >{t`More details`}</Button>
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </>
  );
}
