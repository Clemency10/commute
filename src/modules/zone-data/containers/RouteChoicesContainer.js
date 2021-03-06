import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  forceRouteChoicesChartUpdate, resetForceRouteChoicesChartUpdate,
  filterNumCommuters, filterDuration, filterModesOfTransport,
  requestZoneJourneys, setFilteredRouteIds
} from '../actions'
import {
  groupsJourneyDataSelector, zoneNamesSelector,
  isFetchingZoneJourneyData, shouldRouteChoicesChartUpdate,
  routeChoicesFiltersSelector
} from '../selectors'
import zoneManager from '../../zone-manager'
import ListSeparator from '../components/ListSeparator'
import RouteChoices from '../components/RouteChoices'
import linkingCoordinator from '../../linking-coordinator'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const RouteChoicesContainer = (props) => {
  return (
    <Wrapper>
      <ListSeparator>Route choices</ListSeparator>
      <RouteChoices {...props} />
    </Wrapper>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    routes: groupsJourneyDataSelector(state),
    zoneIdToGroupColor: zoneManager.selectors.zoneIdsAndGroupColorsSelector(state),
    zoneIdToName: zoneNamesSelector(state),
    isFetchingZoneJourneyData: isFetchingZoneJourneyData(state),
    shouldUpdate: shouldRouteChoicesChartUpdate(state),
    filters: routeChoicesFiltersSelector(state),
    hoveredRouteId: linkingCoordinator.selectors.hoveredRouteIdSelector(state),
    ...ownProps
  }
}

const mapDispatchToProps = {
  forceRouteChoicesChartUpdate,
  resetForceRouteChoicesChartUpdate,
  filterNumCommuters,
  filterDuration,
  filterModesOfTransport,
  requestZoneJourneys,
  setFilteredRouteIds,
  setHoveredRouteId: linkingCoordinator.actions.setHoveredRouteId,
  clearHoveredRouteId: linkingCoordinator.actions.clearHoveredRouteId
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteChoicesContainer)
