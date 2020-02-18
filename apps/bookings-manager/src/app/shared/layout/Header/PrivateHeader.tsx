import { Dropdown, Icon, Layout, Menu } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { useI18n } from '@bookaquest/utilities';
import { useUser } from '../../hooks/useUser';

interface Props {
  sidebarVisible?: boolean;
}

const HeaderWithShadow = styled(Layout.Header)`
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: fixed;
  width: ${({ sidebarVisible }: Props) =>
    sidebarVisible ? 'calc(100% - 256px)' : '100%'};
`;

export function PrivateHeader({ sidebarVisible = false }: Props) {
  const { logout, userInfo } = useUser();
  const { t } = useI18n();

  const menu = (
    <Menu>
      <Menu.Item className="flex items-center" onClick={logout}>
        <Icon className="mr-1" type="logout" />
        {t`Logout`}
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderWithShadow
      sidebarVisible={sidebarVisible}
      className="px-4 py-8 bg-white flex justify-end items-center z-10"
    >
      {userInfo && (
        <Dropdown trigger={['click']} overlay={menu}>
          <button
            type="button"
            className="px-2 ant-dropdown-link flex items-center hover:bg-gray-100"
          >
            {userInfo.fullName} <Icon className="ml-1" type="down" />
          </button>
        </Dropdown>
      )}
    </HeaderWithShadow>
  );
}
