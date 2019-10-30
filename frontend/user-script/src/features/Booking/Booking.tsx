import { Col, Icon, Row, Steps } from 'antd'
import * as React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import styled from 'styled-components'
import { useLocation, useRoute } from 'wouter'
import { Booking } from '~/../commons/interfaces/booking'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Organization } from '~/../commons/interfaces/organization'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import * as api from '../../api/application'
import BookingInfoStep, { BookingInfo } from './BookingInfoStep/BookingInfoStep'
import BookingSummary from './BookingSummary/BookingSummary'
import ConfirmationStep from './ConfirmationStep/ConfirmationStep'
import TimeslotStep from './TimeslotStep/TimeslotStep'

const Section = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 20px;
`

enum BookingStep {
  Timeslot = 'timeslot',
  BookingInfo = 'booking-info',
  Confirmation = 'confirmation'
}

// TODO loading state (loading escape room)
// TODO show availabilities, and escape room selection
function Booking() {
  const [, params] = useRoute<{ organizationId: string; escapeRoomId: string; step: string }>(
    '/:organizationId/:escapeRoomId/:step?'
  )
  const [, setLocation] = useLocation()
  const step = ((params && params.step) || BookingStep.Timeslot) as BookingStep
  const [organization, setOrganization] = React.useState<Organization>()

  const [selectedRoom, setSelectedRoom] = React.useState<EscapeRoom>()
  const [bookingInfo, setBookingInfo] = React.useState<BookingInfo>()
  const [timeslot, setTimeslot] = React.useState<Timeslot>()

  const organizationId = params && params.organizationId
  const escapeRoomId = params && params.escapeRoomId

  React.useEffect(() => {
    // Clears any manual step pre-selection on visit
    if (organizationId && escapeRoomId) {
      setLocation(`/${organizationId}/${escapeRoomId}`)
    }
  }, [])

  React.useEffect(() => {
    if (organizationId) {
      api.getOrganization(organizationId).then(setOrganization)
    }
  }, [organizationId])

  React.useEffect(() => {
    if (escapeRoomId) {
      api.getEscapeRoom(escapeRoomId).then(setSelectedRoom)
    }
  }, [escapeRoomId])

  if (!organizationId || !escapeRoomId) {
    return null // TODO: redirect to error?
  }

  const goToStep = (nextStep: BookingStep) =>
    setLocation(`/${organizationId}/${escapeRoomId}/${nextStep}`)

  const handleSubmitBookingInfo = (info: BookingInfo) => {
    setBookingInfo(info)
    goToStep(BookingStep.Confirmation)
  }

  const handleSelectTimeslot = (timeslotInfo: Timeslot) => {
    setTimeslot(timeslotInfo)
    goToStep(BookingStep.BookingInfo)
  }

  const currentStep = {
    [BookingStep.Timeslot]: 0,
    [BookingStep.BookingInfo]: 1,
    [BookingStep.Confirmation]: 2
  }[step]

  // TODO: show Payment as step if booking room has payments
  return (
    <Row>
      <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
        <Row>
          <Section>
            <Steps current={currentStep}>
              <Steps.Step title="Date & Time" icon={<Icon type="calendar" />} />
              <Steps.Step title="Booking Details" icon={<Icon type="contacts" />} />
              <Steps.Step title="Confirmation" icon={<Icon type="carry-out" />} />
            </Steps>
          </Section>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Section>
              {step === BookingStep.Timeslot && selectedRoom && (
                <TimeslotStep onSelect={handleSelectTimeslot} room={selectedRoom} />
              )}
              {step === BookingStep.BookingInfo && selectedRoom && (
                <BookingInfoStep onSubmit={handleSubmitBookingInfo} room={selectedRoom} />
              )}
              {step === BookingStep.Confirmation &&
                timeslot &&
                bookingInfo &&
                selectedRoom &&
                organization && (
                  <StripeProvider
                    apiKey={
                      organization.paymentDetails
                        ? organization.paymentDetails.paymentClientKey
                        : ''
                    }
                  >
                    <Elements>
                      <ConfirmationStep
                        bookingInfo={bookingInfo}
                        escapeRoom={selectedRoom}
                        timeslot={timeslot}
                      />
                    </Elements>
                  </StripeProvider>
                )}
            </Section>
          </Col>
          <Col span={12}>
            <Section>
              <BookingSummary selectedRoom={selectedRoom} />
            </Section>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Booking
