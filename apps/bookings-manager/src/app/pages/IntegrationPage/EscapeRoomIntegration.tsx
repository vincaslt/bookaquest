import { Button } from 'antd';
import * as React from 'react';
import { EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { environment } from '../../../environments/environment';
import { DetailsList } from '../../shared/components/DetailsList/DetailsList';
import { DetailsItem } from '../../shared/components/DetailsList/DetailsItem';
import { Link } from '../../shared/components/Link';
import { SectionTitle } from '../../shared/components/SectionTitle';

interface Props {
  escapeRoom: EscapeRoom;
}

function EscapeRoomIntegration({ escapeRoom }: Props) {
  const { t } = useI18n();
  const escapeRoomUrl = `${environment.bookingAppUrl}/booking/${escapeRoom.organization}/${escapeRoom._id}`;

  return (
    <>
      <DetailsList>
        <DetailsItem label={t`Escape room name:`}>
          {escapeRoom.name}
        </DetailsItem>
        <DetailsItem label={t`Booking page:`}>
          <Link href={escapeRoomUrl} newTab>
            <Button type="link">{escapeRoomUrl}</Button>
          </Link>
        </DetailsItem>
      </DetailsList>
      <div className="mt-8">
        <p>{t`Copy this code and paste it in your page's HTML where you want to show the button.`}</p>

        <pre className="my-4 p-4" lang="html">
          {`<a href="${escapeRoomUrl}" target="_blank" rel="noopener noreferrer">
  <button style="cursor: pointer; background: #15d798; border-radius: 8px; padding: 15px 30px; color: #ffffff; display: inline-block; font: normal bold 18px/1 'Open Sans', sans-serif; text-align: center; border: none;">
    ${t`Book Now`}
  </button>
</a>`}
        </pre>
      </div>
      <div className="mt-8">
        <SectionTitle>{t`Preview`}</SectionTitle>

        <a href={escapeRoomUrl} target="_blank" rel="noopener noreferrer">
          <button
            style={{
              cursor: 'pointer',
              background: '#15d798',
              borderRadius: 8,
              padding: '15px 30px',
              color: '#ffffff',
              display: 'inline-block',
              font: "normal bold 18px/1 'Open Sans', sans-serif",
              textAlign: 'center',
              border: 'none'
            }}
          >
            {t`Book Now`}
          </button>
        </a>
      </div>
    </>
  );
}

export default EscapeRoomIntegration;
