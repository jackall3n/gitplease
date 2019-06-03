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

    static async tag(tag: string) {
        return await git().addTag(tag);
    }

    static async pull() {
        return await git().pull();
    }

    static async pushTags() {
        return await git().pushTags();
    }
}
