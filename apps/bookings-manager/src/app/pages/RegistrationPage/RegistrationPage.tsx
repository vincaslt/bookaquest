import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { PageContent } from '../../shared/layout/PageContent';
import { RegistrationForm } from './RegistrationForm';

export function RegistrationPage(props: RouteComponentProps) {
  return (
    <PageContent>
      <RegistrationForm />
    </PageContent>
  );
}
