import {Git} from "../services/git";
import {Controller} from "../types/controller";
import * as inquirer from "inquirer";

export class Checkout extends Controller {

    public async getChoices() {
        const {current, all} = await Git.branches();

        const choices = all.map((branch, index) => ({
            value: branch,
            name: `${index + 1}. ${branch}`
        }));

        return {
            choices,
            current
        }
    }

    public async run() {
        const {choices} = await this.getChoices();

        const {branch} = await inquirer.prompt([{
            name: 'branch',
            type: 'list',
            message: 'What would you like to checkout?',
            choices,
            pageSize: 100,
            default: 'master'
        }]);

        await Git.checkout(branch);
    }
}
