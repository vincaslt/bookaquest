import { Button, Modal, List } from 'antd';
import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';
import * as api from '../../api/application';

interface Props {
  visible: boolean;
  selectedBookings: Booking[];
  setBookings: (bookings: (bookings: Booking[]) => Booking[]) => void;
  onClose: () => void;
}

// TODO: if there are more than 1 booking on the same time when accepting, request to enter rejection message for other bookings and reject them in backend
export function PendingBookingModal({
  setBookings,
  visible,
  selectedBookings,
  onClose
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
    const updatedBooking = await withLoading(api.rejectBooking(booking._id));
    setBookings(prev => prev.filter(({ _id }) => _id !== updatedBooking._id));
    if (bookings.length === 1) {
      onClose();
    }
  };

  const handleAccept = async (booking: Booking) => {
    const updatedBooking = await withLoading(api.acceptBooking(booking._id));
    setBookings(prev =>
      prev.map(b => (b._id === updatedBooking._id ? updatedBooking : b))
    );
    if (bookings.length === 1) {
      onClose();
    }
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
      <List>
        {bookings.map(booking => (
          <List.Item
            key={booking._id}
            actions={
              !isSingleBooking
                ? [
                    <Button
                      key="reject"
                      loading={loading}
                      type="danger"
                      onClick={() => handleReject(booking)}
                    >
                      {t`Reject`}
                    </Button>,
                    <Button
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
            <List.Item.Meta title={booking.name} description={booking.email} />
            <div>
              {booking.participants} - {booking.price}
            </div>
          </List.Item>
        ))}
      </List>
    </Modal>
  );
}
