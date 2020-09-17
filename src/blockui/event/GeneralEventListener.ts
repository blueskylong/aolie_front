export interface GeneralEventListener {
    handleEvent(eventType: string, data: object, source: object, extObject?: any);
}
