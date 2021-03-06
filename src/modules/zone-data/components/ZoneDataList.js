import React from 'react'
import styled from 'styled-components'
import RouteChoicesContainer from '../containers/RouteChoicesContainer'
import OriginsDataRowsContainer from '../containers/OriginsDataRowsContainer'
import DestinationsDataRowsContainer from '../containers/DestinationsDataRowsContainer'
import SubgraphSelectionContainer from '../containers/SubgraphSelectionContainer'

const List = styled.div`
  background: white;
  border-left: 1px solid ${({theme}) => theme.colors.borderSecondary};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0.3em 0.3em 0.3em 0.4em;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.2s all;
  width: ${({theme}) => theme.dimensions.rightBarWidth};
  z-index: 2;

  & > *:not(:first-child) {
    margin-top: 5rem;
  }

  & > *:last-child {
    margin-bottom: 3rem;
  }
`

const ZoneDataList = (props) => {
  return (
    <List>
      <RouteChoicesContainer />
      <OriginsDataRowsContainer />
      <DestinationsDataRowsContainer />
      <SubgraphSelectionContainer />
    </List>
  )
}

export default ZoneDataList
