import { Layout } from 'antd'
import { BasicProps } from 'antd/lib/layout/layout'
import * as React from 'react'
import PageContentLoading from '../components/PageContentLoading'

interface Props extends BasicProps {
  header?: React.ReactNode
  noBackground?: boolean
  loading?: boolean
}

function PageContent({ header, loading, noBackground, children, className = '', ...rest }: Props) {
  return (
    <>
      {header && <div className="bg-white">{header}</div>}
      {loading ? (
        <PageContentLoading {...rest} />
      ) : (
        <Layout.Content
          className={`m-6 ${noBackground ? '' : 'p-6 bg-white'} ${className}`}
          {...rest}
        >
          {children}
        </Layout.Content>
      )}
    </>
  )
}

export default PageContent
