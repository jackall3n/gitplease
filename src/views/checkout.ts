import {Git} from "../services/git";
import {Controller} from "../types/controller";
import * as inquirer from "inquirer";

export class Checkout extends Controller {

    public async getChoices() {
        const branches = await Git.branches();

        return branches.map((branch, index) => ({
            value: branch,
            name: `${index + 1}. ${branch}`
        }));
    }

    public async run() {
        const choices = await this.getChoices();

        const {branch} = await inquirer.prompt([{
            name: 'branch',
            type: 'list',
            message: 'What would you like to checkout?',
            choices
        }]);

        await Git.checkout(branch);
    }
}
