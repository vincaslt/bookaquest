import { Button, Modal } from 'antd';
import * as React from 'react';
import { Booking, EscapeRoom, BookingStatus } from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import { BookingsList } from '../BookingsList';
import { BookingStatusIcon } from '../BookingStatusIcon';
import { BookingDetails } from './BookingDetails';

interface Props {
  visible: boolean;
  selectedBookings: Booking[];
  updateBookings: (bookings: Booking[]) => void;
  escapeRooms: EscapeRoom[];
  onClose: () => void;
  timeZone?: string;
}

// TODO: if there are more than 1 booking on the same time when accepting, request to enter rejection message for other bookings
export function BookingModal({
  updateBookings,
  visible,
  selectedBookings,
  onClose,
  timeZone,
  escapeRooms
}: Props) {
  const { t } = useI18n(); // TODO: extend parser to support tt syntax: tt({ count })`Something n`
  const [loading, withLoading] = useLoading();
  const [bookings, setBookings] = React.useState(selectedBookings);

  React.useEffect(() => {
    if (selectedBookings.length > 0) {
      setBookings(selectedBookings);
    }
  }, [selectedBookings]);

  const handleReject = async (booking: Booking) => {
    const updatedBookings = await withLoading(api.rejectBooking(booking._id));
    updateBookings(updatedBookings);
    onClose();
  };

  const handleAccept = async (booking: Booking) => {
    const updatedBookings = await withLoading(api.acceptBooking(booking._id));
    updateBookings(updatedBookings);
    onClose();
  };

  const isPending =
    bookings.some(({ status }) => status === BookingStatus.Pending) &&
    bookings.every(({ startDate }) => startDate > new Date());
  const isSingleBooking = bookings.length === 1;
  const firstBooking = bookings[0];
  const escapeRoom =
    firstBooking &&
    escapeRooms.find(({ _id }) => _id === firstBooking.escapeRoom);

  return (
    <Modal
      title={
        isSingleBooking ? (
          <div className="flex items-center">
            <BookingStatusIcon
              className="text-xl mr-2"
              status={firstBooking.status}
            />
            {firstBooking.name}
          </div>
        ) : (
          t`Reservations`
        )
      }
      width={630}
      onCancel={onClose}
      visible={visible}
      footer={[
        <Button
          disabled={loading}
          key="back"
          onClick={onClose}
        >{t`Back`}</Button>,
        isSingleBooking && isPending && (
          <Button
            key="reject"
            loading={loading}
            type="danger"
            onClick={() => handleReject(bookings[0])}
          >
            {t`Reject`}
          </Button>
        ),
        isSingleBooking && isPending && (
          <Button
            key="accept"
            loading={loading}
            type="primary"
            onClick={() => handleAccept(bookings[0])}
          >
            {t`Accept`}
          </Button>
        )
      ]}
    >
      {isSingleBooking && escapeRoom && firstBooking ? (
        <BookingDetails
          booking={firstBooking}
          escapeRoom={escapeRoom}
          timeZone={timeZone}
        />
      ) : (
        <BookingsList
          pagination={false}
          timeZone={timeZone}
          bookings={bookings}
          loading={loading}
          updateBookings={updateBookings}
          escapeRooms={escapeRooms}
        />
      )}
    </Modal>
  );
}
