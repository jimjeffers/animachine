'use strict';

var EventEmitter = require('eventman');
var inherits = require('inherits');
var Dialog = require('../utils/Dialog');
var OptionLine = require('../utils/OptionLine');
var StringInput = require('../utils/StringInput');

var ACTIONS = [{
    method: 'play',
    arguments: [{type: 'number'}, {}],
}];

function TriggerMap(opt) {

    EventEmitter.call(this);

    this._triggers = {};

    this._createEditDialog();
}

inherits(TriggerMap, EventEmitter);
var p = TriggerMap.prototype;
module.exports = TriggerMap;

p.getSave = function () {

    return _.cloneDeep(this._triggers);
};

p.useSave = function (save) {

    if (!save) throw Error;

    this._triggers = _.cloneDeep(this._triggers);

    this.emit('change');
};

p.getScript = function () {

    var ret = [];

    this._triggers.forEach(trigger => {

        let args = _.pluck(trigger.action.argument, 'value').join(', '),
            action = `${trigger.action.method}(${args})`;

        ret.push(`$(${trigger.targets}).on(${trigger.events}, ${action});`);
    });

    return ret.join('\n');
};

p.showEditor = function () {

    this._editDialog.show();
};

p.addTrigger = function (trigger) {

    trigger = trigger || this._createTrigger();

    this._triggers.push(trigger);

    return tirgger;

    this.emit('change');
};

p.removeTrigger = function (trigger) {

    var idx = this._triggers.indexOf(trigger);
    if (idx === -1) return;
    this.triggers.splice(idx, 1);

    this.emit('change');
};

p._createTrigger = function () {

    return {
        name: 'myTrigger',
        events: ['click'],
        targets: ['#selector'],
        actions: [{method: 'play', arguments: []}],
    };
};

p._createEditDialog = function () {

    var dialog = new Dialog({title: 'TriggerMap'})
            .addButton('ok', 'hide'),
        deCont = dialog.deContent,
        currTrigger;

    this._editDialog = dialog;

    var selectTrigger = trigger => {
        
        if (!trigger) return;

        currTrigger = trigger;
        olName.inputs.input.name = currTrigger.name;
        inpEvent = currTrigger.events[0];
        inpSelector = currTrigger.selectors[0];
        inpMethod = currTrigger.actions[0].method;
        inpArguments = currTrigger.actions[0].argiuments[0];
    };

    amgui.createBtn({
        parent: deCont,
        text: 'new trigger',
        onClick: () => selectTrigger(this.addTrigger()),
    });

    var olName = new OptionLine({
        title: 'name:',
        parent: deCont,
        inputs: [{
            name: 'name',
            type: 'string',
            placeholder: 'name of the trigger',
            onChange: v => currTrigger.name = v,
        }]
    });

    var refreshTriggerList = () => deTriggerList.setItems(_.pluck(this._triggers, name));
    var deTriggerList = amgui.createDropdown({
        parent: deCont,
        onSelect: e => selectTrigger(_.find(this._triggers, {name: e.detail.selection})),
    });
    refreshTriggerList();
    this.on('change', refreshTriggerList);

    amgui.createLabel({parent: deCont, text: 'name:'});
    var inpName = new StringInput({
        parent: deCont,
        defaultValue: 'myTrigger',
        onChange: v => currTrigger.name = v,
    });


    amgui.createLabel({parent: deCont, text: 'event:'});
    var inpEvent = new StringInput({
        parent: deCont,
        defaultValue: 'click',
        suggestions: 'click,mousedown,mouseup,mouseover,mouseout,ready,mouseenter,mouseleave,change'.split(','),
        onChange: v => currTrigger.events[0] = v,
    });

    amgui.createLabel({parent: deCont, text: 'selector:'});
    var inpSelector = new StringInput({
        parent: deCont,
        defaultValue: '#selector',
        onChange: v => currTrigger.targets[0] = v,
    });

    amgui.createLabel({parent: deCont, text: 'action:'});
    var inpMethod = new StringInput({
        parent: deCont,
        defaultValue: 'play',
        suggestions: _.pluck(ACTIONS, 'method'),
        onChange: v => currTrigger.actions[0].method = v,
    });
    amgui.createLabel({parent: deCont, text: '('});
    var inpArguments = new StringInput({
        parent: deCont,
        defaultValue: '',
        onChange: v => currTrigger.actions[0].arguments[0] = v,
    });
    amgui.createLabel({parent: deCont, text: ')'});

    amgui.createBtn({
        parent: deCont,
        text: 'remove trigger',
        onClick: () => {
            this.removeTrigger(currTrigger);
        },  
    });
};