import { Dropdown, Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'
import useUser from '../../hooks/useUser'

const StyledHeader = styled(Layout.Header)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  padding: 16px 24px;
`

function PrivateHeader() {
  const { logout, userInfo } = useUser()
  const { t } = useI18n()

  const menu = (
    <Menu>
      <Menu.Item className="flex items-center" onClick={logout}>
        <Icon className="mr-1" type="logout" />
        {t`Logout`}
      </Menu.Item>
    </Menu>
  )

  return (
    <StyledHeader>
      {userInfo && (
        <Dropdown overlay={menu}>
          <a className="px-2 ant-dropdown-link flex items-center hover:bg-gray-100">
            {userInfo.email} <Icon className="ml-1" type="down" />
          </a>
        </Dropdown>
      )}
    </StyledHeader>
  )
}

export default PrivateHeader
