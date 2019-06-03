import * as git from 'simple-git/promise';

export class Git {
    static async branches() {
        return await git().branch([]);
    }

    static async checkout(branch: string) {
        await git().checkout(branch);
    }

    static async remote() {
        const remotes = await git().getRemotes(true);

        return remotes[0];
    }

    static async tags() {
        return await git().tags();
    }
}
