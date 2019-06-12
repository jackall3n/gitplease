import inquirer from 'inquirer';
import {Controller} from "../types/controller";
import {Git} from "../services/git";

interface IBranchAnswers {
    branch_name: string;
    ticket_number: number;
    prefix: 'feature/' | 'bugfix/' | 'chore/' | '<blank>';
    branch_purpose?: string;
}

class Branch extends Controller {
    generateBranchName(answers: IBranchAnswers) {
        const segments : string[] = [];

        if (answers.prefix !== '<blank>') {
            segments.push(answers.prefix);
        }

        if (!isNaN(answers.ticket_number)) {
            segments.push(`PLO-${answers.ticket_number}`);
        } else if (answers.branch_purpose !== undefined) {
            segments.push(answers.branch_purpose.toLowerCase().replace(/ /gm, '-'))
        } else {
            return undefined;
        }

        return segments.join('')
    }

    async run() {
        const {branch_name} = await inquirer.prompt<IBranchAnswers>([{
            type: 'list',
            message: 'What prefix would you like?',
            name: 'prefix',
            choices: ['feature/', 'chore/', 'bugfix/', '<blank>']
        }, {
            type: 'number',
            message: 'What is the ticket number?',
            name: 'ticket_number',
            when: ({prefix}) => prefix !== '<blank>'
        }, {
            type: 'input',
            message: 'What is the purpose of the branch?',
            name: 'branch_purpose',
            when: ({ticket_number, prefix}) => isNaN(ticket_number) && prefix !== '<blank>'
        }, {
            type: 'input',
            message: 'What is the branch name?',
            name: 'branch_name',
            default: answers => this.generateBranchName(answers)
        }]);

        await Git.checkoutBranch(branch_name);
    }
}

export {Branch}
