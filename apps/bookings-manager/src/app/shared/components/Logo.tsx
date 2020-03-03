import { Link } from '@reach/router';
import * as React from 'react';
import styled from 'styled-components';
import { PublicRoutes } from '../../constants/routes';

const LogoImg = styled.img`
  width: 200px;
`;

interface Props {
  type?: 'small-light' | 'dark' | 'light';
}

function Logo({ type = 'light' }: Props) {
  const url = {
    light: '/assets/logo.svg',
    dark: '/assets/logo-dark.svg',
    'small-light': '/assets/logo-small.svg'
  }[type];

  return (
    <Link to={PublicRoutes.Landing}>
      <LogoImg src={url} alt="BookaQuest logo" />
    </Link>
  );
}

export default Logo;
