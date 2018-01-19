import {combineReducers} from 'redux'
import zoneManager from './modules/zone-manager'
import zoneData from './modules/zone-data'
import map from './modules/map'
import datetimeManager from './modules/datetime-manager'

export default combineReducers({
  zoneManager: zoneManager.reducer,
  zoneData: zoneData.reducer.zoneData,
  zoneDataFilters: zoneData.reducer.zoneDataFilters,
  map: map.reducer,
  datetimeBrushDomain: datetimeManager.reducer.datetimeBrushDomain,
  datetimeZoomDomain: datetimeManager.reducer.datetimeZoomDomain,
  ridershipDomain: datetimeManager.reducer.ridershipDomain,
  ridershipData: datetimeManager.reducer.ridershipData
})
