import { RouteComponentProps } from '@reach/router'
import { Typography } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import PageContent from '../../shared/PageContent'
import crossroadsSvg from './crossroads.svg'

const SplashImage = styled.img`
  max-width: 256px;
  margin: 20px;
`

const SplashContainer = styled(PageContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

function CreateOrganizationSplash(props: RouteComponentProps) {
  const { t } = useTranslation()

  return (
    <SplashContainer>
      <SplashImage src={crossroadsSvg} />
      <Typography.Title>{t('Welcome!')}</Typography.Title>
      <Typography.Text type="secondary">
        {t(
          `To begin collecting bookings for your escape rooms,
          we need some information about your organization`
        )}
      </Typography.Text>
    </SplashContainer>
  )
}

export default CreateOrganizationSplash
