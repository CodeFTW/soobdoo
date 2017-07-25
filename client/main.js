import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import SubtitlesLines from '/model/SubtitlesLines';
import SubtitlesWords from '/model/SubtitlesWords';

import './main.html';

Template.startTimer.onCreated(function () {
    this.timer = new ReactiveVar(0);
});

const getCurrentSubtitleLine = () => {
    const subtitleLine = SubtitlesLines.findOne({
        milliSecondsStart: {$lte: Template.instance().timer.get()},
        milliSecondsEnd: {$gte: Template.instance().timer.get()}
    });
    return subtitleLine ? subtitleLine : '';
};

Template.startTimer.helpers({
    subtitleLine() {
        return getCurrentSubtitleLine();
    },
    subtitleWord() {
        const currentSubtitleLine = getCurrentSubtitleLine().text;
        if(!currentSubtitleLine)
            return '';

        const words = currentSubtitleLine.split(' ').map(word => word.toLowerCase());
        console.log(words);
        return SubtitlesWords.find({word: {$in: words}}, {sort: {frequency: 1}, limit: 1}).fetch()[0];
    },
    timer() {
        return Template.instance().timer.get();
    }
});

Template.startTimer.events({
    'click button'(event, instance) {
        // increment the counter when button is clicked
        setInterval(() => {
            instance.timer.set(instance.timer.get() + 1000);
            console.log(instance.timer.get());
        }, 1000);
    },
});
