import * as inquirer from "inquirer";
import * as open from 'open';

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
        const url = `http://whdev:8080/tfs/CreativeTechnologiesCollection/mochi/_git/front-end/pullrequestcreate?targetRef=${encodeURIComponent(target)}&sourceRef=${encodeURIComponent(source)}`;

        await open(url);
    }

    public async run() {
        const {current, choices} = await this.getChoices();

        const {target, source} = await inquirer.prompt([{
            name: 'target',
            type: 'list',
            message: 'What is the target?',
            choices,
            pageSize: 100,
            default: 'master'
        }, {
            name: 'source',
            type: 'list',
            message: 'What is the source?',
            choices,
            pageSize: 100,
            default: current
        }]);

        await this.createPullRequest(target, source);
    }
}
