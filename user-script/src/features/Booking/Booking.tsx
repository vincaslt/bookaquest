import { Col, Icon, Row, Steps } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { EscapeRoom } from '../../interfaces/escapeRoom'
import BookingInfoStep, { BookingInfo } from './BookingInfoStep/BookingInfoStep'
import EscapeRoomStep from './EscapeRoomStep/EscapeRoomStep'
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
  Payment = 'payment'
}

interface Props {
  organizationId: string
}

// TODO: three step form
// TODO check organization ID for undefined
// TODO show availabilities, and escape room selection
function Booking({ organizationId }: Props) {
  const [step, setStep] = React.useState<BookingStep>(BookingStep.EscapeRoom)

  const [selectedRoom, setSelectedRoom] = React.useState<EscapeRoom>()
  const [bookingInfo, setBookingInfo] = React.useState<BookingInfo>()
  const [timeslot, setTimeslot] = React.useState<TimeslotInfo>()

  // const handleSubmit = (values: CreateBooking, { setSubmitting }: FormikActions<CreateBooking>) =>
  //   api.createBooking(values).finally(() => setSubmitting(false))

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
    setStep(BookingStep.Payment)
  }

  const currentStep = {
    [BookingStep.EscapeRoom]: 0,
    [BookingStep.BookingInfo]: 1,
    [BookingStep.Timeslot]: 2,
    [BookingStep.Payment]: 3
  }[step]

  return (
    <>
      <StyledRow>
        <Section>
          <Steps current={currentStep}>
            <Steps.Step title="Escape Room" icon={<Icon type="home" />} />
            <Steps.Step title="Booking Details" icon={<Icon type="contacts" />} />
            <Steps.Step title="Date & Time" icon={<Icon type="calendar" />} />
            <Steps.Step title="Payment" icon={<Icon type="credit-card" />} />
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
    </>
  )
}

export default Booking
