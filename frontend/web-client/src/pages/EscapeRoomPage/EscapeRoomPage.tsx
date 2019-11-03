import { RouteComponentProps } from '@reach/router'
import { Col, List, Radio, Row, Switch } from 'antd'
import Title from 'antd/lib/typography/Title'
import * as React from 'react'
import AspectRatio from 'react-aspect-ratio'
import WorkHours from '~/../commons/components/WorkHours'
import { Booking } from '~/../commons/interfaces/booking'
import { EscapeRoom, PricingType } from '~/../commons/interfaces/escapeRoom'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import DetailsList from '../../shared/components/DetailsList'
import EditableText from '../../shared/components/EditableText'
import Link from '../../shared/components/Link'
import SectionTitle from '../../shared/components/SectionTitle'
import PageContent from '../../shared/layout/PageContent'
import Section from '../../shared/layout/Section'

interface UrlParams {
  escapeRoomId: string
}

function EscapeRoomPage(props: RouteComponentProps<UrlParams>) {
  const { t } = useI18n()
  const { escapeRoomId } = props
  const [escapeRoom, setEscapeRoom] = React.useState<EscapeRoom>()
  const [bookings, setBookings] = React.useState<Booking[]>()

  React.useEffect(() => {
    if (escapeRoomId) {
      Promise.all([api.getEscapeRoom(escapeRoomId), api.getEscapeRoomBookings(escapeRoomId)]).then(
        ([room, roomBookings]) => {
          setEscapeRoom(room)
          setBookings(roomBookings)
        }
      )
    }
  }, [escapeRoomId])

  // TODO: proper URL for booking page
  // TODO: correct inputs for difficulty and interval
  // TODO: not show payment details (only info message) if no paymentDetails from org
  return (
    <PageContent noBackground loading={!escapeRoom}>
      {escapeRoom && (
        <Row gutter={16}>
          <Col span={16}>
            <Section>
              <Title level={3}>{escapeRoom.name}</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <DetailsList
                    className="mt-4"
                    title={t`Details`}
                    data={[
                      {
                        label: t`Booking page:`,
                        content: (
                          <Link
                            href={`http://localhost:3000/${escapeRoom.organizationId}/${escapeRoomId}`}
                            newTab
                          >
                            {escapeRoomId}
                          </Link>
                        )
                      },
                      { label: t`Name:`, content: <EditableText>{escapeRoom.name}</EditableText> },
                      {
                        label: t`Difficulty:`,
                        content: <EditableText>{escapeRoom.difficulty}</EditableText>
                      },
                      {
                        label: t`Interval:`,
                        content: <EditableText>{escapeRoom.interval}</EditableText>
                      },
                      {
                        label: t`Location:`,
                        content: <EditableText>{escapeRoom.location}</EditableText>
                      },

                      {
                        label: t`Description:`,
                        content: <EditableText multiline>{escapeRoom.description}</EditableText>
                      }
                    ]}
                  />
                  <DetailsList
                    className="mt-8"
                    title={t`Pricing`}
                    data={[
                      {
                        label: t`Price:`,
                        content: (
                          <EditableText inputProps={{ type: 'number' }}>
                            {escapeRoom.price}
                          </EditableText>
                        )
                      },
                      {
                        label: t`Pricing type:`,
                        content: (
                          <Radio.Group
                            disabled={!escapeRoom.price}
                            name="pricingType"
                            defaultValue={PricingType.FLAT}
                          >
                            <Radio.Button value={PricingType.FLAT}>{t`Flat`}</Radio.Button>
                            <Radio.Button
                              value={PricingType.PER_PERSON}
                            >{t`Per-person`}</Radio.Button>
                          </Radio.Group>
                        )
                      },
                      {
                        label: t`Payment enabled:`,
                        content: <Switch checked={escapeRoom.paymentEnabled} />
                      }
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <div className="mb-8">
                    <SectionTitle>{t`Images`}</SectionTitle>
                    <AspectRatio ratio="532/320">
                      <img
                        className="object-cover"
                        src={escapeRoom.images[0]}
                        alt={`${escapeRoom.name} cover image`}
                      />
                    </AspectRatio>
                  </div>
                  <SectionTitle>{t`Business hours`}</SectionTitle>
                  <WorkHours businessHours={escapeRoom.businessHours} />
                </Col>
              </Row>
            </Section>
          </Col>
          <Col span={8}>
            <Section title={t`Bookings`}>
              <List
                loading={!bookings}
                itemLayout="horizontal"
                dataSource={bookings}
                renderItem={booking => (
                  <List.Item>
                    <List.Item.Meta
                      title={booking.name}
                      description={booking.startDate.toLocaleString()}
                    />
                  </List.Item>
                )}
              />
            </Section>
          </Col>
        </Row>
      )}
    </PageContent>
  )
}

export default EscapeRoomPage
