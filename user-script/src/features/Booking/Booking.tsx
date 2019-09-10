import { Col, Icon, Row, Steps } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { useLocation, useRoute } from 'wouter'
import * as api from '../../api/application'
import { Booking } from '../../interfaces/booking'
import { EscapeRoom } from '../../interfaces/escapeRoom'
import { Timeslot } from '../../interfaces/timeslot'
import BookingInfoStep, { BookingInfo } from './BookingInfoStep/BookingInfoStep'
import ConfirmationStep from './ConfirmationStep/ConfirmationStep'
import EscapeRoomStep from './EscapeRoomStep/EscapeRoomStep'
import TimeslotStep from './TimeslotStep/TimeslotStep'

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
  Confirmation = 'confirmation'
}

// TODO check organization ID for undefined
// TODO show availabilities, and escape room selection
function Booking() {
  const [match, params] = useRoute('/:organizationId')
  const [location, setLocation] = useLocation()
  const [step, setStep] = React.useState<BookingStep>(BookingStep.EscapeRoom)

  const [selectedRoom, setSelectedRoom] = React.useState<EscapeRoom>()
  const [bookingInfo, setBookingInfo] = React.useState<BookingInfo>()
  const [timeslot, setTimeslot] = React.useState<Timeslot>()

  if (!params) {
    return null // TODO: redirect to error?
  }

  const { organizationId } = params

  const handleSelectEscapeRoom = (room: EscapeRoom) => {
    setSelectedRoom(room)
    setStep(BookingStep.BookingInfo)
  }

  const handleSubmitBookingInfo = (info: BookingInfo) => {
    setBookingInfo(info)
    setStep(BookingStep.Timeslot)
  }

  const handleSelectTimeslot = (timeslotInfo: Timeslot) => {
    setTimeslot(timeslotInfo)
    setStep(BookingStep.Confirmation)
  }

  const handleConfirmation = async () => {
    if (timeslot && selectedRoom && bookingInfo) {
      const { id } = await api.createBooking({
        ...bookingInfo,
        startDate: timeslot.start,
        endDate: timeslot.end,
        escapeRoomId: selectedRoom.id
      })
      setLocation(`/booking/${id}`)
    }
  }

  const currentStep = {
    [BookingStep.EscapeRoom]: 0,
    [BookingStep.BookingInfo]: 1,
    [BookingStep.Timeslot]: 2,
    [BookingStep.Confirmation]: 3
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
              {step === BookingStep.Confirmation && timeslot && bookingInfo && selectedRoom && (
                <ConfirmationStep
                  bookingInfo={bookingInfo}
                  escapeRoom={selectedRoom}
                  timeslot={timeslot}
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
