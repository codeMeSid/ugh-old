import { ApiSign, currentUser, HttpMethod, requireAdminAuth, requireAuth } from "@monsid/ugh";
import { passbookFetchController } from "../controllers/passbook/fetch";
import { passbookFetchAllController } from "../controllers/passbook/fetch-all";
export const passbookHandler: Array<ApiSign> = [
    {
        url: "/fetch",
        method: HttpMethod.Get,
        controller: passbookFetchController,
        middlewares: [currentUser, requireAuth]
    },
    {
        url: "/fetch/all",
        method: HttpMethod.Get,
        controller: passbookFetchAllController,
        middlewares: [currentUser, requireAdminAuth]
    }
];
