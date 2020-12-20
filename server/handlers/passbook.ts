import { ApiSign, currentUser, HttpMethod, requireAdminAuth, requireAuth } from "@monsid/ugh-og"
import { passbookFetchController } from "../controllers/passbook/fetch";
import { passbookFetchAllController } from "../controllers/passbook/fetch-all";
import { passbookUserController } from "../controllers/passbook/fetch-ughId";
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
    },
    {
        url: "/fetch/:ughId",
        method: HttpMethod.Get,
        controller: passbookUserController,
        middlewares: [currentUser, requireAdminAuth]
    }
];
