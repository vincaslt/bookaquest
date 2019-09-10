import { Button, Col, Result, Row, Steps } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import moment from 'moment'
import * as React from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import { getBooking } from '../../api/application'
import { BookingWithEscapeRoom } from '../../interfaces/booking'

const Section = styled.div`
  background: white;
  padding: 20px;
`

const DetailsContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  justify-content: space-between;
`

// TODO: booking confirmed status based on booking state

function BookingStatus() {
  const [match, params] = useRoute('/booking/:bookingId')
  const [booking, setBooking] = React.useState<BookingWithEscapeRoom>()

  React.useEffect(() => {
    if (params) {
      getBooking(params.bookingId).then(setBooking)
    }
  }, [params])

  if (!booking) {
    return null // TODO: loading
  }

  const startDate = moment(booking.startDate).format('LLLL')
  const escapeRoom = booking.escapeRoom

  return (
    <Row>
      <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
        <Section>
          <Result
            status="info"
            title={`Booking request for "${escapeRoom.name}" has been received`}
            subTitle={`The escape room operator will now review your booking and send you an email confirmation with details to ${
              booking.email
            } once it's accepted. You can come back to this page to check your booking status.`}
            extra={<Button type="primary">Close</Button>}
          >
            <DetailsContainer>
              <Paragraph>
                <strong>Details</strong>
                <div>{startDate}</div>
              </Paragraph>
              <Paragraph>
                <strong>Booking ID</strong>
                <pre>{booking.id}</pre>
              </Paragraph>
            </DetailsContainer>
            <Steps progressDot current={1}>
              <Steps.Step title="Book" description="Booking request has been sent" />
              <Steps.Step
                title="Confirmation"
                description="You will receive it in your email soon"
              />
              <Steps.Step
                title="Play!"
                description={`Show up on ${moment(booking.startDate).format('LLLL')}`}
              />
            </Steps>
          </Result>
        </Section>
      </Col>
    </Row>
  )
}

export default BookingStatus
