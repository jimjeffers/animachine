import React from 'react'
import QuickInterface from 'json-vision'
import createSpecialParamSettings from './createSpecialParamSettings'

function showItemSettingsDialog() {
  BETON.require('item-settings-dialog').show()
}

function handleSelectClick(id) {
  const {actions, selectors} = BETON.require('project-manager')
  const {type} = selectors.getItemById({id})
  const currentTrackId = type === 'track'
    ? id
    : selectors.getParentTrackOfParam(trackId).id
  const timelineId =
    selectors.getParentTimelineOfTrack({trackId: currentTrackId}).id

  actions.setLastSelectedItemId({itemId: id})
  actions.setCurrentTrackIdOfTimeline({timelineId, currentTrackId})
}

function handleToggleOpen(id) {
  const {actions, selectors} = BETON.require('project-manager')
  const {type} = selectors.getItemById({id})
  if (type === 'param') {
    actions.toggleOpenInTimelineOfParam({paramId: id})
  }
  else if (type === 'track') {
    actions.toggleOpenInTimelineOfTrack({trackId: id})
  }
}


function createTrackSettings({id, name, openInTimeline}) {
  const parentTimeline = selectors.getParentTimelineOfTrack({trackId: id})
  return {
    label: name,
    open: openInTimeline,
    onClick: handleSelectClick.bind(null, id),
    onToggleOpen: handleToggleOpen.bind(null, id),
    buttons: connect => [
      {
        icon: 'plus',
        tooltip: 'add a new param to this track',
        onClick: connect => {
          BETON.require('project-manager').actions.addParamToTrack({
            trackId: id,
          })
          showItemSettingsDialog()
        }
      }
    ],
    highlighted: parentTimeline.currentTrackId === id,
    contextMenu: {
      items: [
        {
          label: 'new track',
          icon: 'plus',
          onClick: connect => {
            BETON.require('project-manager').actions.addTrackToTimeline({
              timelineId: parentTimeline.id,
            })
            showItemSettingsDialog()
          }
        }, {
          label: 'new param',
          icon: 'add',
          onClick: connect => {
            BETON.require('project-manager').actions.addParamToTrack({
              trackId: id,
            })
            showItemSettingsDialog()
          }
        }, {
          items: [
            {
              label: 'settings',
              icon: 'cog',
              onClick: connect => {
                handleSelectClick(connect)
                showItemSettingsDialog()
              }
            }
          ]
        }
      ]
    }
  }
}

function createParamSettings({id, name, openInTimeline}) {
  return {
    label: name,
    open: openInTimeline,
    onClick: handleSelectClick.bind(null, id),
    onToggleOpen: handleToggleOpen.bind(null, id),
    contextMenu: [{
      items: [
        {
          label: 'settings',
          icon: 'cog',
          onClick: connect => {
            handleSelectClick(connect)
            showItemSettingsDialog()
          }
        }
      ]
    }],
    ...createSpecialParamSettings({id, name})
  }
}

const renderParams = params => {
  const {getItemById} = BETON.require('project-manager').selectors
  return params
    .map(paramId => getItemById({id: paramId}))
    .map(({id, name, openInTimeline}) => (
      <QuickInterface {...{
        id,
        name,
        openInTimeline,
        createSettings: createParamSettings
      }}/>
    ))
}

const renderTracks = tracks => {
  const {getItemById} = BETON.require('project-manager').selectors
  return tracks
    .map(trackId => getItemById({id: trackId}))
    .map(({id, name, openInTimeline, params}) => (
      <QuickInterface {...{
        id,
        name,
        openInTimeline,
        createSettings: createTrackSettings
      }}>
        renderParams(params)
      </QuickInterface>
    ))
}

export default tracks => (
  <QuickInterface createSettings={() => {hiddenHead: true}}>
    {renderTracks(tracks)}
  </QuickInterface>
)
