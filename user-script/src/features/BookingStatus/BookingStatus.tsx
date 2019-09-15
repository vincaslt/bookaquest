import { Button, Col, Result, Row, Spin, Steps, Typography } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import moment from 'moment'
import * as React from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import { BookingWithEscapeRoom } from '../../../../commons/interfaces/booking'
import { Organization } from '../../../../commons/interfaces/organization'
import { getBooking, getOrganization } from '../../api/application'

const { Text } = Typography

const Section = styled.div`
  background: white;
  padding: 20px;
`

const SectionLoading = styled.div`
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;

  & > *:first-child {
    margin-bottom: 20px;
  }
`

const DetailsContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  justify-content: space-between;
`

// TODO: booking confirmed status based on booking state
// TODO: add "link to this page"
// TODO: use Detail component? Or Description whatever
function BookingStatus() {
  const [match, params] = useRoute('/booking/:bookingId')
  const [booking, setBooking] = React.useState<BookingWithEscapeRoom>()
  const [organization, setOrganization] = React.useState<Organization>()

  const bookingId = params && params.bookingId

  React.useEffect(() => {
    const fetchBookingData = async (_bookingId: string) => {
      const _booking = await getBooking(_bookingId)
      const _organization = await getOrganization(_booking.escapeRoom.organizationId)
      setBooking(_booking)
      setOrganization(_organization)
    }

    if (bookingId) {
      fetchBookingData(bookingId)
    }
  }, [bookingId])

  if (!booking || !organization) {
    return (
      <Row>
        <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
          <SectionLoading>
            <Spin size="large" />
            <h2>Loading...</h2>
          </SectionLoading>
        </Col>
      </Row>
    )
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
            subTitle={`The escape room operator will now review your booking and send you an email confirmation with details to ${booking.email} once it's accepted. You can come back to this page to check your booking status.`}
            extra={<Button type="primary">Close</Button>}
          >
            <DetailsContainer>
              <Paragraph>
                <Text strong>Details</Text>
                <div>Name: {booking.name}</div>
                <div>Date: {startDate}</div>
                <div>Escape room: {booking.escapeRoom.name}</div>
              </Paragraph>
              <Paragraph>
                <Text strong>Operator</Text>
                <div>
                  Name: <Text>{organization.name}</Text>
                </div>
                <div>
                  Location: <Text>{organization.location}</Text>
                </div>
              </Paragraph>
              <Paragraph>
                <Text strong>Booking ID</Text>
                <pre>
                  <Text copyable>{booking.id}</Text>
                </pre>
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
