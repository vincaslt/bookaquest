import { Link, Location } from '@reach/router'
import { Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PrivateRoutes } from '../constants/routes'
import useUser from './hooks/useUser'

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
  const { t } = useTranslation()
  const { logout } = useUser()

  return (
    <StyledSider width={256}>
      <Location>
        {({ location }) => (
          <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
            <MenuLink
              key={PrivateRoutes.Dashboard}
              to={PrivateRoutes.Dashboard}
              text={t('Dashboard')}
              icon="dashboard"
            />
            <MenuLink
              key={PrivateRoutes.Bookings}
              to={PrivateRoutes.Bookings}
              text={t('Bookings')}
              icon="schedule"
            />
            <MenuLink
              key={PrivateRoutes.Organization}
              to={PrivateRoutes.Organization}
              text={t('Organization')}
              icon="apartment"
            />
            <MenuLink key="logout" onClick={logout} text={t('Logout')} icon="logout" />
          </Menu>
        )}
      </Location>
    </StyledSider>
  )
}

export default SideMenu
