import { Input, Modal } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { asString } from '../../../utils/formHelpers'
import { useFormBuilder } from '../FormBuilderProvider'

interface Props {
  close: () => void
}

// TODO: check for duplicates in schema before adding
function NewFieldModal({ close }: Props) {
  const { addField, selectField } = useFormBuilder()
  const [fieldName, setFieldName] = React.useState('')
  const { t } = useTranslation()

  const handleSubmit = () => {
    addField(fieldName)
    selectField(fieldName)
    close()
  }

  return (
    <Modal title={t('Add new field')} visible={true} onCancel={close} onOk={handleSubmit}>
      <label>{t('Field name')}</label>
      <Input autoFocus onChange={asString(setFieldName)} placeholder="field_name" />
    </Modal>
  )
}

export default NewFieldModal
