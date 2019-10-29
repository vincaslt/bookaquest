import { Link, Location } from '@reach/router'
import { Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'
import { PrivateRoutes } from '../../constants/routes'
import useUser from '../hooks/useUser'

const StyledSider = styled(Layout.Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`

interface MenuLinkProps {
  icon: string
  text: string
  to?: string
  onClick?: () => void
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
  )
}

function SideMenu() {
  const { t } = useI18n()
  const { logout, userInfo } = useUser()

  const membership = userInfo && userInfo.memberships[0]

  return (
    <StyledSider width={256}>
      <Location>
        {({ location }) => (
          <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
            <MenuLink
              key={PrivateRoutes.Dashboard}
              to={PrivateRoutes.Dashboard}
              text={t`Dashboard`}
              icon="dashboard"
            />
            {membership && (
              <MenuLink
                key={PrivateRoutes.Bookings}
                to={PrivateRoutes.Bookings}
                text={t`Bookings`}
                icon="schedule"
              />
            )}
            {membership && (
              <MenuLink
                key={PrivateRoutes.EscapeRooms}
                to={PrivateRoutes.EscapeRooms}
                text={t`Escape rooms`}
                icon="appstore"
              />
            )}
            <MenuLink
              key={PrivateRoutes.Organization}
              to={PrivateRoutes.Organization}
              text={t`Organization`}
              icon="apartment"
            />
            <MenuLink key="logout" onClick={logout} text={`Logout`} icon="logout" />
          </Menu>
        )}
      </Location>
    </StyledSider>
  )
}

export default SideMenu
