import { Button, Modal } from 'antd';
import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import { BookingDetails } from './BookingDetails';
import { BookingsList } from '../../../shared/components/BookingsList';

interface Props {
  visible: boolean;
  selectedBookings: Booking[];
  updateBookings: (bookings: Booking[]) => void;
  onClose: () => void;
  timeZone?: string;
}

// TODO: if there are more than 1 booking on the same time when accepting, request to enter rejection message for other bookings
export function BookingModal({
  updateBookings,
  visible,
  selectedBookings,
  onClose,
  timeZone
}: Props) {
  const { i18n, t } = useI18n(); // TODO: extend parser to support tt syntax: tt({ count })`Something n`
  const [loading, withLoading] = useLoading();
  const [bookings, setSelectedBookings] = React.useState(selectedBookings);

  React.useEffect(() => {
    if (selectedBookings.length > 0) {
      setSelectedBookings(selectedBookings);
    }
  }, [selectedBookings]);

  const handleReject = async (booking: Booking) => {
    const updatedBookings = await withLoading(api.rejectBooking(booking._id));
    updateBookings(updatedBookings);
    if (selectedBookings.length === 1) {
      onClose();
    }
  };

  const handleAccept = async (booking: Booking) => {
    const updatedBookings = await withLoading(api.acceptBooking(booking._id));
    updateBookings(updatedBookings);
    onClose();
  };

  const isSingleBooking = bookings.length === 1;

  return (
    <Modal
      title={i18n.t('Pending booking(s)', { count: bookings.length })}
      onCancel={onClose}
      visible={visible}
      footer={[
        <Button key="back" onClick={onClose}>{t`Back`}</Button>,
        isSingleBooking && (
          <Button
            key="reject"
            loading={loading}
            type="danger"
            onClick={() => handleReject(bookings[0])}
          >
            {t`Reject`}
          </Button>
        ),
        isSingleBooking && (
          <Button
            key="accept"
            type="primary"
            onClick={() => handleAccept(bookings[0])}
          >
            {t`Accept`}
          </Button>
        )
      ]}
    >
      {isSingleBooking ? (
        <BookingDetails />
      ) : (
        <BookingsList
          pagination={false}
          timeZone={timeZone}
          bookings={bookings}
          loading={loading}
          updateBookings={updateBookings}
        />
      )}
    </Modal>
  );
}
