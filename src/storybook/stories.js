import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, array, object } from '@storybook/addon-knobs'
import { injectGlobal } from 'styled-components'
import ThemeProviderDecorator from './ThemeProviderDecorator'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../rootReducer'

import ZoneButton from '../modules/core/components/ZoneButton'
import AddZoneButton from '../modules/zone-manager/components/AddZoneButton'
import SelectedZoneButton from '../modules/zone-manager/components/SelectedZoneButton'

import { ZoneDataContainer } from '../modules/zone-data/'

import { ZoneManagerContainer } from '../modules/zone-manager'

import { MapContainer, Tooltip } from '../modules/map'

const middleware = []
middleware.push(thunkMiddleware) // thunk must be first

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
)

const ReduxProviderDecorator = (storyFn) => (
  <Provider store={store}>
    {storyFn()}
  </Provider>
)

addDecorator(withKnobs)
addDecorator(ReduxProviderDecorator)
addDecorator(ThemeProviderDecorator)

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Poppins');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }
`

storiesOf('Zone buttons', module)
  .add('Base zone button', () => {
    return <ZoneButton>10</ZoneButton>
  })
  .add('Button for selected zones', () => {
    return <SelectedZoneButton>9</SelectedZoneButton>
  })
  .add('Add zone button', () => {
    return <AddZoneButton />
  })

storiesOf('Zone data list', module)
  .add('No zone selected', () =>
    <ZoneDataContainer
    />
  )
  .add('1 hovered zone', () =>
    <ZoneDataContainer
      hoveredZone={{
        name: 'Toa Payoh West'
      }}
    />
  )
  .add('2 origin zones selected', () =>
    <ZoneDataContainer
      hoveredZone={{
        name: 'Toa Payoh West'
      }}
      originZones={[{
        id: 123,
        name: `National University Of S'pore`,
        color: '#ADADAD'
      }, {
        id: 456,
        name: 'Kent Ridge',
        color: '#C4C4C4'
      }]}
    />
  )

storiesOf('Zone manager', module)
  .add('base', () => {
    return <ZoneManagerContainer />
  })

storiesOf('Map', module)
  .add('base', () => <MapContainer />)
  .add('origin selection mode', () => <MapContainer zoneSelectionMode='origin'/>)

storiesOf('Tooltip', module)
  .add('no x and y', () => <Tooltip>this is a tooltip</Tooltip>)
  .add('with x and y', () => <Tooltip x={50} y={100}>x is 50, y is 100</Tooltip>)
  .add('long text', () => <Tooltip x={50} y={100}>x is 50, y is 100</Tooltip>)
