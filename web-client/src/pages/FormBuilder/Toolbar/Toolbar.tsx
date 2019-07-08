import { Button } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import FieldDefinition from './FieldDefinition'
import NewFieldModal from './NewFieldModal'

const Container = styled.div`
  overflow: auto;
  right: 0;
  top: 0;
  background-color: white;
  border-left: 1px solid #e8e8e8;
  width: 300px;
  padding: 24px 16px;
`

function Toolbar() {
  const [modalVisible, setModalVisible] = React.useState(false)

  return (
    <Container>
      {modalVisible && <NewFieldModal close={() => setModalVisible(false)} />}
      <Button onClick={() => setModalVisible(true)}>Add field</Button>
      <FieldDefinition />
    </Container>
  )
}

export default Toolbar
