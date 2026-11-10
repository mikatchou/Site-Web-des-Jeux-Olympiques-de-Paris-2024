import { ACCESS_TOKEN } from "../../constants";

function createFakeJwt(payload: object) {
    return `header.${btoa(JSON.stringify(payload))}.signature`;
}

async function authenticated_user() {
    localStorage.setItem("first_name", "Mika");
    localStorage.setItem(
        ACCESS_TOKEN,
        createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 600 })
    );
}

export default authenticated_user