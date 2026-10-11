import { authHandlers } from "./handlers/authHandlers";
import { disciplinesHandlers } from "./handlers/disciplinesHandlers";
import { eventsHandlers } from "./handlers/eventsHandlers"

export const handlers = [
    ...authHandlers,
    ...disciplinesHandlers,
    ...eventsHandlers,
]