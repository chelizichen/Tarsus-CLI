import http from "@/utils/http";

export function testRequest() {
    return http({
        url: "/test",
    })
}
