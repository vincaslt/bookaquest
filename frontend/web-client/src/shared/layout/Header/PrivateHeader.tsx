import { Dropdown, Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'
import useUser from '../../hooks/useUser'

const HeaderWithShadow = styled(Layout.Header)`
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
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
    <HeaderWithShadow className="px-4 py-8 bg-white flex justify-end items-center z-10">
      {userInfo && (
        <Dropdown overlay={menu}>
          <a className="px-2 ant-dropdown-link flex items-center hover:bg-gray-100">
            {userInfo.email} <Icon className="ml-1" type="down" />
          </a>
        </Dropdown>
      )}
    </HeaderWithShadow>
  )
}

export default PrivateHeader
