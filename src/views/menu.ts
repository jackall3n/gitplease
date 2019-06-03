import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import {Controller} from "../types/controller";
import {Checkout, PullRequest, Tag, Pull} from "./";

interface IMenuOption {
    name: string,
    value: () => any;
}

const MENU_OPTIONS: { [key: string]: IMenuOption } = {
    checkout: {
        name: 'Checkout',
        value: async () => await new Checkout().run()
    },
    pull_request: {
        name: 'Pull Request',
        value: async () => await new PullRequest().run()
    },
    tag: {
        name: 'Tag',
        value: async () => await new Tag().run()
    },
    pull: {
        name: 'Pull',
        value: async () => await new Pull().run()
    }
};

class Menu extends Controller {
    public getChoices() {
        return _.map(MENU_OPTIONS, (option, key) => ({
            value: key,
            name: option.name
        }))
    }

    public async run() {
        const choices = this.getChoices();

        const {option} = await inquirer.prompt([{
            type: 'list',
            name: 'option',
            message: 'Hey, what do you want to do?',
            choices
        }]);

        await MENU_OPTIONS[option].value();
    }
}

export {Menu};
