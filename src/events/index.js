import events from 'events'

class EventRegistry extends events.EventEmitter {
    onMany(arr, onEvent) {
        let self = this;

        arr.forEach(function (eventName) {
            self.on(eventName, onEvent);
        });
    }
}

const EventRegistryInstance = new EventRegistry();
EventRegistryInstance.setMaxListeners(100);

export default EventRegistryInstance;
