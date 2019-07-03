import { Button } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { FormConfig } from '../../../../../user-script/src/lib'

const Container = styled.div`
  overflow: auto;
  right: 0;
  top: 0;
  background-color: white;
  border-left: 1px solid #e8e8e8;
  width: 300px;
  padding: 24px 16px;
`

interface Props {
  config: FormConfig
  onChangeConfig: (config: FormConfig) => void
}

function Toolbar({ config, onChangeConfig }: Props) {
  const { t } = useTranslation()

  const handleAddField = () =>
    onChangeConfig({
      ...config,
      schema: {
        ...config.schema,
        properties: {
          ...config.schema.properties,
          new_field: {
            type: 'string',
            title: 'New Field'
          }
        }
      }
    })

  return (
    <Container>
      <Button onClick={handleAddField}>{t('Add text field')}</Button>
    </Container>
  )
}

export default Toolbar
