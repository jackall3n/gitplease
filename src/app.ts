import * as minimist from 'minimist';

import {Menu, Checkout, PullRequest} from "./views";
import {Tags} from "./views/tags";

interface IArgs {
    checkout: boolean;
    pullRequest: boolean;
    tags: boolean;
}

const options = minimist<IArgs>(process.argv.slice(2), {
    boolean: ['checkout', 'pullRequest'],
    default: {
        checkout: false,
        pullRequest: false,
        tags: false
    },
    alias: {
        c: 'checkout',
        pr: 'pullRequest',
        t: 'tags'
    }
});

class App {
    public async run() {
        let controller;

        if (options.checkout) {
            controller = new Checkout();
        } else if (options.pullRequest) {
            controller = new PullRequest();
        } else if (options.tags) {
            controller = new Tags();
        } else {
            controller = new Menu();
        }

        return await controller.run();
    }
}

export default App;
