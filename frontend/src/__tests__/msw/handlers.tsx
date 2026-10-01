import { authHandlers } from "./handlers/authHandlers";
import { disciplinesHandlers } from "./handlers/disciplinesHandlers";

export const handlers = [
    ...authHandlers,
    ...disciplinesHandlers
]