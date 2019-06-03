import inquirer from "inquirer";
import open from 'open';

import {Git} from "../services/git";
import {Controller} from "../types/controller";

export class PullRequest extends Controller {

    public async getChoices() {
        const {all, current} = await Git.branches();

        const choices = all.map((branch, index) => ({
            value: branch,
            name: `${index + 1}. ${branch}`
        }));

        return {
            choices,
            current
        }
    }

    public async createPullRequest(target: string, source: string) {
        const {refs} = await Git.remote();

        const url = `${refs.push}/pullrequestcreate?targetRef=${encodeURIComponent(target)}&sourceRef=${encodeURIComponent(source)}`;

        await open(url);
    }

    public async run() {
        const {current, choices} = await this.getChoices();

        const {target, source} = await inquirer.prompt([{
            name: 'source',
            type: 'list',
            message: 'Pick a source',
            choices,
            pageSize: 100,
            default: current
        }, {
            name: 'target',
            type: 'list',
            message: 'Pick a target',
            choices,
            pageSize: 100,
            default: 'master'
        }]);

        await this.createPullRequest(target, source);
    }
}
