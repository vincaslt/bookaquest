import { Link } from '@reach/router'
import { Icon, Layout, Menu, Typography } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Routes from '../constants/routes'
import { useUser } from './providers/UserProvider'

const StyledSider = styled(Layout.Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`

const UserInfoBox = styled.div`
  display: flex;
  color: rgb(255, 255, 255, 0.65);
  padding: 20px;
  margin-bottom: 20px;
`

function SideMenu() {
  const { t } = useTranslation()
  const { userInfo } = useUser()

  return (
    <StyledSider>
      {userInfo && <UserInfoBox>{userInfo.email}</UserInfoBox>}
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
        <Menu.Item key="logout">
          <Icon type="logout" /> {t('Logout')}
        </Menu.Item>
      </Menu>
    </StyledSider>
  )
}

export default SideMenu
