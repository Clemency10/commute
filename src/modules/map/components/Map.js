import React, { Component } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash.throttle'
import MapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styled from 'styled-components'
import TooltipContainer from '../containers/TooltipContainer'
import arrowImage from '../arrow.png'

const Wrapper = styled.div`
  left: 0;
  position: fixed;
  top: 0;
`

export class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: {
        latitude: 1.286052,
        longitude: 103.916023,
        zoom: 10.84,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      }
    }
    this.resize = this.resize.bind(this)
    this.onViewportChange = this.onViewportChange.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.handleHover = this.handleHover.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.hoverOverFeature = this.hoverOverFeature.bind(this)
    this.hoverOverFeature = throttle(this.hoverOverFeature, 100)
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize)
    this.resize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  onLoad () {
    this.props.mapHasLoaded()
    const map = this.mapRef.getMap()
    map.loadImage(arrowImage, (err, image) => {
      if (err) {
        console.log(err)
        return
      }
      map.addImage('arrow', image)
    })
  }

  onViewportChange (viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    })
  }

  resize () {
    this.onViewportChange({
      ...this.state.viewport,
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  hoverOverFeature (hoveredFeature) {
    this.props.hoverOverFeature(hoveredFeature)
  }

  handleHover (event) {
    const {features, srcEvent: {x, y}} = event
    let hoveredFeature = null
    if (features && features[0]) {
      hoveredFeature = features[0]
      this.hoverOverFeature(hoveredFeature)
    }
    this.setState({hoveredFeature, x, y})
  }

  handleClick (event) {
    const {features, srcEvent: {shiftKey}} = event
    if (features) {
      this.props.clickFeatures(features, shiftKey)
    }
  }

  render () {
    return (
      <Wrapper>
        <MapGL
          ref={map => (this.mapRef = map)}
          {...this.state.viewport}
          mapStyle={this.props.mapStyle}
          onViewportChange={this.onViewportChange}
          onLoad={this.onLoad}
          onHover={this.handleHover}
          onClick={this.handleClick}
          doubleClickZoom={false}
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          clickRadius={5}
        >
          {this.state.hoveredFeature &&
            <TooltipContainer x={this.state.x} y={this.state.y} feature={this.state.hoveredFeature}/>
          }
        </MapGL>
      </Wrapper>
    )
  }
}

Map.propTypes = {
  mapStyle: PropTypes.object.isRequired,
  mapHasLoaded: PropTypes.func.isRequired,
  hoverOverFeature: PropTypes.func.isRequired,
  clickFeatures: PropTypes.func.isRequired
}

export default Map
