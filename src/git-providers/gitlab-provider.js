import netlify from "netlify-auth-providers";
import React from "react";
import queryString from "query-string";

import versioner from "./versioner";
import { SOURCE } from "./sources";

const TOKEN_KEY = "gitlab-token";

function isLoggedIn() {
    return !!window.localStorage.getItem(TOKEN_KEY);
}

function getUrlParams() {
    const parsed = queryString.parse(window.location.search);

    if (!parsed.file) {
        return [];
    }

    const filePart = parsed.file.split("/") || [];

    const flagIndex = filePart.indexOf('-');

    if (flagIndex === -1) {
        return [];
    }

    const repoInfo = filePart.slice(1, flagIndex);
    const filePath = filePart.slice(flagIndex + 1);

    const [
        action,
        sha,
        ...paths
    ] = filePath;

    if (action !== "commits" && action !== "blob") {
        return [];
    }

    return [repoInfo.join('/'), sha, paths.join("/")];
}

function getPath() {
    const [, , path] = getUrlParams();
    return path;
}

function showLanding() {
    const [repo, ,] = getUrlParams();
    return !repo;
}

function logIn() {
    // return new Promise((resolve, reject) => {
    var authenticator = new netlify({
        site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
    });
    authenticator.authenticate({ provider: "gitlab", scope: "api" }, function (
        err,
        data
    ) {
        if (err) {
            console.error(err);
            return;
        }
        window.localStorage.setItem(TOKEN_KEY, data.token);
        window.location.reload(false);
    });
    // });
}

function LogInButton() {
    return (
        <button
            onClick={logIn}
            style={{ fontWeight: 600, padding: "0.5em 0.7em", cursor: "pointer" }}
        >
            <div>Sign in with GitLab</div>
        </button>
    );
}

function getParams() {
    const [repo, sha, path] = getUrlParams();
    const token = window.localStorage.getItem(TOKEN_KEY);
    return { repo, sha, path, token };
}

async function getVersions(last) {
    const params = { ...getParams(), last };
    return await versioner.getVersions(SOURCE.GITLAB, params);
}

export default {
    showLanding,
    getPath,
    getVersions,
    logIn,
    isLoggedIn,
    LogInButton
};
