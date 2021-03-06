import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import ZoneButton from '../../core/components/ZoneButton'
import get from 'lodash.get'

const Wrapper = styled.div`
  display: flex;
  margin-bottom: ${({small}) => small ? '-0.2em' : '0'};
  margin-top: ${({small}) => small ? '-0.2em' : '0'};
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: 0.05em;
  margin-left: ${({small}) => small ? '0' : '0.4em'};
  white-space: nowrap;
  overflow: hidden;
`

const MainDetail = styled.div`
  font-weight: ${({small}) => small ? 600 : 700};
  font-size: ${({small}) => small ? '0.98em' : '1.2em'};
  margin-bottom: -0.05em;

  ${({lineWrap}) => lineWrap && css`
    white-space: pre-wrap;
    line-height: 1.05;
    margin: 0.2em 0;
  `}
`

const SubDetail = styled.div`
  font-size: 0.7em;
`

export const landUseColors = {
  'AGRICULTURE': 'rgb(140, 135, 93)',
  'BEACH AREA': 'rgb(249, 247, 198)',
  'BUSINESS': 'rgb(177, 1, 102)',
  'BUSINESS PARK': 'rgb(0, 127, 162)',
  'CEMETERY': 'rgb(159, 137, 0)',
  'CIVIC & COMMUNITY INSTITUTION': '#f48fb1',
  'COMMERCIAL': '#64b5f6',
  'EDUCATIONAL INSTITUTION': '#ffee58',
  'HEALTH & MEDICAL CARE': '#e57373',
  'HOTEL': 'rgb(167, 156, 198)',
  'MASS RAPID TRANSIT': '#ffcc80',
  'OPEN SPACE': '#dce775',
  'PARK': '#9ccc65',
  'PLACE OF WORSHIP': 'rgb(204, 0, 33)',
  'PORT / AIRPORT': 'rgb(208, 208, 208)',
  'RESERVE SITE': '#fff59d',
  'RESIDENTIAL': '#ffab91',
  'ROAD': '#cfd8dc',
  'SPECIAL USE': 'rgb(81, 103, 3)',
  'SPORTS & RECREATION': 'rgb(163, 212, 157)',
  'TRANSPORT FACILITIES': 'rgb(149, 154, 157)',
  'UTILITY': 'rgb(148, 153, 156)',
  'WATERBODY': 'rgb(190, 222, 243)',
  'WHITE': 'rgb(245, 241, 242)'
}

const ZoneDetails = ({ color, zoneId, mainDetail, subDetail, animate, small, lineWrap }) => {
  return (
    <Wrapper small={small}>
      <ZoneButton
        color={color || get(landUseColors, mainDetail, '#ddd')}
        hover={false}
        animate={animate}
        small={small}
      >
        {zoneId}
      </ZoneButton>
      <Details small={small}>
        <MainDetail title={mainDetail} small={small} lineWrap={lineWrap}>{mainDetail}</MainDetail>
        <SubDetail title={subDetail}>{subDetail}</SubDetail>
      </Details>
    </Wrapper>
  )
}

ZoneDetails.propTypes = {
  color: PropTypes.string,
  zoneId: PropTypes.any,
  mainDetail: PropTypes.string,
  subDetail: PropTypes.string,
  animate: PropTypes.bool,
  small: PropTypes.bool,
  lineWrap: PropTypes.bool
}

ZoneDetails.defaultProps = {
  animate: true,
  small: false,
  lineWrap: false
}

export default ZoneDetails
