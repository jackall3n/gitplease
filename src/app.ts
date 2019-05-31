import * as minimist from 'minimist';

import {Menu, Checkout, PullRequest} from "./views";

interface IArgs {
    checkout: boolean;
}

const options = minimist<IArgs>(process.argv.slice(2), {
    boolean: ['checkout', 'pullRequest'],
    default: {
        checkout: false,
        pullRequest: false
    },
    alias: {
        c: 'checkout',
        pr: 'pullRequest'
    }
});

class App {
    public async run() {
        let controller;

        if (options.checkout) {
            controller = new Checkout();
        } else if (options.pullRequest) {
            controller = new PullRequest();
        } else {
            controller = new Menu();
        }

        return await controller.run();
    }
}

export default App;
