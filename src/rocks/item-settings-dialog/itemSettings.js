import filter from 'lodash/collection/filter'
import find from 'lodash/collection/find'
import selectorSettings from './selectorSettings'

const getWhitelist = type => {
  switch (type) {
    case 'project':
      return ['name']
    case 'timeline':
      return ['name']
    case 'track':
      return ['name', 'selectors']
    case 'param':
      return ['name', 'params']

  }
}

function createSelector(itemType, key) {
  return connect => (
    connect.parent &&
    connect.parent.type === itemType &&
    connect.key === key
  )
}

function createInputSettingsNode(itemType, key, onChange) {
  return {
    selector: createSelector(itemType, key),
    input: {
      onChange(value, connect) {
        const {actions} = BETON.require('project-manager')
        onChange(value, connect.parent.id, actions)
      }
    }
  }
}
function createChildSettingsNode(itemType, childrenName) {
  return {
    selector: createSelector(itemType, key),
    label: `child ${childrenName}s`,
    settings: {
      children: null
    }
  }
}

export default [
  {
    selector: 'root',
    label: connect => connect.value.type,
    whitelist: connect => getWhitelist(connect.value.type),
  },
  createInputSettingsNode('project', 'name', (value, itemId, actions) =>
    actions.setNameOfProject({name: value, projectId: itemId})),
  createInputSettingsNode('timeline', 'name', (value, itemId, actions) =>
    actions.setNameOfTimeline({name: value, timelineId: itemId})),
  createInputSettingsNode('track', 'name', (value, itemId, actions) =>
    actions.setNameOfTrack({name: value, trackId: itemId})),
  createInputSettingsNode('param', 'name', (value, itemId, actions) =>
    actions.setNameOfParam({name: value, paramId: itemId})),
  ...selectorSettings
]
