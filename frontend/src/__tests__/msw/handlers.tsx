import { authHandlers } from "./handlers/authHandlers";
import { disciplinesHandlers } from "./handlers/disciplinesHandlers";
import { eventHandlers } from "./handlers/eventHandlers";
import { eventsHandlers } from "./handlers/eventsHandlers"

export const handlers = [
    ...authHandlers,
    ...disciplinesHandlers,
    ...eventsHandlers,
    ...eventHandlers,
]