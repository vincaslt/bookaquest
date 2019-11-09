import { Spin } from 'antd'
import * as React from 'react'
import SectionTitle from '../SectionTitle'

interface Props {
  title?: string
  className?: string
  loading?: boolean
  extra?: React.ReactNode
  children?: React.ReactNode
}

function DetailsList({ children, className, title, loading, extra }: Props) {
  return (
    <div className={className}>
      {title && <SectionTitle extra={extra}>{title}</SectionTitle>}
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default DetailsList
