import { Spin, Button } from 'antd';
import { zonedTimeToUtc } from 'date-fns-tz';
import { startOfDay, addWeeks, endOfDay, subDays } from 'date-fns';
import { Booking, Organization, EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { dec, inc } from 'ramda';
import * as React from 'react';
import { Time } from '@bookaquest/components';
import { Section } from '../../shared/layout/Section';
import { ResourceScheduler } from '../../shared/components/ResourceScheduler/ResourceScheduler';

interface Props {
  loading: boolean;
  bookings: Booking[];
  escapeRooms: EscapeRoom[];
  onSelectBookings: (bookings: Booking[]) => void;
  organization?: Organization;
}

export function SchedulerSection({
  loading,
  onSelectBookings,
  escapeRooms,
  bookings,
  organization
}: Props) {
  const { t } = useI18n();
  const [weekOffset, setWeekOffset] = React.useState(0);

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZone = organization?.timezone ?? localTimeZone;

  const today = new Date();
  const range = {
    start: zonedTimeToUtc(startOfDay(addWeeks(today, weekOffset)), timeZone),
    end: zonedTimeToUtc(
      endOfDay(subDays(addWeeks(today, weekOffset + 1), 1)),
      timeZone
    )
  };

  return (
    <Section>
      {loading ? (
        <div className="m-8 text-center">
          <Spin />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <span>
              {timeZone !== localTimeZone && t`Timezone: ${timeZone}`}
            </span>

            <div className="flex items-center">
              <Button
                className="flex justify-center mr-4"
                shape="circle"
                icon="left"
                disabled={weekOffset === 0}
                onClick={() => setWeekOffset(dec)}
              />
              <div>
                <Time
                  type="date"
                  date={[range.start, range.end]}
                  timeZone={timeZone}
                />
              </div>

              <Button
                className="flex justify-center ml-4"
                shape="circle"
                icon="right"
                onClick={() => setWeekOffset(inc)}
              />
            </div>
          </div>
          <ResourceScheduler
            range={range}
            onClickEvent={onSelectBookings}
            baseAvailability={organization?.businessHours}
            timeZone={timeZone}
            resources={escapeRooms.map(escapeRoom => ({
              id: escapeRoom._id,
              name: escapeRoom.name,
              availability: escapeRoom.businessHours,
              timeZone: escapeRoom.timezone,
              bookings: bookings.filter(
                booking => booking.escapeRoom === escapeRoom._id
              )
            }))}
          />
        </>
      )}
    </Section>
  );
}
