import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import get from 'lodash.get'
import RouteChoicesChart from './RouteChoicesChart'
import RouteInfoTooltip from '../../core/components/RouteInfoTooltip'
import Spinner from '../../core/components/Spinner'
import { landUseColors } from '../../core/components/ZoneDetails'

const Wrapper = styled.div`
  position: relative;
  min-height: 50px;
`

const BottomLeftSpinner = Spinner.extend`
  position: absolute;
  bottom: 0;
`

const MaxNumLinksFeedback = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`

const FeedbackLabel = styled.div`
  position: absolute;
  align-items: center;
  color: ${({theme}) => theme.colors.textPrimary};
  display: flex;
  font-size: 1rem;
  font-style: italic;
  width: 100%;
  height: 100%;
  justify-content: center;
  text-align: center;
`

// Contains the chart and tooltip
class RouteChoicesChartManager extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.maxNumLinks = 50
    this.numHiddenLinks = 0
    this.setTooltipInfo = this.setTooltipInfo.bind(this)
    this.defaultNodeColor = '#ddd'
    this.noRoutes = true
  }

  componentWillReceiveProps (nextProps) {
    const {
      duration: [minDuration, maxDuration],
      numCommuters: [minCommuters, maxCommuters]
    } = nextProps.filters

    this.maxDuration = maxDuration

    if (!nextProps.shouldUpdate) {
      this.nodes = []
      return
    } else {
      this.zoneIdToGroupId = {}
      this.nodes = {}
      this.links = []
      this.linksMetadata = {}
    }

    // Populate mapping of zone id to group id
    Object.keys(nextProps.routes).forEach(groupId => {
      const { groupData } = nextProps.routes[groupId]
      groupData.map(d => d.zoneId)
        .forEach(zoneId => (this.zoneIdToGroupId[zoneId] = Number(groupId)))
    })

    // Populate links
    Object.keys(nextProps.routes).forEach(groupId => {
      const { groupData } = nextProps.routes[groupId]
      groupData.forEach(({ zoneId, zoneData }) => {
        zoneData && zoneData.forEach(route => {
          const { originZone, destinationZone, count, ...rest } = route
          const link = {
            ...rest,
            count,
            originZone: originZone || zoneId,
            destinationZone: destinationZone || zoneId,
            source: originZone ? (this.zoneIdToGroupId[originZone] || originZone) : Number(groupId),
            target: destinationZone ? (this.zoneIdToGroupId[destinationZone] || destinationZone) : Number(groupId)
          }
          if (
            link.source !== link.target &&
            minDuration <= link.totalDuration && link.totalDuration <= maxDuration &&
            minCommuters <= link.count && link.count <= maxCommuters
          ) {
            link.sourceColor = nextProps.zoneIdToGroupColor[link.originZone] || get(landUseColors, get(link.originZoneData, 'lu_desc'), this.defaultNodeColor)
            link.targetColor = nextProps.zoneIdToGroupColor[link.destinationZone] || get(landUseColors, get(link.destinationZoneData, 'lu_desc'), this.defaultNodeColor)
            link.sourceIsGroup = nextProps.zoneIdToGroupColor.hasOwnProperty(link.originZone)
            link.targetIsGroup = nextProps.zoneIdToGroupColor.hasOwnProperty(link.destinationZone)

            // Add link
            this.links.push(link)
          }
        })
      })
    })

    if (this.links.length > this.maxNumLinks) {
      this.numHiddenLinks = this.links.length - this.maxNumLinks
      this.links = this.links.slice(0, this.maxNumLinks)
    } else {
      this.numHiddenLinks = 0
    }

    this.links.forEach(link => {
      const key = link.source < link.target ? `${link.source}-${link.target}` : `${link.target}-${link.source}`
      if (!this.linksMetadata.hasOwnProperty(key)) {
        let sameOD, sameODAlt
        if (link.source < link.target) {
          sameOD = this.links.filter(d => d.source === link.source && d.target === link.target)
          sameODAlt = this.links.filter(d => d.target === link.source && d.source === link.target)
        } else {
          sameODAlt = this.links.filter(d => d.source === link.source && d.target === link.target)
          sameOD = this.links.filter(d => d.target === link.source && d.source === link.target)
        }

        this.linksMetadata[key] = {
          numLinks: sameOD.length + sameODAlt.length,
          counterOD: 0,
          counterODAlt: sameOD.length
        }

        // Add node
        this.nodes[link.source] || (this.nodes[link.source] = {
          group: link.source,
          color: link.sourceColor,
          isGroup: link.sourceIsGroup,
          numLinks: 0
        })
        this.nodes[link.target] || (this.nodes[link.target] = {
          group: link.target,
          color: link.targetColor,
          isGroup: link.targetIsGroup,
          numLinks: 0
        })

        // Update number of links for current source and target nodes
        this.nodes[link.source].numLinks += this.linksMetadata[key].numLinks
        this.nodes[link.target].numLinks += this.linksMetadata[key].numLinks
      }

      if (link.source < link.target) {
        const currentDirectionIdx = ++this.linksMetadata[key].counterOD
        link.direction = currentDirectionIdx > Math.ceil(this.linksMetadata[key].numLinks / 2) ? 1 : 0
        link.linkNum = currentDirectionIdx
      } else {
        const currentDirectionIdx = ++this.linksMetadata[key].counterODAlt
        link.direction = currentDirectionIdx <= Math.ceil(this.linksMetadata[key].numLinks / 2) ? 1 : 0
        link.linkNum = currentDirectionIdx
      }

      // Use nodes data as source and target
      link.source = this.nodes[link.source]
      link.target = this.nodes[link.target]
    })

    this.props.setFilteredRouteIds(this.links.map(e => e.id))

    // Convert nodes object to array
    this.nodes = Object.values(this.nodes)
    this.noRoutes = this.nodes.length === 0
  }

  setTooltipInfo (link, x, y) {
    if (!link) {
      this.setState({isTooltipHidden: true})
      this.props.clearHoveredRouteId()
    } else {
      this.setState({
        link, x, y, isTooltipHidden: false
      })
      this.props.setHoveredRouteId(link.id)
    }
  }

  render () {
    return (
      <Wrapper>
        { this.numHiddenLinks > 0 && <MaxNumLinksFeedback>Showing {this.maxNumLinks} links ({this.numHiddenLinks} links are hidden)</MaxNumLinksFeedback> }
        { this.props.isFetchingZoneJourneyData && <BottomLeftSpinner /> }
        { !this.props.isFetchingZoneJourneyData && this.noRoutes && <FeedbackLabel>No routes match your criteria</FeedbackLabel> }
        <RouteChoicesChart
          links={this.links}
          nodes={this.nodes}
          linksMetadata={this.linksMetadata}
          setTooltipInfo={this.setTooltipInfo}
          shouldUpdate={this.props.shouldUpdate}
          resetForceRouteChoicesChartUpdate={this.props.resetForceRouteChoicesChartUpdate}
          hoveredRouteId={this.props.hoveredRouteId}
        />
        {
          this.state.link &&
          <RouteInfoTooltip
            link={this.state.link}
            x={this.state.x}
            y={this.state.y}
            hidden={this.state.isTooltipHidden}
            maxDuration={this.maxDuration}
          />
        }
      </Wrapper>
    )
  }
}

RouteChoicesChartManager.propTypes = {
  routes: PropTypes.object.isRequired,
  zoneIdToGroupColor: PropTypes.object.isRequired,
  zoneIdToName: PropTypes.object.isRequired,
  shouldUpdate: PropTypes.bool.isRequired,
  isFetchingZoneJourneyData: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  hoveredRouteId: PropTypes.number,
  resetForceRouteChoicesChartUpdate: PropTypes.func.isRequired,
  setFilteredRouteIds: PropTypes.func.isRequired,
  setHoveredRouteId: PropTypes.func.isRequired,
  clearHoveredRouteId: PropTypes.func.isRequired
}

export default RouteChoicesChartManager
