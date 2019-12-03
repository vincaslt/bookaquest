import { Button, Modal } from 'antd';
import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';
import * as api from '../../api/application';

interface Props {
  visible: boolean;
  selectedBooking?: Booking;
  setBookings: (bookings: (bookings: Booking[]) => Booking[]) => void;
  onClose: () => void;
}

// TODO: if there are more than 1 booking on the same time when accepting, request to enter rejection message for other bookings and reject them in backend
export function PendingBookingModal({
  setBookings,
  visible,
  selectedBooking,
  onClose
}: Props) {
  const { t } = useI18n();
  const [loading, withLoading] = useLoading();
  const [booking, setBooking] = React.useState(selectedBooking);

  React.useEffect(() => {
    if (selectedBooking) {
      setBooking(selectedBooking);
    }
  }, [selectedBooking]);

  const handleReject = async () => {
    if (!booking) {
      return;
    }
    const updatedBooking = await withLoading(api.rejectBooking(booking._id));
    setBookings(bookings =>
      bookings.filter(({ _id }) => _id !== updatedBooking._id)
    );
    onClose();
  };

  const handleAccept = async () => {
    if (!booking) {
      return;
    }
    const updatedBooking = await withLoading(api.acceptBooking(booking._id));
    setBookings(bookings =>
      bookings.map(b => (b._id === updatedBooking._id ? updatedBooking : b))
    );
    onClose();
  };

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      footer={[
        <Button key="back" onClick={onClose}>{t`Back`}</Button>,
        <Button
          key="reject"
          loading={loading}
          type="danger"
          onClick={handleReject}
        >
          {t`Reject`}
        </Button>,
        <Button key="accept" type="primary" onClick={handleAccept}>
          {t`Accept`}
        </Button>
      ]}
    >
      {booking && (
        <>
          <div>{booking.name}</div>
          <div>{booking.email}</div>
        </>
      )}
    </Modal>
  );
}
