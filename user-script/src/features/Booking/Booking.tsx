import { Col, Icon, Row, Steps } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import * as api from '../../api/application'
import { EscapeRoom } from '../../interfaces/escapeRoom'
import BookingInfoStep, { BookingInfo } from './BookingInfoStep/BookingInfoStep'
import ConfirmationStep from './ConfirmationStep/ConfirmationStep'
import EscapeRoomStep from './EscapeRoomStep/EscapeRoomStep'
import SuccessStep from './SuccessStep/SuccessStep'
import TimeslotStep, { TimeslotInfo } from './TimeslotStep/TimeslotStep'

const StyledRow = styled(Row)`
  margin-bottom: 20px;
`

const Section = styled.div`
  background: white;
  padding: 20px;
`

enum BookingStep {
  EscapeRoom = 'escape-room',
  Timeslot = 'timeslot',
  BookingInfo = 'booking-info',
  Confirmation = 'confirmation',
  Success = 'success'
}

interface Props {
  organizationId: string
}

// TODO check organization ID for undefined
// TODO show availabilities, and escape room selection
function Booking({ organizationId }: Props) {
  const [step, setStep] = React.useState<BookingStep>(BookingStep.EscapeRoom)

  const [selectedRoom, setSelectedRoom] = React.useState<EscapeRoom>()
  const [bookingInfo, setBookingInfo] = React.useState<BookingInfo>()
  const [timeslot, setTimeslot] = React.useState<TimeslotInfo>()

  const handleSelectEscapeRoom = (room: EscapeRoom) => {
    setSelectedRoom(room)
    setStep(BookingStep.BookingInfo)
  }

  const handleSubmitBookingInfo = (info: BookingInfo) => {
    setBookingInfo(info)
    setStep(BookingStep.Timeslot)
  }

  const handleSelectTimeslot = (timeslotInfo: TimeslotInfo) => {
    setTimeslot(timeslotInfo)
    setStep(BookingStep.Confirmation)
  }

  const handleConfirmation = async () => {
    if (timeslot && selectedRoom && bookingInfo) {
      await api.createBooking({
        ...bookingInfo,
        startDate: timeslot.startDate,
        endDate: timeslot.endDate,
        escapeRoomId: selectedRoom.id
      })
      setStep(BookingStep.Success)
    }
  }

  if (step === BookingStep.Success && selectedRoom && bookingInfo) {
    return (
      <Row>
        <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
          <Section>
            <SuccessStep bookingInfo={bookingInfo} escapeRoom={selectedRoom} />
          </Section>
        </Col>
      </Row>
    )
  }

  const currentStep = {
    [BookingStep.EscapeRoom]: 0,
    [BookingStep.BookingInfo]: 1,
    [BookingStep.Timeslot]: 2,
    [BookingStep.Confirmation]: 3,
    [BookingStep.Success]: 4
  }[step]

  return (
    <Row>
      <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
        <StyledRow>
          <Section>
            <Steps current={currentStep}>
              <Steps.Step title="Escape Room" icon={<Icon type="home" />} />
              <Steps.Step title="Booking Details" icon={<Icon type="contacts" />} />
              <Steps.Step title="Date & Time" icon={<Icon type="calendar" />} />
              <Steps.Step title="Confirmation" icon={<Icon type="credit-card" />} />
            </Steps>
          </Section>
        </StyledRow>
        <Row gutter={24}>
          <Col span={12}>
            <Section>
              {step === BookingStep.EscapeRoom && (
                <EscapeRoomStep organizationId={organizationId} onSelect={handleSelectEscapeRoom} />
              )}
              {step === BookingStep.BookingInfo && (
                <BookingInfoStep onSubmit={handleSubmitBookingInfo} />
              )}
              {step === BookingStep.Timeslot && selectedRoom && (
                <TimeslotStep onSelect={handleSelectTimeslot} room={selectedRoom} />
              )}
              {step === BookingStep.Confirmation && bookingInfo && selectedRoom && (
                <ConfirmationStep
                  bookingInfo={bookingInfo}
                  escapeRoom={selectedRoom}
                  onSubmit={handleConfirmation}
                />
              )}
            </Section>
          </Col>
          <Col span={12}>
            <Section>
              <div>Room: {JSON.stringify(selectedRoom)}</div>
              <div>Info: {JSON.stringify(bookingInfo)}</div>
              <div>Timeslot: {JSON.stringify(timeslot)}</div>
            </Section>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Booking
