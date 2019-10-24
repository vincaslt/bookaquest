import { Col, Empty, Icon, Row, Steps } from 'antd'
import * as React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import { Booking } from '~/../commons/interfaces/booking'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Organization } from '~/../commons/interfaces/organization'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { getOrganization } from '../../api/application'
import BookingInfoStep, { BookingInfo } from './BookingInfoStep/BookingInfoStep'
import BookingSummary from './BookingSummary/BookingSummary'
import ConfirmationStep from './ConfirmationStep/ConfirmationStep'
import EscapeRoomStep from './EscapeRoomStep/EscapeRoomStep'
import TimeslotStep from './TimeslotStep/TimeslotStep'

const Section = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 20px;
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
  const [, params] = useRoute('/:organizationId')
  const [step, setStep] = React.useState<BookingStep>(BookingStep.EscapeRoom)
  const [organization, setOrganization] = React.useState<Organization>()

  const [selectedRoom, setSelectedRoom] = React.useState<EscapeRoom>()
  const [bookingInfo, setBookingInfo] = React.useState<BookingInfo>()
  const [timeslot, setTimeslot] = React.useState<Timeslot>()

  const organizationId = params && params.organizationId

  React.useEffect(() => {
    if (organizationId) {
      const fetchOrganizationData = async () => {
        const _organization = await getOrganization(organizationId)
        setOrganization(_organization)
      }

      fetchOrganizationData()
    }
  }, [organizationId])

  if (!organizationId) {
    return null // TODO: redirect to error?
  }

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

  const currentStep = {
    [BookingStep.EscapeRoom]: 0,
    [BookingStep.BookingInfo]: 1,
    [BookingStep.Timeslot]: 2,
    [BookingStep.Confirmation]: 3
  }[step]

  return (
    <Row>
      <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
        <Row>
          <Section>
            <Steps current={currentStep}>
              <Steps.Step title="Escape Room" icon={<Icon type="home" />} />
              <Steps.Step title="Booking Details" icon={<Icon type="contacts" />} />
              <Steps.Step title="Date & Time" icon={<Icon type="calendar" />} />
            </Steps>
          </Section>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Section>
              {step === BookingStep.EscapeRoom && (
                <EscapeRoomStep organizationId={organizationId} onSelect={handleSelectEscapeRoom} />
              )}
              {step === BookingStep.BookingInfo && selectedRoom && (
                <BookingInfoStep onSubmit={handleSubmitBookingInfo} room={selectedRoom} />
              )}
              {step === BookingStep.Timeslot && selectedRoom && (
                <TimeslotStep onSelect={handleSelectTimeslot} room={selectedRoom} />
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
              {step === BookingStep.EscapeRoom ? (
                <Empty description="Pick an escape room" />
              ) : (
                <BookingSummary selectedRoom={selectedRoom} />
              )}
            </Section>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Booking
