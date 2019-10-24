import { Button, Input, Typography } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import * as React from 'react'
import { CardCVCElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements'
import { useI18n } from '~/../commons/utils/i18n'
import './CardForm.css'

const { Text } = Typography

interface Props {
  onSubmit: (info: { name: string }) => void
}

// TODO: proper validations and form handling
function CardForm({ onSubmit }: Props) {
  const { t } = useI18n()
  const [name, setName] = React.useState('')

  const handleSubmit = () => {
    onSubmit({ name })
  }

  return (
    <>
      <FormItem style={{ marginBottom: 15 }} label={t`Name on card`}>
        <Input placeholder={t`Name Surname`} value={name} onChange={e => setName(e.target.value)} />
      </FormItem>
      <FormItem style={{ marginBottom: 0 }} label={t`Card number`}>
        <CardNumberElement
          classes={{ base: 'ant-input stripe-card-input', focus: 'ant-input--focus' }}
          className="mb-1"
        />
      </FormItem>
      <div className="flex">
        <FormItem style={{ marginBottom: 0 }} label={t`Expiry date`} className="flex-1 mr-4">
          <CardExpiryElement
            className="mr-2"
            classes={{ base: 'ant-input stripe-card-input', focus: 'ant-input--focus' }}
          />
        </FormItem>
        <FormItem style={{ marginBottom: 0 }} label={t`CVC`} className="flex-1">
          <CardCVCElement
            classes={{ base: 'ant-input stripe-card-input', focus: 'ant-input--focus' }}
          />
        </FormItem>
      </div>

      <Button className="mt-2 mr-4" type="primary" onClick={handleSubmit}>
        {t`Pay`}
      </Button>
      <Text type="secondary">{t`Your card will be charged`}</Text>
    </>
  )
}

export default CardForm
