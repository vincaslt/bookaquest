import { Link, Location } from '@reach/router';
import { Icon, Layout, Menu } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { PrivateRoutes } from '../../constants/routes';
import { useI18n } from '@bookaquest/utilities';

const SiderWithShadow = styled(Layout.Sider)`
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
`;

interface MenuLinkProps {
  icon: string;
  text: string;
  to?: string;
  onClick?: () => void;
}

function MenuLink({ to, icon, text, ...rest }: MenuLinkProps) {
  return (
    <Menu.Item {...rest}>
      {to ? (
        <Link to={to}>
          <Icon type={icon} /> {text}
        </Link>
      ) : (
        <>
          <Icon type={icon} /> {text}
        </>
      )}
    </Menu.Item>
  );
}

export function SideMenu() {
  const { t } = useI18n();

  return (
    <SiderWithShadow
      width={256}
      className="z-20 overflow-auto h-screen fixed left-0"
    >
      <Location>
        {({ location }) => (
          <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
            <MenuLink
              key={PrivateRoutes.Dashboard}
              to={PrivateRoutes.Dashboard}
              text={t`Dashboard`}
              icon="dashboard"
            />

            <MenuLink
              key={PrivateRoutes.Bookings}
              to={PrivateRoutes.Bookings}
              text={t`Bookings`}
              icon="schedule"
            />

            <MenuLink
              key={PrivateRoutes.EscapeRooms}
              to={PrivateRoutes.EscapeRooms}
              text={t`Escape rooms`}
              icon="appstore"
            />

            <MenuLink
              key={PrivateRoutes.Organization}
              to={PrivateRoutes.Organization}
              text={t`Organization`}
              icon="apartment"
            />
          </Menu>
        )}
      </Location>
    </SiderWithShadow>
  );
}
