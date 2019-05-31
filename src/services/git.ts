import * as git from 'simple-git/promise';

export class Git {
    static async branches() {
        const branches = await git().branch([]);
        return branches.all;
    }

    static async checkout(branch: string) {
        await git().checkout(branch);
    }
}
