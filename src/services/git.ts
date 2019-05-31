import * as git from 'simple-git/promise';

export class Git {
    static async branches() {
        return await git().branch([]);
    }

    static async checkout(branch: string) {
        await git().checkout(branch);
    }
}
