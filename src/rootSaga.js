import zoneData from './modules/zone-data'
import datetimeManager from './modules/datetime-manager'
import map from './modules/map'
import zoneManager from './modules/zone-manager'

export default function * rootSaga () {
  yield [
    zoneData.sagas.watchAndUpdateZoneJourneys(),
    zoneData.sagas.getInitialZoneJourneys(),
    zoneData.sagas.getZoneCompositions(),
    datetimeManager.sagas.watchAndUpdateRidership(),
    datetimeManager.sagas.getInitialRidership(),
    map.sagas.updateMapOnLoad(),
    map.sagas.watchForMouseEvents(),
    zoneManager.sagas.watchForResetEditGroup(),
    zoneManager.sagas.watchForZoneSelectionChanges()
  ]
}
