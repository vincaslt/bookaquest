import { Link, Location } from '@reach/router';
import { Icon, Layout, Menu } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { useI18n } from '@bookaquest/utilities';
import { PrivateRoutes } from '../../constants/routes';
import Logo from '../components/Logo';

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
          <Icon type={icon} /> <span>{text}</span>
        </Link>
      ) : (
        <>
          <Icon type={icon} /> <span>{text}</span>
        </>
      )}
    </Menu.Item>
  );
}

interface Props {
  onCollapse?: (collapsed: boolean) => void;
}

export function SideMenu({ onCollapse }: Props) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SiderWithShadow
      width={256}
      breakpoint="md"
      className="z-20 overflow-auto h-screen fixed left-0"
      onCollapse={value => {
        onCollapse?.(value);
        setCollapsed(value);
      }}
    >
      <Location>
        {({ location }) => (
          <>
            <div className={collapsed ? 'px-6 py-4' : 'px-6 py-4'}>
              <Logo type={collapsed ? 'small-light' : 'light'} />
            </div>
            <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
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
          </>
        )}
      </Location>
    </SiderWithShadow>
  );
}
