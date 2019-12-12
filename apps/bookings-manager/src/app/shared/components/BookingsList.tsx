import { List, Button, Icon } from 'antd';
import { green, blue, red, orange } from '@ant-design/colors';
import Text from 'antd/lib/typography/Text';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { Time } from '@bookaquest/components';
import { useLoading, useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';

const BOOKINGS_PER_PAGE = 10;

interface Props {
  loading: boolean;
  bookings?: Booking[];
  updateBookings?: (bookings: Booking[]) => void;
  onAcceptDone?: () => void;
  onRejectDone?: () => void;
  timeZone?: string;
  pagination?: PaginationConfig | false;
}

export function BookingsList({
  bookings,
  timeZone,
  loading,
  pagination,
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

  const icons = {
    [BookingStatus.Accepted]: (
      <Icon
        className="mr-4 text-4xl"
        title={t`Accepted`}
        type="check-circle"
        theme="twoTone"
        twoToneColor={green[3]}
      />
    ),
    [BookingStatus.Pending]: (
      <Icon
        className="mr-4 text-4xl"
        title={t`Pending`}
        type="question-circle"
        theme="twoTone"
        twoToneColor={blue[3]}
      />
    ),
    [BookingStatus.Rejected]: (
      <Icon
        className="mr-4 text-4xl"
        title={t`Rejected`}
        type="close-circle"
        theme="twoTone"
        twoToneColor={red[3]}
      />
    ),
    [BookingStatus.Canceled]: (
      <Icon
        className="mr-4 text-4xl"
        title={t`Canceled`}
        type="minus-circle"
        theme="twoTone"
        twoToneColor={orange[3]}
      />
    )
  };

  return (
    <>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={bookings}
        pagination={
          pagination ?? {
            pageSize: BOOKINGS_PER_PAGE
          }
        }
        renderItem={booking => (
          <List.Item
            actions={
              booking.status === BookingStatus.Pending
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
            <div className="flex items-center">
              {icons[booking.status]}
              <List.Item.Meta
                title={<Text strong>{booking.name}</Text>}
                description={
                  <>
                    <Time
                      date={booking.startDate}
                      type="date"
                      timeZone={timeZone}
                    />{' '}
                    <Time
                      date={[booking.startDate, booking.endDate]}
                      timeZone={timeZone}
                    />{' '}
                    {booking.status}
                  </>
                }
              />
            </div>
          </List.Item>
        )}
      />
    </>
  );
}
