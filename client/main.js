import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import SubtitlesLines from '/model/SubtitlesLines';
import SubtitlesWords from '/model/SubtitlesWords';
import TimeConverter from '/imports/core/TimeConverter';


import './main.html';

Template.startTimer.onCreated(function() {
    this.timer = new ReactiveVar(0);
    this.playerHandler = new ReactiveVar(null);
});

const getCurrentSubtitleLine = () => {
    const subtitleLine = SubtitlesLines.findOne({
        milliSecondsStart: { $lte: Template.instance().timer.get() },
        milliSecondsEnd: { $gte: Template.instance().timer.get() }
    });
    return subtitleLine ? subtitleLine : '';
};

Template.startTimer.helpers({
    subtitleLine() {
        return getCurrentSubtitleLine();
    },
    subtitleWord() {
        const currentSubtitleLine = getCurrentSubtitleLine().text;
        if (!currentSubtitleLine)
            return '';

        const words = currentSubtitleLine.split(' ').map(word => word.toLowerCase());
        // console.log(words);
        return SubtitlesWords.find({ word: { $in: words } }, { sort: { frequency: 1 }, limit: 1 }).fetch()[0];
    },
    timer() {
        return TimeConverter.fromMilliseconsToTime(Template.instance().timer.get());
    },
    playerHandler() {
        return Template.instance().playerHandler.get();
    }
});

Template.startTimer.events({
    'click .js-play' (event, instance) {
        instance.playerHandler.set(Meteor.setInterval(() => {
            instance.timer.set(instance.timer.get() + 1000);
            console.log(instance.timer.get());
        }, 1000));

    },
    'click .js-pause' (event, instance) {
        Meteor.clearInterval(instance.playerHandler.get());
        instance.playerHandler.set(null);
    },
    'click .js-back' (event, instance) {
        instance.timer.set(instance.timer.get() - 1000);
    },
    'click .js-forward' (event, instance) {
        instance.timer.set(instance.timer.get() + 1000);
    },
    'click .lampada-js' (event) {
        element = event.currentTarget;
        if (element.src.match("lampada-on")) {
            element.src = "https://www.devfuria.com.br/javascript/code-lampada/lampada-off.gif";
        } else {
            element.src = "https://www.devfuria.com.br/javascript/code-lampada/lampada-on.gif";
        }
    }
});