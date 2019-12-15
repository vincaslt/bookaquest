import {
  Row,
  Col,
  Rate,
  Icon,
  Radio,
  Switch,
  Spin,
  Button,
  Popconfirm,
  message
} from 'antd';
import AspectRatio from 'react-aspect-ratio';
import { navigate } from '@reach/router';
import * as React from 'react';
import { WorkHours } from '@bookaquest/components';
import * as Yup from 'yup';
import {
  PricingType,
  EscapeRoom,
  UpdateEscapeRoom
} from '@bookaquest/interfaces';
import { asOption, useI18n, useLoading } from '@bookaquest/utilities';
import { environment } from '../../../environments/environment.prod';
import { Section } from '../../shared/layout/Section';
import { DetailsList } from '../../shared/components/DetailsList/DetailsList';
import { DetailsItem } from '../../shared/components/DetailsList/DetailsItem';
import { EditableText } from '../../shared/components/EditableText';
import { SectionTitle } from '../../shared/components/SectionTitle';
import * as api from '../../api/application';
import { PrivateRoutes } from '../../constants/routes';
import { ParticipantsEditableText } from './ParticipantsEditableText';

const validationSchema = Yup.object().shape<UpdateEscapeRoom>({
  name: Yup.string(),
  description: Yup.string(),
  location: Yup.string(),
  difficulty: Yup.number()
    .min(1)
    .max(5),
  interval: Yup.number().min(10),
  participants: Yup.array()
    .notRequired()
    .of(Yup.number())
    .test(
      'rangeTest',
      'Invalid range',
      (range: [number, number]) => !range || range[0] <= range[1]
    ),
  price: Yup.number().positive(),
  pricingType: Yup.string().oneOf(Object.values(PricingType)) as Yup.Schema<
    PricingType
  >,
  paymentEnabled: Yup.boolean()
});

interface Props {
  escapeRoom?: EscapeRoom;
  setEscapeRoom: (escapeRoom: EscapeRoom) => void;
}

export function EscapeRoomEditSection({ escapeRoom, setEscapeRoom }: Props) {
  const { t } = useI18n();
  const [loading, withLoading] = useLoading();

  const deleteEscapeRoom = async () => {
    if (escapeRoom) {
      await api.deleteEscapeRoom(escapeRoom._id);
      navigate(PrivateRoutes.EscapeRooms);
      message.success(t`Escape room has been deleted`);
    }
  };

  const updateEscapeRoom = async (values: UpdateEscapeRoom) => {
    if (escapeRoom) {
      const dto = await validationSchema.validate(values);
      const updatedRoom = await api.updateEscapeRoom(escapeRoom._id, dto);
      setEscapeRoom(updatedRoom);
      message.success(t`Escape room info has been updated`);
    }
  };

  const updateName = (name: string) => updateEscapeRoom({ name });
  const updateInterval = (interval: number) => updateEscapeRoom({ interval });
  const updatePrice = (price: number) => updateEscapeRoom({ price });
  const updateLocation = (location: string) => updateEscapeRoom({ location });
  const updateDescription = (description: string) =>
    updateEscapeRoom({ description });
  const updatePricingType = (pricingType: PricingType) =>
    updateEscapeRoom({ pricingType });
  const updatePaymentEnabled = (paymentEnabled: boolean) =>
    updateEscapeRoom({ paymentEnabled });
  const updateParticipants = (participants: [number?, number?]) =>
    updateEscapeRoom({ participants } as UpdateEscapeRoom);
  const updateDifficulty = (difficulty: number) => {
    if (!escapeRoom || difficulty !== escapeRoom.difficulty) {
      updateEscapeRoom({ difficulty });
    }
  };

  return !escapeRoom ? (
    <Spin />
  ) : (
    <Section>
      <Row gutter={16}>
        <Col span={12}>
          <DetailsList title={t`Details`}>
            <DetailsItem label={t`Name:`}>
              <EditableText onChange={updateName}>
                {escapeRoom.name}
              </EditableText>
            </DetailsItem>
            <DetailsItem label={t`Difficulty:`}>
              <Rate
                allowClear={false}
                onChange={updateDifficulty}
                value={escapeRoom.difficulty}
                character={<Icon type="lock" theme="filled" />}
              />
            </DetailsItem>
            <DetailsItem label={t`Interval:`}>
              <EditableText
                onChange={val => updateInterval(+val)}
                inputProps={{ type: 'number' }}
              >
                {escapeRoom.interval}
              </EditableText>
            </DetailsItem>
            <DetailsItem label={t`Participants:`}>
              <ParticipantsEditableText
                participants={escapeRoom.participants}
                onChange={updateParticipants}
              />
            </DetailsItem>
            <DetailsItem label={t`Location:`}>
              <EditableText onChange={updateLocation}>
                {escapeRoom.location}
              </EditableText>
            </DetailsItem>
            <DetailsItem className="items-start pt-2" label={t`Description:`}>
              <EditableText onChange={updateDescription} multiline>
                {escapeRoom.description}
              </EditableText>
            </DetailsItem>
          </DetailsList>
          <DetailsList className="mt-8" title={t`Pricing`}>
            <DetailsItem label={t`Price:`}>
              <EditableText
                onChange={val => updatePrice(+val)}
                inputProps={{ type: 'number' }}
              >
                {escapeRoom.price}
              </EditableText>
            </DetailsItem>
            <DetailsItem label={t`Pricing type:`}>
              <Radio.Group
                disabled={!escapeRoom.price}
                name="pricingType"
                value={escapeRoom.pricingType}
                onChange={asOption(updatePricingType)}
              >
                <Radio.Button value={PricingType.FLAT}>{t`Flat`}</Radio.Button>
                <Radio.Button
                  value={PricingType.PER_PERSON}
                >{t`Per-person`}</Radio.Button>
              </Radio.Group>
            </DetailsItem>
            {environment.paymentEnabled && (
              <DetailsItem label={t`Payment enabled:`}>
                <Switch
                  onChange={updatePaymentEnabled}
                  checked={escapeRoom.paymentEnabled}
                />
              </DetailsItem>
            )}
          </DetailsList>
        </Col>
        <Col span={12}>
          <div className="mb-8">
            <SectionTitle>{t`Images`}</SectionTitle>
            <AspectRatio ratio="532/320">
              <img
                className="object-cover"
                src={escapeRoom.images[0]}
                alt={`${escapeRoom.name} cover`}
              />
            </AspectRatio>
          </div>
          <div className="mb-8">
            <SectionTitle>{t`Business hours`}</SectionTitle>
            <div className="mb-4">
              <span className="font-medium mr-2">{t`Timezone:`}</span>
              {escapeRoom.timezone}
            </div>
            <WorkHours businessHours={escapeRoom.businessHours} />
          </div>
          <div className="flex justify-end">
            <Popconfirm
              title={t`Are you sure?`}
              onConfirm={() => withLoading(deleteEscapeRoom())}
              okText={t`Yes`}
              cancelText={t`No`}
            >
              <Button
                loading={loading}
                type="danger"
              >{t`Delete escape room`}</Button>
            </Popconfirm>
          </div>
        </Col>
      </Row>
    </Section>
  );
}
