import { Message } from "botframework-directlinejs";

enum LiveChatWidgetMockType {
    Test = "Test",
    Demo = "Demo"
}

export interface IMockProps {
    type: LiveChatWidgetMockType,
    mockActivities?: Message[];
}