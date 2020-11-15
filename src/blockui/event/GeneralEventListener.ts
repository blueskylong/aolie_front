export interface GeneralEventListener {
    handleEvent(eventType: string, data: any, source: any, extObject?: any);
}
