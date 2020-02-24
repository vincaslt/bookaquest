import { RouteComponentProps } from '@reach/router';
import { Typography } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { useI18n } from '@bookaquest/utilities';

const SplashImage = styled.img`
  max-width: 196px;
  margin: 16px;
`;

export function CreateOrganizationSplash(props: RouteComponentProps) {
  const { t } = useI18n();

  return (
    <div className="mb-8 max-w-lg text-center flex flex-col items-center">
      <SplashImage src="/assets/crossroads.svg" />
      <Typography.Title>{t`Welcome!`}</Typography.Title>
      <Typography.Text type="secondary">
        {t`To begin collecting bookings for your escape rooms,
          we need some information about your organization`}
      </Typography.Text>
    </div>
  );
}
