import { Button, Modal } from 'antd';
import * as React from 'react';
import * as api from '../../api/application';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';

interface Props {
  booking: Booking;
  setBookings: (bookings: (bookings: Booking[]) => Booking[]) => void;
  onClose: () => void;
}

export function PendingEventModal({ setBookings, booking, onClose }: Props) {
  const { t } = useI18n();
  const [loading, withLoading] = useLoading();

  const handleReject = async () => {
    const updatedBooking = await withLoading(api.rejectBooking(booking.id));
    setBookings(bookings =>
      bookings.map(b => (booking.id === updatedBooking.id ? updatedBooking : b))
    );
    onClose();
  };

  const handleAccept = async () => {
    const updatedBooking = await withLoading(api.acceptBooking(booking.id));
    setBookings(bookings =>
      bookings.map(b => (booking.id === updatedBooking.id ? updatedBooking : b))
    );
    onClose();
  };

  return (
    <Modal
      onCancel={onClose}
      visible={booking.status === BookingStatus.Pending}
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
      <div>{booking.name}</div>
      <div>{booking.email}</div>
    </Modal>
  );
}
