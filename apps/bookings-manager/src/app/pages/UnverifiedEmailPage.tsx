import { RouteComponentProps } from '@reach/router';
import { parse } from 'query-string';
import { message, Spin, Typography } from 'antd';
import * as React from 'react';
import { useI18n, useLoading } from '@bookaquest/utilities';
import styled from 'styled-components';
import { PageContent } from '../shared/layout/PageContent';
import { Section } from '../shared/layout/Section';
import * as api from '../api/application';
import { useUser } from '../shared/hooks/useUser';

const SplashImage = styled.img`
  max-width: 196px;
  margin: 16px;
`;

function UnverifiedEmailPage({ navigate, location }: RouteComponentProps) {
  const { t } = useI18n();
  const { userInfo, setUserInfo } = useUser();
  const [loading, withLoading] = useLoading(false);
  const params = location?.search && parse(location.search);
  const verificationCode =
    (params && params['code']) || (location?.state as any)?.verificationCode;

  React.useEffect(() => {
    if (userInfo && verificationCode && typeof verificationCode === 'string') {
      withLoading(api.verifyEmail(verificationCode)).then(() => {
        setUserInfo({ ...userInfo, verified: true });
        message.success(t`Email verified successfully`);
        if (navigate && location) {
          navigate(location.pathname, { replace: true });
        }
      });
    }
  }, [verificationCode, userInfo, setUserInfo, withLoading]);

  if (!userInfo) {
    throw new Error('No user info');
  }

  return (
    <PageContent noBackground className="flex flex-col items-center">
      <Section className="w-full max-w-3xl flex flex-col items-center">
        <div className="mb-8 max-w-lg text-center flex flex-col items-center">
          <SplashImage src="/assets/verification-pending.svg" />
          <Typography.Title>
            {loading ? t`Verifying email` : t`Please verify your email`}
          </Typography.Title>
          {loading ? (
            <div className="mt-8">
              <Spin />
            </div>
          ) : (
            <Typography.Text type="secondary">
              {t`We have sent you an email to ${userInfo.email}. Click the button in the email to verify your email.`}
            </Typography.Text>
          )}
        </div>
      </Section>
    </PageContent>
  );
}

export default UnverifiedEmailPage;
