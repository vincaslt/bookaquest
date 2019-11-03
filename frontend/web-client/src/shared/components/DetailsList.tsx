import { Spin } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import SectionTitle from './SectionTitle'

const DetailContainer = styled.div`
  display: flex;
  min-height: 35px;
  align-items: center;
`

interface Props {
  title?: string
  className?: string
  loading?: boolean
  extra?: React.ReactNode
  data?: Array<{ label: string; content: React.ReactNode }> | null | false | undefined
}

function DetailsList({ data, className, title, loading, extra }: Props) {
  return (
    <div className={className}>
      {title && <SectionTitle extra={extra}>{title}</SectionTitle>}
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        (data || []).map((item, i) => (
          <DetailContainer key={i}>
            <span className="font-medium mr-4">{item.label}</span>
            {item.content}
          </DetailContainer>
        ))
      )}
    </div>
  )
}

export default DetailsList
