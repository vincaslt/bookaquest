import { Link } from '@reach/router'
import { Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { signOut } from '../api/application'
import Routes from '../constants/routes'

const StyledSider = styled(Layout.Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`

// TODO: show active based on route
function SideMenu() {
  const { t } = useTranslation()

  const logout = () => {
    signOut()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    location.assign(Routes.SignIn)
  }

  return (
    <StyledSider width={256}>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        defaultOpenKeys={['content']}
      >
        <Menu.Item key="dashboard">
          <Link to={Routes.Home}>
            <Icon type="dashboard" /> {t('Dashboard')}
          </Link>
        </Menu.Item>
        <Menu.Item key="bookings">
          <Link to={Routes.Bookings}>
            <Icon type="schedule" /> {t('Bookings')}
          </Link>
        </Menu.Item>
        <Menu.Item key="organization">
          <Link to={Routes.Organization}>
            <Icon type="apartment" /> {t('Organization')}
          </Link>
        </Menu.Item>
        <Menu.Item key="logout" onClick={logout}>
          <Icon type="logout" /> {t('Logout')}
        </Menu.Item>
      </Menu>
    </StyledSider>
  )
}

export default SideMenu
